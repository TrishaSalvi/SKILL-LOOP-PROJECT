import express from "express";
import { getWallet, getTransactions } from "../controllers/wallet.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router= express.Router();

router.get("/", protect, getWallet );
router.get("/transactions", protect, getTransactions);

export default router;