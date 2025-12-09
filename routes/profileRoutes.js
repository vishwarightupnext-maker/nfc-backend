import express from "express";
import fs from "fs";
import path from "path";
import Card from "../models/Card.js";
import { uploadProfileImage } from "../middlewares/multer.js";

const router = express.Router();

// -------------------- Upload/Update Profile Image --------------------
router.post("/:id/profile-image", uploadProfileImage, async (req, res) => {
  try {
    const cardId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImagePath = `/uploads/profile/${req.file.filename}`;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { profileImage: profileImagePath },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ message: "Profile image updated successfully", card: updatedCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- Delete Profile Image --------------------
router.delete("/:id/profile-image", async (req, res) => {
  try {
    const cardId = req.params.id;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.profileImage) {
      const filePath = path.join(".", card.profileImage); // convert DB path to file system path

      // Delete file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Remove from DB
      card.profileImage = undefined;
      await card.save();
    }

    res.json({ message: "Profile image deleted successfully", card });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
