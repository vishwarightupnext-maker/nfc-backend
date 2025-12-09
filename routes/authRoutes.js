import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getAllUsers,
  updateUserRole,
  updateAdminCount
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

router.put(
  "/update-role",
  auth,
  role("super-admin"),
  updateUserRole
);

router.put(
  "/update-admin-count",
  auth,
  role("super-admin"),
  updateAdminCount
);

router.get("/users", auth, role("admin", "super-admin"), getAllUsers);


router.get("/super-admin", auth, role("super-admin"), (req, res) => {
  res.json({ message: "Super Admin Dashboard Access Granted" });
});

router.get("/admin", auth, role("super-admin", "admin"), (req, res) => {
  res.json({ message: "Admin Dashboard Access Granted" });
});

router.get("/user", auth, role("user", "admin", "super-admin"), (req, res) => {
  res.json({ message: "User Dashboard Access Granted" });
});

export default router; // ✅ KEEP THIS
