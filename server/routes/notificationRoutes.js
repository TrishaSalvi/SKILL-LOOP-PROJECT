import express from "express";
import { getNotifications, markNotificationRead } from "../controllers/notification.controller.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markNotificationRead);

export default router;
