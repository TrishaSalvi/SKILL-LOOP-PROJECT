import express from "express";
import {createReview, getReviewsForUser, getReviewsForSkill } from "../controllers/review.controller.js";
import {protect} from "../middlewares/authMiddleware.js";

const router= express.Router();

router.post("/", protect, createReview);
router.get("/user/:userId", getReviewsForUser);
router.get("/skill/:skillId", getReviewsForSkill);

export default router;