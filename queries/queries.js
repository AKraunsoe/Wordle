const pool = require("../db.js");

const createAccount = async (username, password) => {  
    const account = await pool.query(`INSERT INTO accounts (username, password) VALUES ($1, $2)`, [username, password])
    return account;
}

const getAccount = async (username) => {
    const account = await pool.query(`SELECT * FROM accounts WHERE username=$1 LIMIT 1`, [username]);
    return account;
}

const findUser = async (username) => {
    const account = await pool.query(`SELECT id, username FROM accounts WHERE username=$1 LIMIT 1`, [username]);
    return account;
}

const addFriend = async (myId, friendId) => {
    const friendship = await pool.query(`INSERT INTO friendships (account_id, friend_id) VALUES ($1, $2)`, [myId, friendId]);
    return friendship;
}

const findFriendship = async (myId, friendId) => {
    const friendship = await pool.query(`SELECT * FROM friendships WHERE (account_id = $1 AND friend_id = $2) OR (account_id = $2 AND friend_id = $1)`, [myId, friendId]);
    return friendship;
}

const getFriends = async (id) => {
    const friends = await pool.query(
        `SELECT DISTINCT a.id, a.username
         FROM friendships f
         JOIN accounts a
           ON a.id = CASE
               WHEN f.account_id = $1 THEN f.friend_id
               ELSE f.account_id
           END
         WHERE f.account_id = $1 OR f.friend_id = $1
         ORDER BY a.username`,
        [id]
    );
    return friends;
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
    getWordsofLength,
    findUser,
    addFriend,
    findFriendship,
    getFriends
}