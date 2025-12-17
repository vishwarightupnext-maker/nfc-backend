import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getAllUsers,
  updateUserRole,
  updateAdminCount,
  getAllAdmins,
  getMe
} from "../controllers/authController.js";

import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";

const router = express.Router();

// -------------------- PUBLIC AUTH ROUTES --------------------
router.post("/register", register);
router.post("/login", login);

// Forgot Password Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// -------------------- PROTECTED ROLE ROUTES --------------------

// Update user role (SUPER ADMIN ONLY)
router.put(
  "/update-role",
  auth,
  role("super-admin"),
  updateUserRole
);

// Update admin count (SUPER ADMIN ONLY)
router.put(
  "/update-admin-count",
  auth,
  role("super-admin"),
  updateAdminCount
);

// Get all users (ADMIN + SUPER ADMIN)
router.get(
  "/users",
  auth,
  role("admin", "super-admin"),
  getAllUsers
);

// ✅ GET ALL ADMINS (SUPER ADMIN ONLY)
router.get(
  "/admins",
  auth,
  role("super-admin"),
  getAllAdmins
);

// -------------------- DASHBOARD TEST ROUTES --------------------
router.get(
  "/super-admin",
  auth,
  role("super-admin"),
  (req, res) => {
    res.json({ message: "Super Admin Dashboard Access Granted" });
  }
);

router.get(
  "/admins",
  auth,
  role("super-admin"),
  getAllAdmins
);


router.get(
  "/user",
  auth,
  role("user", "admin", "super-admin"),
  (req, res) => {
    res.json({ message: "User Dashboard Access Granted" });
  }
);


router.get("/me", auth, getMe);

export default router; // ✅ KEEP THIS
