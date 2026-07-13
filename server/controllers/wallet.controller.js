import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getWallet= async (req,res,next) => {
    try {
        let wallet= await Wallet.findOne({ user: req.user._id });

        if( !wallet) {
            wallet= await Wallet.create({ user: req.user._id, balance: 100 });
        }

        res.json(wallet);
    }
    catch(error) {
        next(error);
    }
};

export const getTransactions= async (req,res,next) => {
    try{
        const transactions= await Transaction.find({ user: req.user._id })
          .populate("booking")
          .sort({ createdAt: -1 });

        res.json(transactions);
    }
    catch(error) {
        next(error);
    }
};