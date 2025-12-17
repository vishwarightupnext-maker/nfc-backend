import express from "express";
import {
  createAdminCardBySuperAdmin,
  getMyAdminCards,
  getAdminFolderCards,
  getAdminCardsByFolder,
} from "../controllers/adminCard.controller.js";

import auth from "../middlewares/auth.js";
import adminCardUpload from "../middlewares/adminCardMulter.js";

const router = express.Router();

/**
 * SUPER ADMIN uploads 4 images for selected admin
 */
router.post(
  "/super/admin-cards",
  auth,
  adminCardUpload.array("images", 4),
  createAdminCardBySuperAdmin
);

/**
 * ADMIN gets his cards
 */
router.get(
  "/admin/my-cards",
  auth,
  getMyAdminCards
);

router.get(
  "/admin/folder",
  auth,
  getAdminFolderCards
);

router.get(
  "/admin/folder/:folderName",
  auth,
  getAdminCardsByFolder
);

export default router;
