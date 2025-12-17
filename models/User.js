import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["super-admin", "admin", "user"],
      default: "user",
    },

    /* =====================================================
       🔐 ADMIN CARD MANAGEMENT
    ===================================================== */

    // Total cards allowed (set by super-admin)
    cardLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Cards already created by this admin
    cardsCreated: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =====================================================
       OTP
    ===================================================== */

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* =====================================================
   🧮 AUTO CALCULATED FIELD (READ ONLY)
===================================================== */

UserSchema.virtual("availableCards").get(function () {
  return Math.max(this.cardLimit - this.cardsCreated, 0);
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
