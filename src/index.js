import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
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
