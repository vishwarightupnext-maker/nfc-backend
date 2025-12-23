import Card from "../models/Card.js";

/* =====================================================
   Convert Google Maps URL → EMBED URL (SAFE)
===================================================== */
function convertMapToEmbed(input) {
  try {
    if (!input) return null;

    const url = input.trim();

    /* ---------------------------------
       1️⃣ User pasted iframe HTML
    --------------------------------- */
    if (url.includes("<iframe")) {
      const match = url.match(/src="([^"]+)"/);
      return match ? match[1] : null;
    }

    /* ---------------------------------
       2️⃣ Already valid embed URL
    --------------------------------- */
    if (url.includes("/maps/embed")) {
      return url;
    }

    /* ---------------------------------
       3️⃣ BLOCK short / redirect links
    --------------------------------- */
    if (
      url.includes("maps.app.goo.gl") ||
      url.includes("goo.gl/maps")
    ) {
      return null; // ❌ not embeddable
    }

    /* ---------------------------------
       4️⃣ Normal Google Maps place/search
    --------------------------------- */
    if (url.includes("google.com/maps")) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        url
      )}&output=embed`;
    }

    return null;
  } catch (err) {
    console.log("Map embed parsing error:", err);
    return null;
  }
}

/* =====================================================
   ➕ ADD GOOGLE MAP LINK
===================================================== */
export const addGoogleMapLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Google Maps URL is required",
      });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    // Limit maps (optional)
    if (card.googleMapLinks.length >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 locations allowed",
      });
    }

    const embedUrl = convertMapToEmbed(url);
    if (!embedUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Please use Google Maps → Share → Embed a map → Copy link",
      });
    }

    card.googleMapLinks.push({
      url,
      embedUrl,
    });

    await card.save();

    return res.json({
      success: true,
      message: "Google Map added successfully",
      card,
    });
  } catch (error) {
    console.log("Add Google Map Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   🗑 DELETE GOOGLE MAP LINK
===================================================== */
export const deleteGoogleMapLink = async (req, res) => {
  try {
    const { id, index } = req.params;

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    if (!card.googleMapLinks[index]) {
      return res.status(400).json({
        success: false,
        message: "Invalid map index",
      });
    }

    card.googleMapLinks.splice(index, 1);
    await card.save();

    return res.json({
      success: true,
      message: "Google Map deleted successfully",
      card,
    });
  } catch (error) {
    console.log("Delete Google Map Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   ✏️ UPDATE GOOGLE MAP LINK
===================================================== */
export const updateGoogleMapLink = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Google Maps URL is required",
      });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    if (!card.googleMapLinks[index]) {
      return res.status(400).json({
        success: false,
        message: "Invalid map index",
      });
    }

    const embedUrl = convertMapToEmbed(url);
    if (!embedUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Please use Google Maps → Share → Embed a map → Copy link",
      });
    }

    card.googleMapLinks[index] = {
      url,
      embedUrl,
    };

    await card.save();

    return res.json({
      success: true,
      message: "Google Map updated successfully",
      card,
    });
  } catch (error) {
    console.log("Update Google Map Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
