import express from "express";
import { getMe, loginUser, registerUser, updateProfile } from "../controllers/auth.controller.js"
import { protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

//router.get("/test", (req, res) => {
//  res.send("Auth route works");
//});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;