const {selectRandomWord} = require('../helpers/helpers');

class battle {
    constructor(id, from, to, words){
        this.id = id;
        this.from = from;
        this.to = to;
        const startingPlayer = Math.floor(Math.random() * 2);

        this.players = {[from.username]:{
            currentGuess: 0,
            totalGuesses: 0,
            attacks: 3,
            turn: startingPlayer == 1,
            words: words[0],
            guesses: {},
            latestGuess: {}
        },
        [to.username] : {
            currentGuess: 0,
            totalGuesses: 0,
            attacks: 3,
            turn: startingPlayer == 2,
            words: words[1],
            guesses: {},
            latestGuess: {}
        }};
        this.currentWord = 0;
        this.attacks = ["Hide Letter", "Force Letter", "Delete Row"]
        this.curses = [];
        this.currentPlayer = startingPlayer == 1 ? from.username : to.username
        this.otherPlayer = startingPlayer !== 1 ? from.username : to.username
        this.firstTurn = true;
    }

    attack(attack, value) {

    }
    
    publicState(playerUserName){
        const yourState = this.currentPlayer == playerUserName ? "take_turn" : 'wait';
        const opponent = this.currentPlayer == playerUserName ? this.otherPlayer : this.currentPlayer;

        const gameState = {
            battleId: this.id,
            round: this.currentWord+1,
            totalrounds: 3,
            yourState: yourState,
            timeLeft: 480_000,
            //yourGuesses: this.players[playerUserName].guesses,
            roundGuesses: this.players[playerUserName].currentGuess,
            totalGuesses: this.players[playerUserName].totalGuesses,
            firstTurn: this.firstTurn,
            opponent: {
                username: opponent,
                state: this.currentPlayer !== playerUserName ? "take_turn" : 'wait',
                guesses: this.players[opponent].guesses,
                roundGuesses: this.players[opponent].currentGuess,
                totalGuesses: this.players[opponent].totalGuesses
            }
        }
        return gameState;
    }

    async stop() {
        await stopBattle(this.invitationId);
        const invitationId = this.invitationId;
        const player1 = this.inviter
        this.io.to(`user:${player1}`).emit("battle:stopped", {
            invitationId
        })
        const player2 = this.invitee
        this.io.to(`user:${player2}`).emit("battle:stopped", {
            invitationId
        })
    }
}

module.exports = battle