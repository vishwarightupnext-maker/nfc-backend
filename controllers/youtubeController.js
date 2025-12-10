// controllers/youtubeController.js
import Card from "../models/Card.js";

// Convert YouTube link to embed
function convertToEmbed(url) {
  try {
    if (!url) return null;

    let videoId = "";

    // Case 1 — Normal YouTube link
    if (url.includes("watch?v=")) {
      videoId = new URL(url).searchParams.get("v");
    }

    // Case 2 — youtu.be short link
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    // Case 3 — Already embed
    else if (url.includes("/embed/")) {
      return url;
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch (err) {
    console.log("Embed parsing error:", err);
    return null;
  }
}

/* ===========================
   ADD YOUTUBE LINK
=========================== */
export const addYouTubeLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    if (!url)
      return res.status(400).json({ success: false, message: "URL required" });

    const card = await Card.findById(id);
    if (!card)
      return res.status(404).json({ success: false, message: "Card not found" });

    if (card.youtubeLinks.length >= 10)
      return res.status(400).json({
        success: false,
        message: "Maximum 10 YouTube links allowed",
      });

    const newLink = {
      url,
      embedUrl: convertToEmbed(url),
    };

    card.youtubeLinks.push(newLink);
    await card.save();

    res.json({
      success: true,
      message: "YouTube link added successfully",
      card,
    });
  } catch (error) {
    console.log("Add YouTube Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===========================
   DELETE YOUTUBE LINK
=========================== */
export const deleteYouTubeLink = async (req, res) => {
  try {
    const { id, index } = req.params;

    const card = await Card.findById(id);
    if (!card)
      return res.status(404).json({ success: false, message: "Card not found" });

    if (!card.youtubeLinks[index])
      return res.status(400).json({ success: false, message: "Invalid index" });

    card.youtubeLinks.splice(index, 1);
    await card.save();

    res.json({
      success: true,
      message: "YouTube link deleted successfully",
      card,
    });
  } catch (error) {
    console.log("Delete YouTube Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===========================
   UPDATE YOUTUBE LINK
=========================== */
export const updateYouTubeLink = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { url } = req.body;

    if (!url)
      return res.status(400).json({ success: false, message: "URL required" });

    const card = await Card.findById(id);
    if (!card)
      return res.status(404).json({ success: false, message: "Card not found" });

    if (!card.youtubeLinks[index])
      return res.status(400).json({ success: false, message: "Invalid index" });

    card.youtubeLinks[index] = {
      url,
      embedUrl: convertToEmbed(url),
    };

    await card.save();

    res.json({
      success: true,
      message: "YouTube link updated successfully",
      card,
    });
  } catch (error) {
    console.log("Update YouTube Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
