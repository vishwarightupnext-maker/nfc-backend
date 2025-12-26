import express from "express";
import  {downloadFullMongoBackup}from "../controllers/backupController.js";
// import adminAuth from "./middleware/adminAuth.js";

const router = express.Router();

router.get("/admin/backup/download",  downloadFullMongoBackup);

export default router;
