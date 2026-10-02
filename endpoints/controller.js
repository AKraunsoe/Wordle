const express = require('express');
const path = require('path');
const app = express();
const words = require('../words.json')?.words;
const helpers = require('../helpers/helpers');

const startGame = (req, res) => {
    const success = helpers.selectRandomWord(words, req);

    res.json({success: success, 
      file: "/pages/content/game.html"});
}

const guessWord = (req, res) => {
    const wordObject = req.session.wordObject;
    const selectedWord = req.session.selectedWord;
    if(!wordObject || !selectedWord) {
        res.status(400).json({success: false, message: "No word to match versus. Please try starting a new game."});
        return;
    }

    const guess = req.body.guess;
    if(!guess || guess.length !== selectedWord.length) {
        res.status(400).json({success: false, message: "No guess provided or guess does not match word length, please try again."});
        return;
    }

    let result = helpers.matchGuess(wordObject, guess);
    res.json({success: true, result: result});
}

const getWord = (req, res) => {
  res.json({word: req.session.selectedWord})
}

module.exports = { startGame, guessWord, getWord };