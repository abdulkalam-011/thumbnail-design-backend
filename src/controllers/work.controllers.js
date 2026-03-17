import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import {
  getCategoryName,
  getChannelInfo,
  getVideoInfo,
} from "../utils/getYoutubeVideo.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Work } from "../models/work.models.js";

const uploadWork = asyncHandler(async (req, res) => {
  const { url } = req.body;

 

  if (!url) {
    return res.status(400).json({
      message: "url is required",
      data: null,
      success: false,
    });
  }

  try {
    if (url) {
      const video = await getVideoInfo(url);
      if (!video) {
        return res
          .status(400)
          .json({ message: "Video Not found for this URL" ,data:null, success:0});
      }

      console.log("CHANNL ID : ", video.snippet.channelId);
      const category = getCategoryName(video.snippet.categoryId);
      const channel = await getChannelInfo(video.snippet.channelId);

      if (!category) {
        return res.status(500).json({
          message: "failed to fetch category, please try again!",
          data: null,
          success: false,
        });
      }
      if (!channel) {
        return res.status(500).json({
          message: "failed to fetch channel details. please try again!",
          data: null,
          success: false,
        });
      }
       
      const data = {
        title: video.snippet.title,
        description: video.snippet.description,
        videoId: video.id,
        channel: channel,
        thumbnails: video.snippet.thumbnails,
        statistics: video.statistics,
        category,
        link: url,
        lastUpdated: Date.now(),
      }

      const work = await Work.create({
        title: video.snippet.title,
        description: video.snippet.description,
        videoId: video.id,
        channel: channel,
        thumbnails: video.snippet.thumbnails,
        statistics: video.statistics,
        category,
        link: url,
        lastUpdated: Date.now(),
      });

      if (!work) {
        return res.status(500).json({
          message: "Work upload data creation failed",
          data: null,
          success: false,
        });
      }
      return res
        .status(200)
        .json(new ApiResponse(200, work, "video uploaded successfully"));
    } else {
    }
  } catch (error) {
    console.log("Work Upload Error : ", error)
    res.send(error)
  }
});

export { uploadWork };
