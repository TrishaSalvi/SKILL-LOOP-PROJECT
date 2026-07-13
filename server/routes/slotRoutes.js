import express from "express";
import { createSlot, getSlotsBySkill, getMySlots, deleteSlot } from "../controllers/slot.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router= express.Router();

router.post("/", protect, createSlot);
router.get("/mine", protect, getMySlots);
router.get("/skill/:skillId", getSlotsBySkill);
router.delete("/:id", protect, deleteSlot);

export default router;