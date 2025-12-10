import SimpleCard from "../models/SimpleCard.js";
import fs from "fs";
import path from "path";

/* ============================================================
   CREATE A SIMPLE CARD SET (UPLOAD 4 IMAGES IN A FOLDER)
============================================================ */
export const createSimpleCard = async (req, res) => {
  try {
    const { name, folderName } = req.body;

    // Multer provides files directly in req.files array
    const files = req.files; 

    if (!name || !folderName) {
      return res.status(400).json({ message: "Name and folderName are required" });
    }

    if (!files || files.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 images are required" });
    }

    // Create the real folder
    const folderPath = path.join("uploads/cards", folderName);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const cardArray = [];

    // Move files to their new folder
    files.forEach((file, index) => {
      const newName = `${index + 1}${path.extname(file.originalname)}`;
      const newPath = path.join(folderPath, newName);

      fs.renameSync(file.path, newPath);

      cardArray.push({ image: `/${newPath}` });
    });

    // Save to DB
    const cardSet = await SimpleCard.create({
      name,
      folderName,
      cards: cardArray
    });

    res.status(201).json({ success: true, cardSet });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   GET ALL SIMPLE CARD SETS
============================================================ */
export const getAllSimpleCards = async (req, res) => {
  try {
    const sets = await SimpleCard.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      sets
    });

  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   GET ONE SIMPLE CARD SET
============================================================ */
export const getSimpleCard = async (req, res) => {
  try {
    const set = await SimpleCard.findById(req.params.id);

    if (!set) {
      return res.status(404).json({ message: "Card set not found" });
    }

    res.json({
      success: true,
      set
    });

  } catch (err) {
    console.error("GET ONE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   UPDATE CARD SET → can replace any of the 4 images
============================================================ */
export const updateSimpleCard = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files?.images;
    const { name } = req.body;

    const cardSet = await SimpleCard.findById(id);

    if (!cardSet) {
      return res.status(404).json({ message: "Card set not found" });
    }

    const folderPath = path.join("uploads/cards", cardSet.folderName);

    // Update name
    if (name) cardSet.name = name;

    // If new images uploaded
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        const newName = `${index + 1}${path.extname(file.originalname)}`;
        const newPath = path.join(folderPath, newName);

        // Delete old image if exists
        if (cardSet.cards[index]?.image) {
          const oldPath = cardSet.cards[index].image.replace("/", "");
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Replace file
        fs.renameSync(file.path, newPath);

        // Update DB image path
        cardSet.cards[index].image = `/${newPath}`;
      });
    }

    await cardSet.save();

    res.json({
      success: true,
      message: "Card set updated successfully",
      cardSet
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   DELETE CARD SET → removes folder + DB record
============================================================ */
export const deleteSimpleCard = async (req, res) => {
  try {
    const { id } = req.params;

    const cardSet = await SimpleCard.findById(id);
    if (!cardSet) {
      return res.status(404).json({ message: "Card set not found" });
    }

    const folderPath = path.join("uploads/cards", cardSet.folderName);

    // Delete folder and images
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // Remove from DB
    await SimpleCard.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Card set deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ============================================================
   GET CARD SET BY FOLDER NAME → returns all 4 cards
============================================================ */
export const getCardsByFolder = async (req, res) => {
  try {
    const { folderName } = req.params;

    const cardSet = await SimpleCard.findOne({ folderName });

    if (!cardSet) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({
      success: true,
      name: cardSet.name,
      folderName: cardSet.folderName,
      cards: cardSet.cards,
    });

  } catch (err) {
    console.error("GET FOLDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ============================================================
   GET ALL FOLDER NAMES (from DB SimpleCard collection)
============================================================ */
export const getAllFolders = async (req, res) => {
  try {
    // Fetch only folder names from DB
    const sets = await SimpleCard.find({}, "folderName").sort({ createdAt: -1 });

    const folders = sets.map((s) => ({
      folderName: s.folderName
    }));

    res.json({
      success: true,
      folders
    });

  } catch (err) {
    console.error("GET ALL FOLDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
