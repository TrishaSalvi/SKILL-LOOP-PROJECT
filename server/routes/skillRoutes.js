import express from "express";
import { getSkills, getSkillById, getMySkills, createSkill, updateSkill, deleteSkill} from "../controllers/skill.controller.js";
import {protect} from "../middlewares/authMiddleware.js";

const router= express.Router();

router.get("/", getSkills);
router.get("/me/my-skills", protect, getMySkills);
router.post("/", protect, createSkill );
router.get("/:id", getSkillById);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill );

export default router;