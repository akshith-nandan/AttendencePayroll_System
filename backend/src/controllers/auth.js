const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign(
        { id:userId },
        process.env.JWT_SECRET,
        { expiresIn:"1d" }
    );
};

const register = async(req,res) => {
    try {
        const { name,email,password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name,Email,Password are required'
            });
        }

        if (password.length < 8){
            return res.status(400).json({
                message: 'Password must be atleast 8 characters'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUSer = await User.findOne({
            email:normalizedEmail,
        });

        if  (existingUSer){
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });

        const token = generateToken(user._id.toString());

        return res.status(201).json({
            message: 'Registration Successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch(error){
        console.error("Registration Error", error.message);

        if ( error.code === 11000 ){
            return res.status(409).json({
                message: 'Email is already Registered'
            });
        }

        return res.status(500).json({
            message: 'Registration failed'
        });
    }
};

const login = async(req,res) => {
    try {
        const { email,password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and Password are required'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select('+password')

        if (!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect){
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id.toString());

        return res.status(200).json({
            message: 'Login Succesful',
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch(error){
        console.error("Login error:",error.message);

        return res.status(500).json({
            message: 'Login Failed',
        });
    }
};

const logout = async(req,res) => {
    try {
        res.ClearCokkie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out Successfully"
        });
    }catch ( error ){
        return res.status(500).json({
            success: "falied",
            message: "Logout Failed"
        })
    }
}


const getMe = async(req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user){
            return res.status(404).json({
                message: 'User not found',
            });
        }

        return res.status(201).json({user});
    }catch( error ){
        console.error("Get Profile Error:",error.message);

        return res.status(500).json({
            message: 'Failed to fetch profile'
        });

    }
};

module.exports = { register,login,getMe,logout };