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

app.get('/game/start', (req, res) => {
    controller.startGame(req, res);
});

app.get('/game/word', (req, res) => {
    controller.getWord(req, res);
})

app.post('/game/guess', (req, res) => {
    controller.guessWord(req, res);
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
