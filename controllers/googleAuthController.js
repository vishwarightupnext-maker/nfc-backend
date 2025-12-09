// controllers/googleAuthController.js
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userData = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    // Create your own JWT token
    const myToken = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Google Login Successful",
      token: myToken,
      user: userData,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(400).json({ success: false, message: "Invalid Google token" });
  }
};
