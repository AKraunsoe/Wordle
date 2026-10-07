const pool = require("../db.js");

const createAccount = async (username, password) => {  
    const account = await pool.query(`INSERT INTO accounts (username, password) VALUES ($1, $2)`, [username, password])
    return account;
}

const  getAccount = async (username) => {
    const account = await pool.query(`SELECT * FROM accounts WHERE username=$1 LIMIT 1`, [id]);
    return account;
}

const saveWords = async (word, length) => {
    const savedWord = await pool.query(`INSERT INTO words (word, word_length) VALUES ($1, $2)`, [word, length])
    return savedWord;
}

const getWordsofLength = async(length) => {
    const words = await pool.query(`SELECT * FROM words WHERE word_length=$1`, [length])
    return words;
}

const getAllWords = async () => {
    return await pool.query(`SELECT * FROM words LIMIT 2000`);
}

module.exports = {
    createAccount,
    getAccount,
    saveWords,
    getAllWords,
    getWordsofLength
}