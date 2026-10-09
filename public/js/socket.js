const { io } = require("socket.io-client");

const socket = io({ autoConnect: false });

module.exports = socket;