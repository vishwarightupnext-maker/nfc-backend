// utils/sendWelcomeEmail.js
import nodemailer from "nodemailer";
import { welcomeTemplate } from "./welcomeTemplate.js";

export const sendWelcomeEmail = async ({
  to,
  name,
  route,
  cardId,
}) => {
  if (!to) throw new Error("Recipient email is required");

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Happy Tap" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your Happy Tap Card is Ready 🎉",
    html: welcomeTemplate({ name, route, cardId }),
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("📧 Welcome email sent:", to);
  console.log("🆔 Card ID:", cardId);

  return info;
};
