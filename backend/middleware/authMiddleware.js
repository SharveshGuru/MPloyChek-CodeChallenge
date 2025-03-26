const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], "your_secret_key");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;

    jwt.verify(token, "your_secret_key", async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        
        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            
            req.user = { id: user._id, role: user.role };
            next();
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
};

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
        next();
    } catch (error) {
        console.error("Admin verification error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { authenticateToken, verifyAdmin };
