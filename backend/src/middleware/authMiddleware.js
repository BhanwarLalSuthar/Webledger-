const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/User')

dotenv.config()

exports.authMiddleware = async (req, res, next)=>{
    const token = req.cookies.jwtToken

    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token' })
        }
}

