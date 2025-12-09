import express from "express";
import { 
  createSimpleCard, 
  updateSimpleCard, 
  deleteSimpleCard, 
  getAllSimpleCards,
   getCardsByFolder
} from "../controllers/simpleCardController.js";

import { uploadCardFiles } from "../middlewares/multer.js";

const router = express.Router();

// Accept 4 images with key "images"
router.post(
  "/",
  uploadCardFiles.array("images", 4),
  createSimpleCard
);

router.put(
  "/:id",
  uploadCardFiles.array("images", 4), 
  updateSimpleCard
);

router.delete("/:id", deleteSimpleCard);

router.get("/", getAllSimpleCards);
router.get("/folder/:folderName", getCardsByFolder);

export default router;
