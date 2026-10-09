const { randomUUID } = require("node:crypto");
const helpers = require('../helpers/helpers');
const { isOnline } = require('../helpers/presence');
const queries = require('../queries/queries');

const startGame = async (req, res) => {
    let difficulty = req.query.difficulty;

    try {
       difficulty = parseInt(difficulty)
    } catch (error) {
        res.json({success: false})
        return;
    }

    req.session.difficulty = difficulty;
    const success = await helpers.selectRandomWord(difficulty, req);
    if(success){
      req.session.selectedWord = word;
    }
   
    res.json({success: !!success,
      file: "/pages/content/game.html"});
}

const guessWord = (req, res) => {
    const selectedWord = req.session.selectedWord;
    if(!selectedWord) {
        res.status(400).json({success: false, message: "No word to match versus. Please try starting a new game."});
        return;
    }

    const guess = req.body.guess;
    if(!guess || guess.length !== selectedWord.length) {
        res.status(400).json({success: false, message: "No guess provided or guess does not match word length, please try again."});
        return;
    }
    let difficulty = req.session.difficulty;
    if(!difficulty){
        res.status(400).json({success: false, message: "Set difficulty not found, please try to restart the game"});
    }

    let result = helpers.matchGuess(selectedWord, guess, difficulty);
    res.json({success: true, result: result});
}

const getWord = (req, res) => {
  res.json({word: req.session.selectedWord})
}

const createAccount = async (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  let account = await queries.getAccount(username)

  if (account.rowCount) {
    res.status(400).json({ success: false, message: "User already exists, please try another one" });
    return;
  }
  try{
    const password_hash = await helpers.hashPassword(password);

    await queries.createAccount(username, password_hash);
    account = await queries.getAccount(username)

    if (account.rowCount) {
      const loggedIn = await helpers.login(account, password);
      if (!loggedIn.success) {
        res.status(500).json({ success: false, message: "Account created, but login failed" });
        return;
      }

      helpers.setSessionCookie(res, loggedIn.token);
      res.status(201).json({ success: true });
    }
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ success: false, message: "User already exists, please try another one" });
      return;
    }
    console.error('Account creation failed:', error);
    res.status(500).json({ success: false, message: "Unable to create account" });
  }
}

const login = async (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;
  
  try {
    const account = await queries.getAccount(username)

    if (!account.rowCount) {
      res.status(400).json({ success: false, message: "Incorrect Username or Password" });
      return;
    }

    const loggedIn = await helpers.login(account, password);
    if (!loggedIn.success) {
      res.status(401).json({ success: false, message: loggedIn.message });
      return;
    }

    helpers.setSessionCookie(res, loggedIn.token);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, message: "Unable to log in" });
  }
}

const logout = async (req, res) => {
    res.clearCookie("SessionID", helpers.cookieOptions);
    res.status(200).json({ success: true });
}

const findUser = async (req, res) => {
    const username = req.body.username;
    if(!username){
      res.status(400).json({success: false, message: "No username to search for provided"});
      return;
    }

    if(username == req.user.username){
      res.status(400).json({success: false, message: "You cannot add yourself as a friend, try searching for someone else"});
      return;
    }

    const account = await queries.findUser(username);
    if(!account.rowCount){
      res.status(401).json({success: false, message: "No user found"});
      return;
    }

    const isFriend = await queries.findFriendship(req.user.id, account.rows[0].id);
    if(isFriend.rowCount){
      res.status(400).json({success: false, message: "You are already friends with the user, please search for a user you are not friends with."})
      return;
    }

    res.status(200).json({success: true});
}

const addFriend = async (req, res) => {
  const username = req.body.username;
  if(!username){
    res.status(400).json({success: false, message: "No username to search for provided"});
    return;
  }

  if(username == req.user.username){
    res.status(400).json({success: false, message: "You cannot add yourself as a friend, try searching for someone else"});
    return;
  }

  const account = await queries.findUser(username);
  if(!account.rowCount){
    res.status(401).json({success: false, message: "User doesn't exist"});
    return;
  }

  const isFriend = await queries.findFriendship(req.user.id, account.rows[0].id);
  if(isFriend.rowCount){
    res.status(400).json({success: false, message: "You are already friends with the user"})
    return;
  }

  const friend = await queries.addFriend(req.user.id, account.rows[0].id);

  if(!friend.rowCount){
    res.status(400).json({success: false, message: "Friendship could not be created"});
    return;
  }
  
  res.status(200).json({success: true, message: `${username} has been added to your friendslist`})
  
}

