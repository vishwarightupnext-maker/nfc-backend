import Card from "../models/Card.js";
import PDFDocument from "pdfkit";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

/* ============================================================
   Helper: Upload Base64 Image → Cloudinary
   ============================================================ */
const uploadBase64Image = async (base64, folder) => {
  if (!base64) return null;
  const uploaded = await cloudinary.uploader.upload(base64, { folder });
  return uploaded.secure_url;
};

/* ============================================================
   Helper: Create Single PDF (Front + Back) in uploads/cards
   ============================================================ */
const UPLOAD_FOLDER = path.join("./uploads/cards");
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });

const createTwoSidePdf = async (frontBase64, backBase64, route) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = path.join(UPLOAD_FOLDER, `${route}.pdf`);
      const pdf = new PDFDocument({ size: "A4", layout: "landscape" });
      const stream = fs.createWriteStream(pdfPath);
      pdf.pipe(stream);

      const pageWidth = pdf.page.width;
      const pageHeight = pdf.page.height;
      const imgWidth = pageWidth / 2 - 10;
      const imgHeight = (imgWidth * 1009) / 649; // adjust ratio if needed

      const frontBuffer = Buffer.from(frontBase64.split(",")[1], "base64");
      const backBuffer = Buffer.from(backBase64.split(",")[1], "base64");

      // Front image
      pdf.image(frontBuffer, 10, (pageHeight - imgHeight) / 2, { width: imgWidth, height: imgHeight });
      // Back image
      pdf.image(backBuffer, pageWidth / 2 + 5, (pageHeight - imgHeight) / 2, { width: imgWidth, height: imgHeight });

      pdf.end();

      stream.on("finish", () => resolve(`/uploads/cards/${route}.pdf`));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

/* ============================================================
   CREATE CARD
   ============================================================ */
/* ============================================================
   Helper: Save Base64 Image → /uploads/cards/<route>/<filename>.png
============================================================ */
const saveBase64ToRouteFolder = (base64, route, filename) => {
  if (!base64) return null;

  const folder = path.join("uploads", "cards", route);

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const filePath = path.join(folder, filename + ".png");

  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  fs.writeFileSync(filePath, buffer);

  // return relative path for database
  return "/" + filePath.replace(/\\/g, "/");
};


