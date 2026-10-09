const express = require('express');
const session = require('express-session');
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const path = require('path');
const app = express();
const port = 3000;
require('dotenv').config();
const controller = require('./endpoints/controller');
const {createBattleWords} = require('./helpers/helpers');
const presence = require('./helpers/presence');
const { Verify } = require('./endpoints/middleware');
const BattleManager = require('./models/battleManager');


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages', 'index.html'));
});

const server = createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  const sessionCookie = socket.handshake.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("SessionID="));
  const token = sessionCookie?.slice("SessionID=".length);

  if (!token) {
    return next(new Error("unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded.user) {
      return next(new Error("unauthorized"));
    }

    socket.data.user = {
      id: decoded.user,
      username: decoded.username,
    };
    next();
  } catch {
    next(new Error("unauthorized"));
  }
});

const battleManager = new BattleManager({
  io,
  createBattleWords, // a server helper that returns actual words
});


presence.registerPresence(io);

// Game Functionality
app.get('/game/start', (req, res) => {
    controller.startGame(req, res);
});

app.get('/game/word', (req, res) => {
    controller.getWord(req, res);
})

app.post('/game/guess', (req, res) => {
    controller.guessWord(req, res);
});

app.post('/game/requestbattle', Verify, (req, res) => {
    controller.requestBattle(req, res, battleManager);
})

app.post('/game/battleresponse', Verify, (req, res) => {
    controller.battleResponse(req, res, battleManager);
})

app.post('/game/battleguess', Verify, (req, res, battleManager) => {
    controller.battleGuess(req, res, battleManager);
})

// Account Functionality
app.post('/account/createAccount', (req, res) => {
  controller.createAccount(req, res);
})

app.post('/account/login', (req, res) => {
  controller.login(req, res);
})

app.get('/account/logout', (req, res) => {
  controller.logout(req, res);
})

// On Load Functionality
app.get('/game/words', async(req, res) => {
  await controller.createWords(req, res);
})

app.get('/account/loggedIn', Verify,  (req, res) => {
  controller.checkLoggedIn(req, res);
})

//User Functionality
app.post('/users/search', Verify, (req, res) => {
  controller.findUser(req, res);
})

app.post('/users/addFriend', Verify, (req, res) =>{
  controller.addFriend(req, res);
})

app.get('/users/friends', Verify, (req, res) => {
  controller.getFriends(req, res, battleManager);
})



//io.to(`user:${targetUserId}`).emit("battle:invite:received", invitation);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
