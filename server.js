import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import cardRoutes from "./routes/cardRoutes.js";
import simpleCardRoutes from "./routes/simpleCardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoute from "./routes/googleAuthRoute.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import contentRoutes from "./routes/cardContentRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import email from "./routes/emailRoutes.js"
import admincard from "./routes/adminCard.routes.js"
import userRoutess from "./routes/user.routes.js";
import dotenv from "dotenv";

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

// -------------------- MongoDB --------------------
mongoose
  .connect("mongodb+srv://vishwarightupnext_db_user:esBWPPXwZhxXXE8I@cluster0.b3l7zes.mongodb.net/cc?appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// -------------------- Auth Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoute);

// -------------------- Test Route --------------------
app.get("/", (req, res) => {
  res.send("✅ Backend running on local network!");
});

// -------------------- Card Routes --------------------
app.use("/api/cards", cardRoutes);            // Old front/back cards
app.use("/api/cards", profileRoutes);         // Profile image upload (optional)

// -------------------- SIMPLE 4-IMAGE CARD SET ROUTER --------------------
app.use("/api", simpleCardRoutes);  
// POST /api         → create simple card set
// GET  /api         → get all simple card sets
// DELETE /api/:id   → delete simple card set
app.use("/api", admincard);  

app.use("/api", userRoutes);
app.use("/api", userRoutess);

app.use("/api", youtubeRoutes);
app.use("/api/content", contentRoutes);


app.use("/api/email", email);


// -------------------- Start Server --------------------
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running at http://192.168.1.36:${PORT}`)
);
