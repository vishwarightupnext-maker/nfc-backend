import multer from "multer";
import fs from "fs";
import path from "path";

// ================================
// FOLDERS
// ================================

// Temporary upload folder (all images uploaded here first)
const TEMP_FOLDER = path.join("./uploads/temp");

// Profile image upload folder
const PROFILE_FOLDER = path.join("./uploads/profile");

// Make sure both folders exist
[TEMP_FOLDER, PROFILE_FOLDER].forEach((folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// ================================
// STORAGE ENGINE
// ================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // All card set images go to TEMP folder
    if (file.fieldname === "images") {
      cb(null, TEMP_FOLDER);
    }
    // profile image upload
    else if (file.fieldname === "profile") {
      cb(null, PROFILE_FOLDER);
    }
    else {
      cb(new Error("Unknown upload field"));
    }
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// ================================
// EXPORT MULTER HANDLERS
// ================================

// Upload up to 4 images for a card set
export const uploadCardFiles = multer({ storage });

// Upload single profile image
export const uploadProfileImage = multer({ storage }).single("profile");
