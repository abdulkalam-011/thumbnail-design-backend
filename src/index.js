import dotenv from "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { YoutubeCron } from "./cron/youtube.cron.js";

// dotenv.config({
//   path: "./.env",
// });

connectDB()
  .then(() => {
    YoutubeCron()
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log(`Server is running on  http://localhost:${PORT}`);
    });
    app.on("error", (err) => {
      console.error(" internal Server error:", err);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });

connectCloudinary();

