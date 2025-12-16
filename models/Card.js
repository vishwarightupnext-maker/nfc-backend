import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    surname: String,
    businessName: String,
    designation: String,
    website: String,
    route: { type: String, required: true, unique: true },

    /* ✅ STRUCTURED EXTRA ADDRESS */
extraAddress: {
  doorNo: String,
  apartment: String,
  street: String,
  city: String,
  state: String,
  pinCode: String,

  phoneNumber: {
    type: String,
    trim: true,
    match: [
      /^\+?[0-9]{10,15}$/,
      "Invalid mobile number", // ✅ ERROR MESSAGE
    ],
  },
},


    fourCards: {
      front1: String,
      back1: String,
      front2: String,
      back2: String,
    },

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

    youtubeLinks: [
      {
        url: String,
        embedUrl: String,
      },
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

// ⭐ Prevent OverwriteModelError
export default mongoose.models.Card || mongoose.model("Card", cardSchema);
