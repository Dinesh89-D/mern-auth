import User from "../Models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../Utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next)=>{
    const {username,email,password}= req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try{
    await newUser.save()
    res.status(200).json({message:"User Created Sucessfully"});
    }catch(error){
        next(error);
    }
}
export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(401,'User not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials'));
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:hashedPassword, ...rest} = validUser._doc;
        const expiryDate = new Date(Date.now()+3600000);
        res.
        cookie('access_token',token,{httpOnly:true,expires:expiryDate})
        status(200).json(rest);
    }catch(error){
        next(error);
    }
}