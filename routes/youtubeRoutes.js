// routes/youtubeRoutes.js
import express from "express";
import {
  addYouTubeLink,
  deleteYouTubeLink,
  updateYouTubeLink,
} from "../controllers/youtubeController.js";

import { getCardById } from "../controllers/cardController.js";

const router = express.Router();

// GET single card
router.get("/admin-profile/:id", getCardById);

// ADD YouTube link
router.post("/cards/:id/youtube", addYouTubeLink);

// DELETE YouTube link
router.delete("/cards/:id/youtube/:index", deleteYouTubeLink);

// UPDATE YouTube link
router.put("/cards/:id/youtube/:index", updateYouTubeLink);

export default router;
