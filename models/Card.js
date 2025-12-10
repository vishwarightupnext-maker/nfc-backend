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

    profileImage: String,
    face: String,

    email: String,
    phone: String,
    whatsapp: String,

    phonePe: String,
    gpay: String,
    paytm: String,
    upiId: String,

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

    // ✅ NEW FIELD — Store up to 10 YouTube links
    youtubeLinks: [
      {
        url: String,       // original youtube link
        embedUrl: String,  // iframe embed link
      }
    ],

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
        fileUrl: String,
        link: String,
      },
    ],
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
