import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/email.js";

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "mysupersecretkey123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- FORGOT PASSWORD (SEND OTP) ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to your email!" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    if (!user.otp)
      return res.status(400).json({ message: "No OTP request found" });

    const providedOtp = String(otp).trim();
    const storedOtp = String(user.otp).trim();

    if (providedOtp !== storedOtp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (!user.otpExpires || user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Create reset token
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, purpose: "reset-password" },
      process.env.JWT_SECRET || "mysupersecretkey123",
      { expiresIn: "15m" }
    );

    res.json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword)
      return res.status(400).json({ message: "resetToken and newPassword required" });

    let payload;
    try {
      payload = jwt.verify(
        resetToken,
        process.env.JWT_SECRET || "mysupersecretkey123"
      );
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    if (!payload || payload.purpose !== "reset-password")
      return res.status(401).json({ message: "Invalid reset token" });

    const user = await User.findById(payload.id);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (req, res) => {
  try {
    // fetch all users but exclude password field
    const users = await User.find().select("-password -otp -otpExpires");

    res.json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------- UPDATE USER ROLE (SUPER ADMIN ONLY) ----------------
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Check if valid role
    const validRoles = ["super-admin", "admin", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Cannot modify yourself
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const updateAdminCount = async (req, res) => {
  try {
    const { userId, cardLimit } = req.body;

    // extra safety (even though middleware already checks)
    if (req.user.role !== "super-admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Super Admin only" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Limit can only be updated for admin users" });
    }

    // ❌ Prevent breaking existing data
    if (cardLimit < user.cardsCreated) {
      return res.status(400).json({
        message: `Admin has already created ${user.cardsCreated} cards`,
      });
    }

    // ✅ Update limit
    user.cardLimit = cardLimit;
    await user.save();

    res.json({
      message: "Admin card limit updated successfully",
      admin: {
        id: user._id,
        name: user.name,
        cardLimit: user.cardLimit,
        cardsCreated: user.cardsCreated,
        availableCards: user.cardLimit - user.cardsCreated,
      },
    });
  } catch (error) {
    console.error("UPDATE ADMIN LIMIT ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------- GET ALL ADMINS ----------------
// ---------------- GET ALL ADMIN USERS ----------------
export const getAllAdmins = async (req, res) => {
  try {
    // Only super-admin can see admin list
    if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await User.find({ role: "admin" })
      .select("-password -otp -otpExpires");

    res.json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("GET ADMINS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// ---------------- GET LOGGED-IN USER (ME) ----------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cardLimit: user.cardLimit,
        cardsCreated: user.cardsCreated,
      },
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ---------------- DELETE USER ----------------
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // /users/:userId
    const loggedInUser = req.user;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Never allow deleting super-admin
    if (userToDelete.role === "super-admin") {
      return res
        .status(403)
        .json({ message: "Super Admin cannot be deleted" });
    }

    // 👤 SELF DELETE
    if (loggedInUser.id === userId) {
      if (loggedInUser.role === "super-admin") {
        return res
          .status(403)
          .json({ message: "Super Admin cannot delete own account" });
      }

      await userToDelete.deleteOne();
      return res.json({ message: "Account deleted successfully" });
    }

    // 🛡 ROLE-BASED DELETE
    if (loggedInUser.role === "admin") {
      // Admin can only delete normal users
      if (userToDelete.role !== "user") {
        return res
          .status(403)
          .json({ message: "Admin can delete only users" });
      }
    }

    if (loggedInUser.role !== "super-admin" && loggedInUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await userToDelete.deleteOne();

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: userToDelete._id,
        name: userToDelete.name,
        role: userToDelete.role,
      },
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
