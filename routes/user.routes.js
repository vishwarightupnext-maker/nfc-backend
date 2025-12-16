import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/**
 * GET ALL USERS / FILTER BY ROLE
 * /api/users?role=admin
 */
router.get(
  "/users",
  auth,
  getUsers
);

export default router;
