const express = require('express');
const path = require('path');
const app = express();
const helpers = require('../helpers/helpers');

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

    res.json({success: success, 
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


module.exports = { startGame, guessWord, getWord };