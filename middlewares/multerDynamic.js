import multer from "multer";
import fs from "fs";
import path from "path";

const PRODUCT_FOLDER = path.join("./uploads/cards/productimg");
const PROFILE_FOLDER = path.join("./uploads/cards/profile");

// ensure folders exist
[PRODUCT_FOLDER, PROFILE_FOLDER].forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "dynamicImgFiles") {
      cb(null, PRODUCT_FOLDER);
    } else if (file.fieldname === "profileImage") {
      cb(null, PROFILE_FOLDER);
    } else {
      cb(new Error("Unexpected field: " + file.fieldname));
    }
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Allow multiple image types
export const uploadImages = multer({
  storage,
}).fields([
  { name: "dynamicImgFiles", maxCount: 10 },
  { name: "profileImage", maxCount: 1 },
]);
