// models/battleManager.js
const { randomUUID } = require("node:crypto");
const Battle = require("./battle");

class BattleManager {
  constructor({ io, createBattleWords }) {
    this.io = io;
    this.createBattleWords = createBattleWords;
    this.invitations = new Map(); // invitationId -> invitation
    this.battles = new Map();     // battleId -> Battle
    this.playerState = new Map(); // playerId -> { type, id }
  }

  isBusy(playerId) {
    return this.playerState.has(playerId);
  }
  
  hasInvitation(invitationId) {
    return this.invitations.has(invitationId);
  }

  getInvitation(invitationId) {
    if(this.hasInvitation(invitationId)){
        return this.invitations.get(invitationId);
    }else{
        return null;
    }
  }

  getPlayerBattle(playerId){
    if(!this.isBusy(playerId)){
        return {success: false, message: "Player is not in battle"};
    }else{
        const state = this.playerState.get(playerId);
        if(state.type != 'battle'){
            return {success: false, message: "Player only has a pending invitation", redirect: state.id};
        }
        return {success: true, battle: this.battles.get(state.id)};
    }
  }

  requestInvitation(from, to) {
    const fromId = from.id.toString();
    const toId = to.id.toString();

    if (fromId === toId || this.isBusy(fromId) || this.isBusy(toId)) {
      return { success: false, message: "A player is already busy." };
    }

    const invitationId = randomUUID();
    const invitation = {
      id: invitationId,
      from,
      to,
      status: "pending",
    };

    // Reserve both synchronously, before emitting the invite.
    this.invitations.set(invitationId, invitation);
    this.playerState.set(fromId, { type: "invitation", id: invitationId });
    this.playerState.set(toId, { type: "invitation", id: invitationId });

    invitation.expirationTimer = setTimeout(
        () => this.expireInvitation(invitationId),
        120_000
    );

    this.io.to(`user:${toId}`).emit("battle:invite", {
      invitationId,
      from: { id: fromId, username: from.username },
    });

    return { success: true, invitationId };
  }

  async respondToInvitation(invitationId, responderId, accepted) {
    const invitation = this.getInvitation(invitationId);

    if (!invitation || invitation.to.id !== responderId) {
      return { success: false, message: "Invitation not found." };
    }
    if (invitation.status !== "pending") {
      return { success: false, message: "Invitation is no longer pending." };
    }

    const requesterRoom = `user:${invitation.from.id}`;

    if (!accepted) {
      this.releaseInvitation(invitation);
      this.io.to(requesterRoom).emit("battle:invite:declined", {
        invitationId,
        fromUsername: invitation.to.username,
      });
      return { success: true };
    }
    clearTimeout(invitation.expirationTimer);
    invitation.status = "starting";
    let words;
    try {
        words = await this.createBattleWords();
        if(!words){
            this.io.to(`user:${invitation.to.id}`).emit("battle:invite:cancelled", {
                invitationId,
            });
            this.io.to(`user:${invitation.from.id}`).emit("battle:invite:cancelled", {
                invitationId,
            });
            this.releaseInvitation(invitation)
            return {success: false, message: "Could not create words for the battle"}
        }
    } catch (error) {
        this.io.to(`user:${invitation.to.id}`).emit("battle:invite:cancelled", {
            invitationId,
        });
        this.io.to(`user:${invitation.from.id}`).emit("battle:invite:cancelled", {
            invitationId,
        });
        this.releaseInvitation(invitation)
        return {success: false, message: "Could not create words for the battle"}
    }
    
    
    const battleId = randomUUID();
    const battle = new Battle(battleId, invitation.from, invitation.to, words);

    this.invitations.delete(invitationId);
    this.battles.set(battleId, battle);
    this.playerState.set(invitation.from.id.toString(), { type: "battle", id: battleId });
    this.playerState.set(invitation.to.id.toString(), { type: "battle", id: battleId });

    for (const player of [invitation.from, invitation.to]) {
    this.io.to(`user:${player.id}`).emit(
        "battle:started",
        battle.publicState(player.username)
    );
    }
    return { success: true, battleId };
  }

  releaseInvitation(invitation) {
    clearTimeout(invitation.expirationTimer);
    this.invitations.delete(invitation.id);
    for (const player of [invitation.from, invitation.to]) {
      const id = player.id.toString();
      if (this.playerState.get(id)?.id === invitation.id) {
        this.playerState.delete(id);
      }
    }
  }

  releaseBattle(battle){
    this.battles.delete(battle.id);
    for (const player of [battle.from, battle.to]) {
      const id = player.id.toString();
      if (this.playerState.get(id)?.id === battle.id) {
        this.playerState.delete(id);
      }
    }
  }

  expireInvitation(invitationId) {
    const invitation = this.getInvitation(invitationId);

    if (!invitation || invitation.status !== "pending") {
        return;
    }

    this.releaseInvitation(invitation);

    this.io.to(`user:${invitation.from.id}`).emit("battle:invite:expired", {
        invitationId,
        message: "Battle invitation expired.",
    });

    this.io.to(`user:${invitation.to.id}`).emit("battle:invite:cancelled", {
        invitationId,
    });
  }
  
}

module.exports = BattleManager;