import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * TEMP STORAGE
 * Files are first stored here
 * Later moved to admin-specific folder in controller
 */
const tempDir = path.join("uploads", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/**
 * Only allow images
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const adminCardUpload = multer({
  storage,
  fileFilter,
  limits: {
    files: 4,          // max 4 files
    fileSize: 5 * 1024 * 1024, // 5MB each
  },
});

export default adminCardUpload;
