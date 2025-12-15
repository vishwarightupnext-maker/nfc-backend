import User from "../models/User.js";

/**
 * @desc    Get all users emails (admin + users + super-admin)
 * @route   GET /api/users/all-emails
 * @access  Protected (Admin / Super Admin)
 */
export const getAllUserEmails = async (req, res) => {
  try {
    const users = await User.find(
      {},                // 🔥 no filter = all users
      { email: 1, _id: 0 } // only email
    ).sort({ createdAt: -1 });

    const emails = users.map((u) => u.email);

    res.status(200).json({
      success: true,
      totalUsers: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Get all user emails error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user emails",
    });
  }
};
