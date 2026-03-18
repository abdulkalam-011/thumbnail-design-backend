import nodeCron from "node-cron";
import { Work } from "../models/work.models.js";
import { getChannelInfo, getVideoInfo } from "../utils/getYoutubeVideo.js";

export function YoutubeCron() {
  const updateYoutubeStatistics = async (task) => {
    try {
      console.log("youtube cron started...");
      const videos = await Work.find();

      if (videos.length <= 0) {
        console.log("Videos is not available");
        task.stop();
        console.log("YOUTUBE STATISTICS UPDATE CRON STOPPED");
        return;
      }

      for (const video of videos) {
        // const { data } = await axios.get(
        //   "https://www.googleapis.com/youtube/v3/videos",
        //   {
        //     params: {
        //       part: "statistics",
        //       id: video.videoId,
        //       key: process.env.YOUTUBE_API_KEY,
        //     },
        //   }
        // );
        const getVideo = await getVideoInfo(video.link);
        if(!getVideo){
          console.log("Video Fetching failes on Youtube Cron");
        task.stop();
        console.log("YOUTUBE STATISTICS UPDATE CRON STOPPED");
        return;
        }

        const channel = await getChannelInfo(getVideo.snippet.channelId)

        if(!channel){
          console.log("channel Fetch failes on youtube cron ")
          task.stop()
           console.log("YOUTUBE STATISTICS UPDATE CRON STOPPED");
           return;
        }
       

        const work = await Work.findByIdAndUpdate(
          video._id,
          {
            $set: {
              title: getVideo.snippet.title,
              description: getVideo.snippet.description,
              thumbnails: getVideo.snippet.thumbnails,
              statistics: getVideo.statistics,
              channel,
              lastUpdated: Date.now(),
            },
          },
          { new: true }
        );
        console.log("WORK: ", work.statistics);
      }

      console.log(" \n youtube cron Ended");
    } catch (error) {
      console.log("YOUTUBE CRON ERROR: ", error);
    }
  };

  const youtubeTask = nodeCron.schedule("0 0 * * * ", () => {
    updateYoutubeStatistics(youtubeTask);
  }); // scheduled for every day at 00:00 midnight
}

