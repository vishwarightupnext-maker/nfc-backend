import Card from "../models/Card.js";
import fs from "fs";
import path from "path";

/* ===============================
   HELPERS
   =============================== */

// Convert YouTube link → embed
export const toYouTubeEmbed = (url) => {
  try {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
    return url;
  } catch {
    return url;
  }
};

// Convert Google Map link → embed
export const toGoogleMapEmbed = (url) => {
  try {
    if (!url) return "";

    if (url.includes("/maps/place/")) {
      const q = url.split("/maps/place/")[1].split("/")[0];
      return `https://www.google.com/maps/embed/v1/place?q=${q}`;
    }

    if (url.includes("/maps/dir/")) {
      return url.replace("/maps/dir/", "/maps/embed/v1/directions?origin=");
    }

    // fallback
    return url;
  } catch {
    return url;
  }
};

/* ===============================
   ADD PRODUCT BLOCK
   =============================== */
export const addProductBlock = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) return res.status(404).json({ message: "Card not found" });

    const file = req.file;
    if (!file) return res.status(400).json({ message: "Image required" });

    // Save product image file
    const uploadPath = `uploads/cards/productimg/${Date.now()}-${file.originalname}`;
    fs.writeFileSync(uploadPath, file.buffer);

    const block = {
      id: `${Date.now()}`,
      type: "product",
      preview: "/" + uploadPath,
      link: req.body.link || "",
    };

    card.contentBlocks.push(block);
    await card.save();

    return res.json({ success: true, block });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   ADD YOUTUBE BLOCK
   =============================== */
export const addYoutubeBlock = async (req, res) => {
  try {
    const { url } = req.body;
    const card = await Card.findById(req.params.id);

    if (!url) return res.status(400).json({ message: "URL required" });

    const block = {
      id: `${Date.now()}`,
      type: "youtube",
      url,
      embedUrl: toYouTubeEmbed(url),
    };

    card.contentBlocks.push(block);
    await card.save();

    res.json({ success: true, block });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   ADD MAP BLOCK
   =============================== */
export const addMapBlock = async (req, res) => {
  try {
    const { url } = req.body;
    const card = await Card.findById(req.params.id);

    if (!url) return res.status(400).json({ message: "URL required" });

    const block = {
      id: `${Date.now()}`,
      type: "map",
      url,
      embedUrl: toGoogleMapEmbed(url),
    };

    card.contentBlocks.push(block);
    await card.save();

    res.json({ success: true, block });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   DELETE BLOCK
   =============================== */
export const deleteBlock = async (req, res) => {
  try {
    const { id, blockId } = req.params;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.contentBlocks = card.contentBlocks.filter((b) => b.id !== blockId);
    await card.save();

    return res.json({ success: true, message: "Block deleted", contentBlocks: card.contentBlocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   SAVE FULL CARD (INCLUDES ORDER)
   =============================== */
export const saveFullCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) return res.status(404).json({ message: "Card not found" });

    // update base fields
    card.name = req.body.name;
    card.surname = req.body.surname;
    card.businessName = req.body.businessName;
    card.designation = req.body.designation;
    card.phone = req.body.phone;
    card.email = req.body.email;
    card.route = req.body.route;
    card.extraAddress = req.body.extraAddress;

    card.frontData = JSON.parse(req.body.frontData || "{}");
    card.backData = JSON.parse(req.body.backData || "{}");
    card.socials = JSON.parse(req.body.socials || "{}");

    // Save ordering
    if (req.body.contentBlocks) {
      card.contentBlocks = JSON.parse(req.body.contentBlocks);
    }

    await card.save();

    res.json({ success: true, message: "Card saved", card });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
