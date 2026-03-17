import dotenv from "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { getCategoryName, getVideoInfo } from "./utils/getYoutubeVideo.js";


// import "./cron/youtube.cron.js"

// dotenv.config({
//   path: "./.env",
// });

const PORT = process.env.PORT || 4000;

// const video = await getVideoInfo("https://www.youtube.com/watch?v=dESIGVxSSCE")
// console.log("Video:",  video.snippet)

// const category = await getCategoryName(video.snippet.categoryId)
// console.log("CATEGORY: ",category)



connectDB()
.then(() => {
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
