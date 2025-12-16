import AdminCard from "../models/AdminCard.js";
import fs from "fs";
import path from "path";

export const createAdminCardBySuperAdmin = async (req, res) => {
  try {
    // 🔐 SUPER ADMIN ONLY
    if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Super Admin only" });
    }

    const { adminId, name } = req.body;
    const files = req.files;

    if (!adminId || !name) {
      return res.status(400).json({ message: "adminId and name are required" });
    }

    if (!files || files.length !== 4) {
      return res.status(400).json({ message: "Upload exactly 4 images" });
    }

    // 🔥 FOLDER PER ADMIN
    const folderName = adminId.toString();
    const folderPath = path.join("uploads/admin-cards", folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const cards = [];

    files.forEach((file, index) => {
      const newName = `${index + 1}${path.extname(file.originalname)}`;
      const newPath = path.join(folderPath, newName);

      fs.renameSync(file.path, newPath);

      cards.push({
        image: `/${newPath}`,
      });
    });

    // 🔁 ONE CARD SET PER ADMIN (REPLACE IF EXISTS)
    await AdminCard.findOneAndDelete({ adminId });

    const adminCard = await AdminCard.create({
      adminId,
      name,
      folderName,
      cards,
    });

    res.status(201).json({
      success: true,
      adminCard,
    });
  } catch (err) {
    console.error("SUPER ADMIN CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getMyAdminCards = async (req, res) => {
  try {
    // ✅ Allow admin & super-admin
    if (!["admin", "super-admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const cardSet = await AdminCard.findOne({
      adminId: req.user.id,
    });

    if (!cardSet) {
      return res.json({
        success: true,
        cards: [],
      });
    }

    res.json({
      success: true,
      name: cardSet.name,

      // ✅ USE NAME AS FOLDER NAME (UI FRIENDLY)
      folderName: cardSet.name,

      // ✅ FIX WINDOWS PATHS (SAFE)
      cards: cardSet.cards.map((c) => ({
        image: c.image.replace(/\\/g, "/"),
      })),
    });
  } catch (err) {
    console.error("GET ADMIN CARDS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};





// export const getAdminFolderCards = async (req, res) => {
//   try {
//     // 🔐 ADMIN ONLY
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin only" });
//     }

//     // Find card set for this admin
//     const adminCard = await AdminCard.findOne({
//       adminId: req.user.id,
//     });

//     if (!adminCard) {
//       return res.json({
//         success: true,
//         folderName: null,
//         cards: [],
//       });
//     }

//     // 🔥 FIX WINDOWS PATHS
//     const fixedCards = adminCard.cards.map((c) => ({
//       image: c.image.replace(/\\/g, "/"),
//     }));

//     res.json({
//       success: true,
//       adminId: adminCard.adminId,
//       name: adminCard.name,
//       folderName: adminCard.folderName,
//       cards: fixedCards,
//     });
//   } catch (err) {
//     console.error("GET ADMIN FOLDER ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



export const getAdminFolderCards = async (req, res) => {
  try {
    // 🔐 ADMIN ONLY
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    // Find card set for this admin
    const adminCard = await AdminCard.findOne({
      adminId: req.user.id,
    });

    if (!adminCard) {
      return res.json({
        success: true,
        folderName: null,
        cards: [],
      });
    }

    // 🔥 FIX WINDOWS PATHS
    const fixedCards = adminCard.cards.map((c) => ({
      image: c.image.replace(/\\/g, "/"),
    }));

    res.json({
      success: true,
      adminId: adminCard.adminId,
      name: adminCard.name,

      // ✅ USE NAME AS FOLDER NAME (UI FRIENDLY)
      folderName: adminCard.name,

      cards: fixedCards,
    });
  } catch (err) {
    console.error("GET ADMIN FOLDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getAdminCardsByFolder = async (req, res) => {
  try {
    const { folderName } = req.params;

    // 🔐 Allow admin & super-admin
    if (!["admin", "super-admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const cardSet = await AdminCard.findOne({
      name: folderName, // 🔥 folderName IS the name
    });

    if (!cardSet) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({
      success: true,
      name: cardSet.name,
      folderName: cardSet.name,
      cards: cardSet.cards.map((c) => ({
        image: c.image.replace(/\\/g, "/"),
      })),
    });
  } catch (err) {
    console.error("GET ADMIN FOLDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};