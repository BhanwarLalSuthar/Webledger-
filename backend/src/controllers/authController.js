const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const crypto = require("crypto");

dotenv.config()

const salt_round = Number(process.env.SALT_ROUND)

exports.register = async(req ,res)=>{
    try {
        const { name, email, password, googleId=null} = req.body

        // if (!name || !email || !password) {
        //     console.error("Missing Fields:", req.body);
        //     return res.status(400).json({ message: "All fields are required" });
        // }

        let user = await User.findOne({ email })
        if ( user){
            return res.status(400).json({ message: "user Email already exists" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // hashed password
        const hashedPassword = await bcrypt.hash(password, 6)

      
        user = new User({
            name,
            email,
            password: hashedPassword,
            // googleId,
    
        })
        await user.save()

        console.log("User Registered:", { name, email });
        res.status(201).json({ message: 'User reigstered successfully ', user: { name,  email, }})
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message})
        
    }
}

exports.login = async(req, res)=>{
    try {
        const { email, password} = req.body

        //find user
        const user = await User.findOne({ email});
    
        if (!user){
            return res.status(400).json({ message: 'User not Round'})
        }

    
        
     
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({ message: 'Password not Matched'})
        }
        const token = jwt.sign({ id: user._id,name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d'})
        
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("jwtToken", token, {
            httpOnly: true,    // Prevents JavaScript access
            secure: isProduction,      // Only send over HTTPS
            sameSite: isProduction ? "strict" : "lax", // Prevent CSRF
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({  message: "Login successful",token, user: { id: user._id, name: user.name,}})

        
      
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })        
    }
}