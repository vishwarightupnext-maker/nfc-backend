import express from "express";
import { sendEmailCampaign } from "../controllers/emailController.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/campaign", sendEmailCampaign);

export default router;
