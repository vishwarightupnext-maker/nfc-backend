import User from "../models/User.js";

/**
 * GET USERS (FILTER BY ROLE)
 * /api/users?role=admin
 */
export const getUsers = async (req, res) => {
  try {
    // 🔐 Only super admin
    if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Super admin only" });
    }

    const { role } = req.query;

    const filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select(
      "_id name email role"
    );

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
