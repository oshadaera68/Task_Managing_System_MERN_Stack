/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded; // user = { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
};