const getFriends = async (req, res, battleManager) => {
  const user = req.user;

  const friends = await queries.getFriends(user.id);
  const friendsWithPresence = friends.rows.map((friend) => ({
    ...friend,
    online: isOnline(friend.id),
    inCombat: battleManager.isBusy(friend.id.toString())
  }));

  res.status(200).json({
    success: true,
    friends: friendsWithPresence,
    friendCount: friends.rowCount,
  });
}

const requestBattle = async (req, res, battleManager) => {
  const body = req.body;
  const requestedUser = body.username;

  if(!requestedUser){
    res.status(400).json({success: false, message: "No user provided"});
    return;
  }

  const userAccount = await queries.getAccount(requestedUser);

  if(!userAccount.rowCount){
    res.status(400).json({success: false, message: "No user found"});
    return;
  }

  const targetId = userAccount.rows[0].id;
  const online = isOnline(targetId);

  if(!online){
    res.status(400).json({success: false, message: "Player is not online"});
    return
  }

  const isFriend = await queries.findFriendship(req.user.id, targetId);

  if(!isFriend.rowCount){
    res.status(400).json({success: false, message: "You are not friends with the given user"});
    return
  }

  const invitationCreated = battleManager.requestInvitation(req.user, userAccount.rows[0])

  if(!invitationCreated.success){
    res.status(400).json(invitationCreated);
    return;
  }

  res.status(202).json(invitationCreated)
}

const battleResponse = async (req, res, battleManager) => {
  const body = req.body;
  const invitationId = body.invitationId;
  const answer = body.answer;

  if(answer == null || answer == "" || (answer != true && answer != false)){
    res.status(400).json({success: false, message: "Answer not provided"});
    return;
  }

  if(!invitationId){
    res.status(400).json({success: false, message: "No invitation id provided"});
    return;
  }

  const battleInvitation = battleManager.getInvitation(invitationId);

  if(!battleInvitation){
    res.status(400).json({success: false, message: "No Battle request found"});
    return;
  }

  const targetId = battleInvitation.from.id;
  const online = isOnline(targetId);

  if(!online){
    battleManager.releaseInvitation(battleInvitation);
    res.status(400).json({success: false, message: "Player is no longer online, battle request has been deleted"});
    return
  }

  const invitationResponse = await battleManager.respondToInvitation(invitationId, req.user.id, answer);

  if(!invitationResponse.success){
    res.status(400).json(invitationResponse);
    return;
  }

  res.status(202).json(invitationResponse);
}

const battleGuess = async (req, res, battleManager) => {
  const inBattle = battleManager.getPlayerBattle(req.user.id.toString());

  if(!inBattle.success){
    if(inBattle.redirect){

    }else{
      
    }
    delete inBattle.redirect;
    res.status(400).json(inBattle)
    return;
  }

  const selectedWord = inBattle.battle.players[req.user.username].words[inBattle.battle.currentWord];

  if(!selectedWord) {
      res.status(400).json({success: false, message: "No word to match versus. Please try starting a new game."});
      return;
  }

  const guess = req.body.guess;
  if(!guess || guess.length !== selectedWord.length) {
      res.status(400).json({success: false, message: "No guess provided or guess does not match word length, please try again."});
      return;
  }

  const result = helpers.matchGuess(selectedWord, guess, 5);

  const turn = battleManager.takeTurn(inBattle.battle.id, result)

  res.json(turn);
}

const createWords = async (req, res) => {
  let words = await queries.getAllWords();
  if(words.rowCount !== 2000){
    words = await helpers.createWords();
  }

  if(words?.length >= 2000 || words?.rowCount >= 2000){
    res.status(200).json({success: true})
    return
  }

  res.status(400).json({success: false, message: "Could not find words"});
}

const checkLoggedIn = (req, res) => {
  //check if logged in
  res.status(200).json({success: !!req.user, user: req?.user?.username})
}

module.exports = { 
  startGame, 
  guessWord, 
  getWord, 
  createAccount, 
  login, 
  createWords,
  checkLoggedIn,
  logout,
  findUser,
  addFriend,
  getFriends,
  requestBattle,
  battleResponse,
  battleGuess};
