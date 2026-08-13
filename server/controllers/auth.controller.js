import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

const generateToken= (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET, { expiresIn: "30d"});
};

const publicUser= (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    year: user.year,
    bio: user.bio,
    ratingAvg: user.ratingAvg,
    totalReviews: user.totalReviews
});

export const registerUser= async (req, res, next) => {
  try {
    const {name,email,password, department, year} = req.body;
    if( !name || !email || !password) {
        res.status(400);
        throw new Error("name, email and password is required");
    }
    const existingUser= await User.findOne({email});
    if( existingUser) {
        res.status(400);
        throw new Error("user email already exists!");
    }
    const user= await User.create({name, email, password, department, year});
    const wallet= await Wallet.create({user: user._id, balance:100});

    await Transaction.create({
        user: user._id,
        amount: 100,
        type: "WELCOME_BONUS",
        description: "Welcome dear User! Initial Credits added to your Skill-loop wallet",
    });

    res.status(201).json({
        user: publicUser(user),
        wallet,
        token: generateToken(user._id)
    });
  }
    catch (error) {
        next(error);
    }
};

export const loginUser= async( req, res, next) => {
   try {
    const {email, password} = req.body;

    const user= await User.findOne({email});
    if(!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error("eithe user does not exist or invalid password!");
    }

    res.json({
        user: publicUser(user),
        token: generateToken(user._id)
    });
   }
   catch(error) {
    next(error);
   }
};

export const getMe= async(req,res) => {
   res.json({user: publicUser(req.user)});
};

export const updateProfile= async(req, res, next)=> {
   try {
    const user= await User.findById(req.user._id);

    user.name= req.body.name ?? user.name;
    user.department= req.body.department ?? user.department;
    user.year= req.body.year ?? user.year;
    user.bio= req.body.bio ?? user.bio;

    const updated= await user.save();
    res.json( { user: publicUser(updated) });
   }
   catch(error) {
       next(error);
   }
};