const {saveWords, getWordsofLength} = require('../queries/queries.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const selectRandomWord = async (difficulty, req) => {
    const words = await getWordsofLength(difficulty)
    const wordCount = words.rowCount || -1;
    if(wordCount <= 0) {
        return null;
    }
    let randomNumber = Math.floor(Math.random() * wordCount);
    const word = words.rows[randomNumber].word.toUpperCase();
    if(!word){
        return false;
    }
    //req.session.selectedWord = "APPLE";
    req.session.selectedWord = word;
    //const wordObject = createWordObject(word);
    //req.session.wordObject = wordObject;
    return true;
};

const createWords = async () => {
    const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json');
    const wordsData = await response.json();
    const savedWords = [];
    const words = Object.keys(wordsData);

    for(const word of words){
        if(word.length >=3 && word.length <= 7){
            const savedWord = await saveWords(word, word.length);
            savedWords.push(savedWord);
        }
    }

    return words;
}

const createWordObject = (word) => {

    const letters = word.split('');
    let wordObject = {};
    for(let i = 0; i < letters.length; i++){
        let letter = letters[i];
        if(wordObject[letter]){
            wordObject[letter].position.push(i);
            wordObject[letter].count++;
            continue;
        }
        wordObject[letter] = {
            position: [i],
            count: 1
        }
    }

    return wordObject;

}

const createResultArray = (difficulty) => {
    let result = []
    for (let i = 0; i < difficulty; i++) {
        result.push(0);
    }
    return result;
}

const matchGuess = (word, guess, difficulty) => {
    const guessWordObject = createWordObject(guess);
    const wordObject = createWordObject(word);
    let result = createResultArray(difficulty);
    const updatedObject = {}
    for(let i = 0; i < guess.length; i++){

        let letter = guess[i];

        if(wordObject[letter] && wordObject[letter].count){
            updatedObject[letter] = {position: [], count : 0}

            for (let j = 0; j < guessWordObject[letter].position.length; j++) {
                if(wordObject[letter].position.indexOf(guessWordObject[letter].position[j]) != -1){
                    result[guessWordObject[letter].position[j]] = 2
                    updatedObject[letter].position.push(wordObject[letter].position[j])
                    updatedObject[letter].count++;
                }
                if(updatedObject[letter].count == wordObject[letter].count){
                    break;
                }
            }

            let index = 0;
            while (wordObject[letter].count != updatedObject[letter].count){

                if(updatedObject[letter].count > wordObject[letter].count ||
                    index > 4 ||
                    index >= guessWordObject[letter].position.length){
                    break;
                }
                if(result[guessWordObject[letter].position[index]] == 0){
                    result[guessWordObject[letter].position[index]] = 1
                    updatedObject[letter].count++;
                    updatedObject[letter].position.push(guessWordObject[letter].position[index]);
                }
                index++;
            }

            wordObject[letter].count = 0;
        }

    }

    return result;
}

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
}

const cookieOptions = {
        maxAge: 8 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }

const setSessionCookie = (res, token) => {
    res.cookie('SessionID', token, cookieOptions );
};

const login = async (account, password) => {
    const accountData = account?.rows?.[0];
    if (!accountData) {
        return {
            success: false,
            message: "Incorrect Username or Password"
        };
    }

    const correctPassword = await validateHash(password, accountData.password)
    if(!correctPassword){
        return {
            success: false,
            message: "Incorrect Username or Password"
        }
    }
    let token;
    try {
        token = jwt.sign({user: accountData.id, username: accountData.username}, process.env.SECRET, {expiresIn: '8h'})
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong"
        }
    }
    
    return {success: true, token: token}

}

const validateHash = async (password, hashed_password) => {
    const match = await bcrypt.compare(password, hashed_password);
    return match
}

module.exports = { selectRandomWord,
  matchGuess,
  login,
  createWords,
    hashPassword,
    setSessionCookie,
cookieOptions};
