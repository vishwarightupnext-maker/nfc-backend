import nodemailer from "nodemailer";
import { campaignTemplate } from "./emailTemplates.js";

export const sendCampaignEmail = async (emails, title, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_PORT == 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Happy Tap" <${process.env.MAIL_USER}>`,
    to: emails.join(","), // 👈 bulk emails
    subject: title,
    html: campaignTemplate({ title, message }),
  };

  await transporter.sendMail(mailOptions);
};
