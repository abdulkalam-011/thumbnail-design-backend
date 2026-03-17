import nodeCron from "node-cron";
import { Work } from "../models/work.models.js";
import axios from "axios";

const updateYoutubeStatistics = async (task) => {
  try {
    console.log("youtube cron is runnning")
    const videos = await Work.find();

    if(videos.length === 0){
      console.log("Videos is not available")
      task.stop()
      console.log("YOUTUBE STATISTICS UPDATE CRON STOPPED")
      return;
    }
    console.log(videos)
 
    // for (const video of videos) {
    //   const {data } = await axios.get("",{
    //    params: {
    //           part: "statistics",
    //           id: video.videoId,
    //           key: process.env.YOUTUBE_API_KEY,
    //         },
    //   })

    //   console.log("DATA: ",data)
    // }

  } catch (error) {
    console.log("YOUTUBE CRON ERROR: ", error);
  }
};

const youtubeTask = nodeCron.schedule("*/10 * * * * * ", ()=>{
  updateYoutubeStatistics(youtubeTask)
});




//   const videos = await Work.find({ videoId: 1 });

//       for (const video of videos) {
//         const { data } = await axios.get(
//           "https://www.googleapis.com/youtube/v3/videos",
//           {
//             params: {
//               part: "statistics",
//               id: video.videoId,
//               key: process.env.YOUTUBE_API_KEY,
//             },
//           }
//         );

//         console.log(data)
//         const statistiscs = data.items[0].statistics

//         await Work.findOne({videoId:video.videoId},{$set:{statistiscs}})

// console.log("Video statistics updated");
//       }