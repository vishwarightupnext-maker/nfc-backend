import mongoose from "mongoose";

const subCardSchema = new mongoose.Schema({
  image: { type: String, required: true },
}, { _id: false });

const simpleCardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    folderName: { type: String, required: true },

    cards: {
      type: [subCardSchema],
      validate: {
        validator: (v) => v.length === 4,
        message: "Exactly 4 images are required"
      },
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("SimpleCard", simpleCardSchema);
