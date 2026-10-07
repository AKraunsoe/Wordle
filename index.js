const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const controller = require('./endpoints/controller');

app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
}))

app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages', 'index.html'));
});

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

// Account Functionality
app.post('/account/createAccount', (req, res) => {
  controller.createAccount(req, res);
})

app.post('/account/login', (req, res) => {
  controller.login(req, res);
})

// On Load Functionality
app.get('/game/words', async(req, res) => {
  await controller.createWords(req, res);
})

app.get('/account/loggedIn', (req, res) => {
  controller.checkLoggedIn(req, res);
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
