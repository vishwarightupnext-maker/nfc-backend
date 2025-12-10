import multer from "multer";
import fs from "fs";
import path from "path";

// ================================
// FOLDERS
// ================================

// Temp folder for card set images
const TEMP_FOLDER = path.join("./uploads/temp");

// Product images folder
const PRODUCT_FOLDER = path.join("./uploads/cards/productimg");

// Profile image folder
const PROFILE_FOLDER = path.join("./uploads/profile");

// Ensure folders exist
[TEMP_FOLDER, PRODUCT_FOLDER, PROFILE_FOLDER].forEach((folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// ================================
// STORAGE ENGINE
// ================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // All card set images go to temp
    if (file.fieldname === "images") {
      cb(null, TEMP_FOLDER);
    }
    // Dynamic product images
    else if (file.fieldname === "dynamicImages") {
      cb(null, PRODUCT_FOLDER);
    }
    // Profile image upload
    else if (file.fieldname === "profile") {
      cb(null, PROFILE_FOLDER);
    }
    else {
      cb(new Error("Unknown upload field"));
    }
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// ================================
// EXPORT MULTER HANDLERS
// ================================

// Upload multiple card files (images, dynamicImages, etc)
export const uploadCardFiles = multer({ storage });

// Upload single profile image
export const uploadProfileImage = multer({ storage }).single("profile");
