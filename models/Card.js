import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String },
    businessName: { type: String },
    designation: { type: String },
    website: { type: String },

    route: { type: String, required: true, unique: true },
    extraAddress:{type:String},
    frontPdfUrl: String,
    backPdfUrl: String,

    profileImage: String,   // already present (kept here)
    face: String,           // ✅ NEW IMAGE FIELD

    email: String,
    phone: String,
    whatsapp: String,

    phonePe: String,
    gpay: String,
    paytm: String,
    upiId: String,

    socials: {
      instagram: String,
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
    },

    customIcons: [
      {
        iconName: String,
        iconUrl: String,
        link: String,
      },
    ],

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

    frontBg: String,
    backBg: String,
    dynamicImgFiles: [
      {
        fileUrl: String, // store uploaded file URL
        link: String,    // corresponding link
      },
    ],
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
