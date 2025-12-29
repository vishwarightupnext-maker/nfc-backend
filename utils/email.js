import nodemailer from "nodemailer";

/* -------------------------------------------------------
   SHARED TRANSPORTER (Hostinger SMTP)
-------------------------------------------------------- */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), // 465 or 587
  secure: process.env.MAIL_PORT == 465, // true for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* -------------------------------------------------------
   SEND OTP EMAIL
-------------------------------------------------------- */
export const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"HappyTap" <${process.env.MAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your Verification Code</h2>
        <p>Use the OTP below to reset your password:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    console.log("✅ OTP email sent to:", to);
  } catch (error) {
    console.error("❌ OTP email error:", error.message);
  }
};

/* -------------------------------------------------------
   SEND WELCOME EMAIL (NEW)
-------------------------------------------------------- */
// export const sendWelcomeEmail = async ({ to, name, route }) => {
//   try {
//     if (!to) return;

//     await transporter.sendMail({
//       from: `"HappyTap" <${process.env.MAIL_USER}>`,
//       to,
//       subject: "Welcome to HappyTap 🎉",
//       html: `
//         <div style="font-family:Arial,sans-serif">
//           <h2>Welcome ${name} 👋</h2>
//           <p>Your digital visiting card is ready.</p>
//           <p>
//             👉 <a href="https://www.happytap.in/${route}">
//               View Your Card
//             </a>
//           </p>
//           <br />
//           <p>Thank you for choosing <b>HappyTap</b>.</p>
//         </div>
//       `,
//     });

//     console.log("✅ Welcome email sent to:", to);
//   } catch (error) {
//     console.error("❌ Welcome email error:", error.message);
//   }
// };
