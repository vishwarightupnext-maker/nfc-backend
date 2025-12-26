import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import cardRoutes from "./routes/cardRoutes.js";
import simpleCardRoutes from "./routes/simpleCardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoute from "./routes/googleAuthRoute.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import contentRoutes from "./routes/cardContentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import email from "./routes/emailRoutes.js";
import admincard from "./routes/adminCard.routes.js";
import userRoutess from "./routes/user.routes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import googleMapRoutes from "./routes/googleRoutes.js";
import Backups from "./routes/backups.routes.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

// -------------------- CORS --------------------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// -------------------- Public uploads folder --------------------
app.use("/uploads", express.static("uploads"));

// -------------------- MongoDB (FIXED) --------------------
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME, // ✅ VERY IMPORTANT
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
    console.log("📦 Connected DB:", mongoose.connection.name);

    const collections =
      await mongoose.connection.db.listCollections().toArray();

    console.log(
      "📂 Collections:",
      collections.map((c) => c.name)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// -------------------- Auth Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoute);

// -------------------- Test Route --------------------
app.get("/", (req, res) => {
  res.send("✅ Backend running!");
});

// -------------------- Card Routes --------------------
app.use("/api/cards", cardRoutes);
app.use("/api/cards", profileRoutes);

app.use("/api/payment", paymentRoutes);

// -------------------- Simple Card Routes --------------------
app.use("/api", simpleCardRoutes);
app.use("/api", admincard);

app.use("/api", userRoutes);
app.use("/api", userRoutess);

app.use("/api", youtubeRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/email", email);
app.use("/api/cards", googleMapRoutes);

// -------------------- Backup Routes --------------------
app.use("/api", Backups);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
