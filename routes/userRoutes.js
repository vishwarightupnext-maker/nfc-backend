import express from "express";
import { getAllUserEmails } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// 🔐 Any logged-in user (admin panel recommended)
router.get("/all-emails", auth, getAllUserEmails);

export default router;
