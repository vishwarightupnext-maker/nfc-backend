import express from "express";
import multer from "multer";
import {
  addProductBlock,
  addYoutubeBlock,
  addMapBlock,
  deleteBlock,
  saveFullCard
} from "../controllers/cardContentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Add product (with image upload)
router.post("/:id/product", upload.single("image"), addProductBlock);

// Add YouTube
router.post("/:id/youtube", addYoutubeBlock);

// Add Google Map
router.post("/:id/map", addMapBlock);

// Delete block
router.delete("/:id/block/:blockId", deleteBlock);

// Save full card (ordering + contentBlocks)
router.put("/:id", upload.any(), saveFullCard);

export default router;
