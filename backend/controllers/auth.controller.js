import { generateToken, setCookie } from '../lib/utils.js';
import User from '../models/user.model.js';

const registerUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if(password.length < 8){
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = generateToken(newUser._id);
        setCookie(res, token);

        const user = await User.findById(newUser._id).select('-password');
        res.status(201).json({ success: true, user, message: 'User registered successfully' });

    }catch(error){
        console.log(`Error on the registerUser controller: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

const loginUser = async (req, res) => {
    try{
        const { identifier, password } = req.body;
        if(!identifier || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({$or: [{email: identifier}, {username: identifier}]});
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const token = generateToken(user._id);
        setCookie(res, token);

        const loggedinUser = await User.findById(user._id).select('-password');

        res.status(200).json({ success: true, user: loggedinUser, message: "User logged in successfully" });
    }catch(error){
        console.log(`Error on the loginUser controller: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

const logoutUser = async (req, res) => {
    try{
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0
        };
        res.clearCookie('jwt', cookieOptions);
        res.status(200).json({ success: true, message: "User logged out successfully" });
    }catch(error){
        console.log(`Error on the logoutUser controller: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

const getMe = (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
}

export { registerUser, loginUser, logoutUser, getMe };