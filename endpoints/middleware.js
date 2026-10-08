const jwt = require("jsonwebtoken");
require('dotenv').config();

const Verify = (req, res, next) => {
    const sessionCookie = req.headers.cookie
        ?.split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('SessionID='));
    const token = sessionCookie?.slice('SessionID='.length);

    if (!token) {
        return res.status(401).json({ success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded.user) {
            return res.status(401).json({ success: false });
        }

        req.user = { id: decoded.user, username: decoded.username};
        next();
    } catch (error) {
        return res.status(401).json({ success: false });
    }
};

module.exports = { Verify };