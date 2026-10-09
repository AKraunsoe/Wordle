const onlineSockets = new Map();

const registerPresence = (io) => {
    io.on("connection", (socket) => {
    const userId = String(socket.data.user.id);
    const userRoom = `user:${userId}`;

    socket.join(userRoom);

    let sockets = onlineSockets.get(userId);
    if (!sockets) {
        sockets = new Set();
        onlineSockets.set(userId, sockets);
    }
    sockets.add(socket.id);

    socket.on("disconnect", () => {
        const activeSockets = onlineSockets.get(userId);
        activeSockets?.delete(socket.id);

        if (activeSockets?.size === 0) {
        onlineSockets.delete(userId);
        }
    });
    });
}

const isOnline = (userId) =>
  (onlineSockets.get(String(userId))?.size ?? 0) > 0;

module.exports = { registerPresence, isOnline };