import mongoose from "mongoose";
import archiver from "archiver";

export const downloadFullMongoBackup = async (req, res) => {
  try {
    // 1️⃣ Ensure MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "MongoDB not connected" });
    }

    // 2️⃣ Get the ACTUAL database object
    const db = mongoose.connection.db;
    console.log("✅ Connected DB:", mongoose.connection.name);

    // 3️⃣ Get collections
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections:", collections.map(c => c.name));

    if (!collections.length) {
      return res.status(400).json({ message: "No collections found" });
    }

    // 4️⃣ Response headers
    const date = new Date().toISOString().split("T")[0];
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=mongo-backup-${date}.zip`
    );
    res.setHeader("Content-Type", "application/zip");
    res.setTimeout(0);

    // 5️⃣ Create ZIP stream
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    // 6️⃣ Add each collection
    for (const col of collections) {
      const data = await db.collection(col.name).find({}).toArray();
      console.log(`📦 ${col.name}: ${data.length} documents`);

      archive.append(
        JSON.stringify(data, null, 2),
        { name: `${col.name}.json` }
      );
    }

    // 7️⃣ Finalize ZIP
    await archive.finalize();

  } catch (err) {
    console.error("❌ Backup error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Backup failed" });
    }
  }
};
