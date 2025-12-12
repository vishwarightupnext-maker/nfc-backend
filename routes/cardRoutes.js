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
  getRouteImages
} from "../controllers/cardController.js";

import { uploadCardFiles } from "../middlewares/multer.js";

const router = express.Router();

const multerMiddleware = uploadCardFiles.fields([
  { name: "dynamicImages", maxCount: 20 },
  { name: "profileImage", maxCount: 1 },
]);

/* ============================================================
   PUBLIC ROUTES (ROUTE-SLUG BASED) — MUST COME FIRST
============================================================ */

// get card by route (public URL)
router.get("/route/:route", getCardByRoute);

// update card by route
router.put("/route/:route", multerMiddleware, updateCardByRoute);

// route images (get 4 card images)
router.get("/images/:route", getRouteImages);

// download 4-card pdf
router.get("/download/:route", downloadPdfByRoute);

// get pdf url (api)
router.get("/cards/pdf/:route", getPdfByRoute);

// track clicks
router.get("/track/:route", trackRouteClick);


/* ============================================================
   GENERAL ROUTES
============================================================ */

// create card
router.post("/", createCard);

// get all cards
router.get("/", getAllCards);


/* ============================================================
   ID-BASED ADMIN ROUTES — MUST COME AFTER /route/:route
============================================================ */

// get by ID
router.get("/admin-profile/:id", getCardById);

// update by ID
router.put("/:id", multerMiddleware, updateCardById);

// delete card by ID
router.delete("/:id", deleteCard);

// delete gallery image
router.delete("/:cardId/dynamic/:imgId", deleteDynamicImage);


export default router;
