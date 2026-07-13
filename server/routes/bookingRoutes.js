import express from "express";
import {createBooking, getMyBookings, completeBooking, cancelBooking} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router= express.Router();

router.post("/", protect, createBooking);
router.get("/mine", protect, getMyBookings);
router.patch("/:id/complete", protect, completeBooking);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;