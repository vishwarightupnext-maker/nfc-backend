import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: String,
    businessName: String,
    designation: String,
    website: String,

    route: { type: String, required: true, unique: true },
    extraAddress: String,

    /* ========================================================
       4 CARD SYSTEM (NEW)
    ======================================================== */
    fourCards: {
      front1: String,
      back1: String,
      front2: String,
      back2: String,
    },

    /* ========================================================
       Profile Images
    ======================================================== */
    profileImage: String,
    face: String,

    /* ========================================================
       Contact Info
    ======================================================== */
    email: String,
    phone: String,
    whatsapp: String,

    phonePe: String,
    gpay: String,
    paytm: String,
    upiId: String,

    /* ========================================================
       Socials
    ======================================================== */
    socials: {
      instagram: String,
      whatsapp: String,
      facebook: String,
      linkedin: String,
      youtube: String,
      twitter: String,
      pinterest: String,
      snapchat: String,
      threads: String,
      tiktok: String,
      github: String,
      telegram: String,
      sms: String,
    },

    /* ========================================================
       YouTube Links
    ======================================================== */
    youtubeLinks: [
      {
        url: String,
        embedUrl: String,
      }
    ],

    /* ========================================================
       Custom Icons
    ======================================================== */
    customIcons: [
      {
        iconName: String,
        iconUrl: String,
        link: String,
      },
    ],

    /* ========================================================
       Front / Back Data Blocks
    ======================================================== */
    frontData: {
      line1: String,
      line2: String,
      line3: String,
    },

    backData: {
      qrData: String,
      address: String,
      about: String,
    },

    /* ========================================================
       Gallery Images
    ======================================================== */
    dynamicImgFiles: [
      {
        fileUrl: String,
        link: String,
      },
    ],

    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