export const getRouteImages = async (req, res) => {
  try {
    const { route } = req.params;

    if (!route) {
      return res.status(400).json({ message: "Route is required" });
    }

    const folderPath = path.join("uploads", "cards", route);

    // Check folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ message: "No images found for this route" });
    }

    // Read all files inside folder
    const files = fs.readdirSync(folderPath);

    // Convert filenames → URL paths
    const imageUrls = files.map(file =>
      `/uploads/cards/${route}/${file}`
    );

    return res.json({
      success: true,
      route,
      images: imageUrls,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ============================================================
   CREATE CARD (LOCAL STORAGE)
============================================================ */
export const createCard = async (req, res) => {
  try {
    const {
      route,
      frontImage1, backImage1,
      frontImage2, backImage2,
      profileImage, faceImage,
      ...rest
    } = req.body;

    // Check route exists
    const exists = await Card.findOne({ route });
    if (exists) return res.status(400).json({ message: "Route already exists" });

    // Save 4 card images inside:  /uploads/cards/<route>/
    const front1 = saveBase64ToRouteFolder(frontImage1, route, "front1");
    const back1  = saveBase64ToRouteFolder(backImage1,  route, "back1");
    const front2 = saveBase64ToRouteFolder(frontImage2, route, "front2");
    const back2  = saveBase64ToRouteFolder(backImage2,  route, "back2");

    // Save profile + face images
    const profileImageUrl = profileImage
      ? saveBase64ToRouteFolder(profileImage, route, "profile")
      : null;

    const faceImageUrl = faceImage
      ? saveBase64ToRouteFolder(faceImage, route, "face")
      : null;

    // Create card in DB
    const card = await Card.create({
      ...rest,
      route,
      fourCards: {
        front1,
        back1,
        front2,
        back2,
      },
      profileImage: profileImageUrl,
      face: faceImageUrl,
    });

    res.status(201).json({ success: true, card });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



/* ============================================================
   UPDATE CARD BY ROUTE
   ============================================================ */
export const updateCardByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    const { frontImage, backImage, profileImage, faceImage, ...rest } = req.body;

    const card = await Card.findOne({ route });
    if (!card) return res.status(404).json({ message: "Card not found" });

    let pdfUrl = card.pdfUrl;
    if (frontImage && backImage) {
      pdfUrl = await createTwoSidePdf(frontImage, backImage, route);
    }

    let profileImageUrl = card.profileImage;
    let faceImageUrl = card.faceImage;

    if (profileImage) profileImageUrl = await uploadBase64Image(profileImage, "profile");
    if (faceImage) faceImageUrl = await uploadBase64Image(faceImage, "face-images");

    const updatedCard = await Card.findOneAndUpdate(
      { route },
      { ...rest, pdfUrl, profileImage: profileImageUrl, faceImage: faceImageUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedCard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   UPDATE CARD BY ID
   ============================================================ */
export const updateCardById = async (req, res) => {
  try {
    const cardId = req.params.id;
    let updateData = { ...req.body };

    /* --------------------------------------------
     0️⃣ Parse JSON fields safely
    -------------------------------------------- */
    if (req.body.frontData) updateData.frontData = JSON.parse(req.body.frontData);
    if (req.body.backData) updateData.backData = JSON.parse(req.body.backData);
    if (req.body.socials) updateData.socials = JSON.parse(req.body.socials);

    /* --------------------------------------------
     1️⃣ Existing dynamic images from frontend
    -------------------------------------------- */
    let existingDynamicImages = [];

    if (req.body.existingDynamicImages) {
      const existingImgs = Array.isArray(req.body.existingDynamicImages)
        ? req.body.existingDynamicImages
        : [req.body.existingDynamicImages];

      const existingLinks = Array.isArray(req.body.dynamicLinks)
        ? req.body.dynamicLinks
        : [req.body.dynamicLinks];

      existingImgs.forEach((imgUrl, i) => {
        existingDynamicImages.push({
          fileUrl: imgUrl,
          link: existingLinks[i] || "",
        });
      });
    }

    /* --------------------------------------------
     2️⃣ NEW dynamic uploaded images
    -------------------------------------------- */
    let uploadedImages = [];

    if (req.files?.dynamicImages && req.files.dynamicImages.length > 0) {
      uploadedImages = req.files.dynamicImages.map((file, index) => ({
        fileUrl: `${req.protocol}://${req.get("host")}/uploads/cards/productimg/${file.filename}`,
        link: req.body.dynamicLinks?.[existingDynamicImages.length + index] || "",
      }));
    }

    updateData.dynamicImgFiles = [...existingDynamicImages, ...uploadedImages];

    /* --------------------------------------------
     3️⃣ Handle Profile Image Upload
    -------------------------------------------- */
    if (req.files?.profileImage && req.files.profileImage.length > 0) {
      updateData.profileImage = `${req.protocol}://${req.get("host")}/uploads/cards/profile/${req.files.profileImage[0].filename}`;
    }

    /* --------------------------------------------
     4️⃣ Update Database
    -------------------------------------------- */
    const updatedCard = await Card.findByIdAndUpdate(cardId, updateData, { new: true });

    return res.json({
      success: true,
      message: "Card updated successfully",
      card: updatedCard,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Update failed", details: err.message });
  }
};






//REMOVE 

// export const deleteDynamicImage = async (req, res) => {
//   try {
//     const { cardId, imgId } = req.params;

//     const card = await Card.findById(cardId);
//     if (!card) return res.status(404).json({ error: "Card not found" });

//     // Filter out the image by ID
//     card.dynamicImgFiles = card.dynamicImgFiles.filter(
//       (img) => String(img._id) !== imgId
//     );

//     await card.save();

//     res.json({
//       message: "Image deleted successfully",
//       dynamicImgFiles: card.dynamicImgFiles,
//     });

//   } catch (error) {
//     res.status(500).json({ error: "Delete failed", details: error.message });
//   }
// };


export const deleteDynamicImage = async (req, res) => {
  try {
    const { cardId, imgId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    // Find the image object
    const imageObj = card.dynamicImgFiles.find(
      (img) => String(img._id) === imgId
    );

    if (!imageObj)
      return res.status(404).json({ error: "Image not found" });

    // Extract file path
    const filePath = imageObj.fileUrl.replace(
      `${process.env.BASE_URL}/`,
      ""
    );

    const fullPath = path.join(process.cwd(), filePath);

    // Delete file from server
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Remove from DB array
    card.dynamicImgFiles = card.dynamicImgFiles.filter(
      (img) => String(img._id) !== imgId
    );

    await card.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
      dynamicImgFiles: card.dynamicImgFiles,
    });
  } catch (error) {
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
};




/* ============================================================
   GET ALL CARDS
   ============================================================ */
export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json({ success: true, cards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   GET CARD BY ROUTE
   ============================================================ */
export const getCardByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    
    const card = await Card.findOne({ route });
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.clickCount += 1;
    await card.save();

    res.status(200).json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   GET CARD BY ID
   ============================================================ */
export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   TRACK CLICK COUNT
   ============================================================ */
export const trackRouteClick = async (req, res) => {
  try {
    const { route } = req.params;
    const card = await Card.findOneAndUpdate(
      { route },
      { $inc: { clickCount: 1 } },
      { new: true }
    );
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json({ message: "Click tracked", totalClicks: card.clickCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   DELETE CARD BY ID
   ============================================================ */
export const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Card deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFourCardPdf = (route) => {
  return new Promise((resolve, reject) => {
    const folder = path.join("uploads", "cards", route);
    const outPdf = path.join(folder, `${route}.pdf`);

    const pdf = new PDFDocument({ size: "A4", layout: "landscape" });
    const stream = fs.createWriteStream(outPdf);
    pdf.pipe(stream);

    const pageW = pdf.page.width;
    const pageH = pdf.page.height;

    const margin = 20;

    // cell sizes for 2x2 layout
    const cellW = (pageW - margin * 3) / 2;
    const cellH = (pageH - margin * 3) / 2;

    // cell top-left positions
    const positions = [
      { x: margin, y: margin },                         // front1
      { x: margin * 2 + cellW, y: margin },             // back1
      { x: margin, y: margin * 2 + cellH },             // front2
      { x: margin * 2 + cellW, y: margin * 2 + cellH }, // back2
    ];

    const images = [
      path.join(folder, "front1.png"),
      path.join(folder, "back1.png"),
      path.join(folder, "front2.png"),
      path.join(folder, "back2.png"),
    ];

    images.forEach((imgPath, index) => {
      if (fs.existsSync(imgPath)) {
        const { x, y } = positions[index];

        pdf.save();

        // Move origin to top-left of cell
        pdf.translate(x, y);

        // Rotate inside the cell
        pdf.rotate(90, { origin: [0, 0] });

        // Draw image rotated, with swapped width/height
        pdf.image(imgPath, 0, -cellW, {
          fit: [cellH, cellW], // swap fit for rotated image
          align: "center",
          valign: "center"
        });

        pdf.restore();
      }
    });

    pdf.end();

    stream.on("finish", () => resolve(`/uploads/cards/${route}/${route}.pdf`));
    stream.on("error", reject);
  });
};







export const getPdfByRoute = async (req, res) => {
  try {
    const { route } = req.params;

    if (!route) {
      return res.status(400).json({ message: "Route is required" });
    }

    const card = await Card.findOne({ route });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Generate PDF every time
    const pdfUrl = await createFourCardPdf(route);

    return res.status(200).json({ success: true, pdfUrl });

  } catch (error) {
    console.error("Error fetching PDF by route:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const downloadPdfByRoute = async (req, res) => {
  try {
    const { route } = req.params;

    // Create 4-card PDF
    const pdfUrl = await createFourCardPdf(route);

    const fullPath = path.join(process.cwd(), pdfUrl);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.download(fullPath);

  } catch (error) {
    console.error("PDF download error:", error);
    res.status(500).json({ message: "Unable to download PDF" });
  }
};
