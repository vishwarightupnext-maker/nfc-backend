import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name:"dsgizhhfx",
  api_key:"818652113911643",
  api_secret:"RDfHWksMLTEYD9F8s0SDFNWPrhg",
});

export default cloudinary;
