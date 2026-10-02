const express = require('express');
const path = require('path');
const app = express();
const words = require('../words.json')?.words;
const helpers = require('../helpers/helpers');

const playGame = (req, res) => {
    let selectedWord = helpers.selectRandomWord(words);
    try {
      req.session.selectedWord = selectedWord.toUpperCase();
    } catch (error) {
      console.log(error)
    }
    
    res.json({success: !!selectedWord, 
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

    let result = helpers.matchGuess(selectedWord, guess);
    res.json({success: true, result: result});
}

module.exports = { playGame, guessWord };