import express from "express";
import {
  addGoogleMapLink,
  deleteGoogleMapLink,
  updateGoogleMapLink,
} from "../controllers/googleMapController.js";

const router = express.Router();

/* GOOGLE MAP ROUTES */
router.post("/:id/google-map", addGoogleMapLink);
router.put("/:id/google-map/:index", updateGoogleMapLink);
router.delete("/:id/google-map/:index", deleteGoogleMapLink);

export default router;
