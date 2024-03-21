const User = require("../model/User");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async(req,res)=>{
    try {
        //fetch data
        const{name,email,password,role} = req.body;
        //validate
        if(!name||!email||!password||!role){
            return res.status().json({
                success:false,
                message:"all fields are mandatory",
            })
        }
        //check if user alredy exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({
                success:false,
                message:"Account Already Exists"
            })
        }
        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password,10)
        } catch (error) {
            console.error('Error occurred while hashing the password:', error);
            res.status(500).json({ error: 'Internal server error' });

        }
        //save entry
        const user = await User.create({
            name,email,password:hashedPassword,role
        })
        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be registered, please try again later"
        })
    }
}

exports.login = async(req,res)=>{
    try {
        //fetch data
        const {email, password} = req.body;
        //validate
        if(!email||!password){
            return res.status(401).json({
                success:false,
                message:"Please fill all details"
            })
        }
        //check if email present in db or not
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }

        //verify pass and generate jwt
        if(await bcrypt.compare(password,user.password)){
            //pass match
            let token=jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                });
                user.token=token;
                user.password=undefined;
                const options={
                    expires: new Date(Date.now()+3*24*60*60*1000),
                    httpOnly:true,
                }

                res.cookie("token",token,options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:'user logged in successfully'
                })
        }else{
            return res.status(403).json({
                success:false,
                message:"pass didnt match",
            })
        }

        //save jwt in cookie
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        });
        
    }
}

exports.userdetails= async(req,res)=>{
    try {
       const users= await User.find({});
       res.status(200).json({
        success: true,
        users: users
    });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        });
    }
}