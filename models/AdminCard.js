import mongoose from "mongoose";

const adminSubCardSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
  },
  { _id: false }
);

const adminCardSchema = new mongoose.Schema(
  {
    // 🔥 THIS ADMIN WILL SEE THE CARDS
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    folderName: {
      type: String,
      required: true,
    },

    cards: {
      type: [adminSubCardSchema],
      validate: {
        validator: (v) => v.length === 4,
        message: "Exactly 4 images are required",
      },
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminCard", adminCardSchema);
