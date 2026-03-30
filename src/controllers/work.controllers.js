import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import {
  getCategoryName,
  getChannelInfo,
  getVideoInfo,
} from "../utils/getYoutubeVideo.js";
import { ApiResponse } from "../utils/Response.js";
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
        return res.status(400).json({
          message: "Video Not found for this URL",
          data: null,
          success: 0,
        });
      }

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

      const existingWork = await Work.find({
        $or: [{ videoId: video.id }, { link: url }],
      });

      if (existingWork.length > 0) {
        if (existingWork[0].videoId === video.id) {
          return res.status(400).json({
            statusCode: 400,
            message: "This video Already exists",
            data: existingWork[0].link,
            success: false,
          });
        }
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
        .status(201)
        .json(new ApiResponse(201, work, "video uploaded successfully"));
    } else {
    }
  } catch (error) {
    console.log("Work Upload Error : ", error);
    res.send(error);
  }
});

const getAllWorks = asyncHandler(async (req, res) => {
  const { limit } = req.params;
  console.log(limit);
  const videos = await Work.find();

  if (!videos && !videos.length > 0) {
    res.status(400).json({
      statusCode: 400,
      message: "Videos Not found ",
      data: null,
      success: false,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All video fetched succesfull"));
});

const getWorkById = asyncHandler(async (req, res) => {
  const { workId } = req.params;

  const work = await Work.findById(workId);
  if(!work){
    return res.status(400).json({
      statusCode:400,
      message:"work not found",
      data:null,
      success:false
    })
  }

  return res
  .status(200)
  .json(new ApiResponse(200,work,"work fetched successfully"))
});

export { uploadWork, getAllWorks, getWorkById };
