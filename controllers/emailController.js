import User from "../models/User.js";
import { sendCampaignEmail } from "../utils/sendCampaignEmail.js";

/**
 * @desc   Send email campaign to all users
 * @route  POST /api/email/campaign
 * @access Admin / Super Admin
 */
export const sendEmailCampaign = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // 1️⃣ Get all user emails
    const users = await User.find({}, { email: 1, _id: 0 });
    const emails = users.map(u => u.email);

    if (emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users found",
      });
    }

    // 2️⃣ Send campaign
    await sendCampaignEmail(emails, title, message);

    res.status(200).json({
      success: true,
      totalRecipients: emails.length,
      message: "Campaign email sent successfully",
    });
  } catch (error) {
    console.error("Campaign email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send campaign email",
    });
  }
};
