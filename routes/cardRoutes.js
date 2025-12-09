import express from "express";
import {
  createCard,
  getCardByRoute,
  getAllCards,
  trackRouteClick,
  updateCardByRoute,
  getCardById,
  updateCardById,
  deleteCard,
  getPdfByRoute,
  downloadPdfByRoute,
  deleteDynamicImage,
} from "../controllers/cardController.js";

import { uploadCardFiles } from "../middlewares/multer.js";

const router = express.Router();

// Multer fields
const multerMiddleware = uploadCardFiles.fields([
  { name: "dynamicImages", maxCount: 20 },
  { name: "profileImage", maxCount: 1 },
]);

/* ============================================================
   CREATE (NO FILES ON INITIAL CREATE)
   ============================================================ */
router.post("/", createCard);

/* ============================================================
   GET ALL
   ============================================================ */
router.get("/", getAllCards);

/* ============================================================
   ID-BASED SYSTEM (NEW) -> MUST COME BEFORE ":route"
   ============================================================ */

// Get card by ID
router.get("/admin-profile/:id", getCardById);

// Update (with multer)
router.put("/:id", multerMiddleware, updateCardById);

// Delete Dynamic Image (Gallery Item)
router.delete("/:cardId/dynamic/:imgId", deleteDynamicImage);

// Delete Card
router.delete("/:id", deleteCard);

/* ============================================================
   PDF + TRACK ROUTES (BEFORE catch-all route)
   ============================================================ */

router.get("/cards/pdf/:route", getPdfByRoute);
router.get("/download/:route", downloadPdfByRoute);
router.get("/track/:route", trackRouteClick);

/* ============================================================
   OLD ROUTE SYSTEM (MUST BE LAST)
   ============================================================ */

// Get card by public route slug
router.get("/:route", getCardByRoute);

// Update card via route (legacy)
router.put("/:route", multerMiddleware, updateCardByRoute);

export default router;
