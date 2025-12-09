import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT, // use 587 if not working
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.MAIL_USER, // your Hostinger email
        pass: process.env.MAIL_PASS,    // your Hostinger email password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your Verification Code</h2>
        <p>Use the OTP below to reset your password:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP email sent to:", to);
  } catch (error) {
    console.log("Email error:", error);
  }
};
