const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const salt_round = Number(process.env.SALT_ROUND)

exports.register = async(req ,res)=>{
    try {
        const { name, email, password} = req.body

        if (!name || !email || !password) {
            console.error("Missing Fields:", req.body);
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email })
        if ( user){
            return res.status(400).json({ message: "user Email already exists" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // hashed password
        const hashedPassword = await bcrypt.hash(password, salt_round)

      
        user = new User({
            name,
            email,
            password: hashedPassword
        })
        await user.save()
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
        console.log("User Registered:", { name, email });
        res.status(201).json({ message: 'User reigstered successfully ', user: { name,  email, },token})
    } catch (error) {
        res.status(500).json({ message: 'Register Error', error: error.message})
        
    }
}

exports.login = async(req, res)=>{
    try {
        const { email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
          }

        //find user
        const user = await User.findOne({ email});
    
        if (!user){
            return res.status(400).json({ message: 'User not Round'})
        }

    
        
     
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({ message: 'Password not Matched'})
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d'})
        
        res.json({  message: "Login successful",token, user: { id: user._id, name: user.name,}})
      
    } catch (error) {
        res.status(500).json({ message: "login error", error: error.message })        
    }
}

exports.getProfile = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password"); // Exclude password
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(user);
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.status(500).json({ error: "Something went wrong!" });
    }
  };