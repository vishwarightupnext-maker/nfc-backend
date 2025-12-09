import PDFDocument from "pdfkit";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const imageToPdfAndUpload = async (base64Image, filename) => {
  return new Promise((resolve, reject) => {
    const pdfPath = `./temp_${filename}.pdf`;

    const doc = new PDFDocument({
      autoFirstPage: true,
      size: "A4"
    });

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Convert Base64 → Buffer
    const img = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(img, "base64");

    // Add Image to PDF
    doc.image(buffer, 0, 0, {
      fit: [595, 842],
      align: "center",
      valign: "center"
    });

    doc.end();

    stream.on("finish", async () => {
      try {
        // 🔥 FIX: Upload as RAW & make PUBLIC
        const uploaded = await cloudinary.uploader.upload(pdfPath, {
          resource_type: "raw",
          folder: "card_pdfs",
          access_mode: "public" // 👈 Makes PDF public
        });

        fs.unlinkSync(pdfPath);

        resolve(uploaded.secure_url); // Return public PDF URL
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        reject(err);
      }
    });

    stream.on("error", reject);
  });
};
