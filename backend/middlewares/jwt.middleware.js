import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        next();
    }catch(error){
        console.log(`Error on the protectRoute middleware: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

export { protectRoute };