import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= BASIC DETAILS ================= */
    name: { type: String, required: true },
    surname: String,
    businessName: String,
    designation: String,
    website: String,
    route: { type: String, required: true, unique: true },

    /* ================= ADDRESS ================= */
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
        match: [/^\+?[0-9]{10,15}$/, "Invalid mobile number"],
      },
    },

    /* ================= CARD IMAGES ================= */
    fourCards: {
      front1: String,
      back1: String,
      front2: String,
      back2: String,
    },

    profileImage: String,
    face: String,

    /* ================= CONTACT ================= */
    email: String,
    phone: String,
    whatsapp: String,
    phonePe: String,
    gpay: String,
    paytm: String,
    upiId: String,

    /* ================= SOCIAL ================= */
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

    youtubeLinks: [{ url: String, embedUrl: String }],

    googleMapLinks: [{ 
  url: String, 
  embedUrl: String 
}],


    customIcons: [{ iconName: String, iconUrl: String, link: String }],

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
    title: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
],


    clickCount: { type: Number, default: 0 },

    /* =====================================================
       💳 PAYMENT & VALIDITY (NEW)
    ===================================================== */

    isPaid: {
      type: Boolean,
      default: false, // unpaid by default
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentOrderId: {
      type: String, // Razorpay order_id
      default: null,
    },

    paymentId: {
      type: String, // Razorpay payment_id
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    /* ⏳ 60 days validity ONLY IF UNPAID */
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

/* =====================================================
   🧹 AUTO DELETE UNPAID EXPIRED CARDS
===================================================== */
cardSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isPaid: false },
  }
);

export default mongoose.models.Card || mongoose.model("Card", cardSchema);
