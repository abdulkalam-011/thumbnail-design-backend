import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/Response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFileToCloudinary } from "../utils/fileUpload.js";

const updateUserProfilePicture = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    return res.status(404).json({
      message: "Profile Picture is Required",
      data: null,
      success: false,
    });
  }

  const profilePicture = await uploadFileToCloudinary(profilePictureLocalPath);

  if (!profilePicture) {
    return res.status(500).json({
      message: "Profile Picture failed",
      data: null,
      success: false,
    });
  }
  const profilePictureUrl = profilePicture?.url;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { profilePicture: profilePictureUrl },
    },
    {
      new: true,
    }
  ).select("-refreshToken -password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "profile picture updated succesfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "all fields are required",
      data: null,
      success: false,
    });
  }

  const lowerName = name.toLowerCase()
  const lowerEmail = email.toLowerCase()

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { name:lowerName, email:lowerEmail},
    },
    { new: true }
  ).select("-password -refreshToken");

  if(!user){
    return res
    .status(501)
    .json({
      message:"User Profile update failed ",
      data:null,
      success:true
    })
  }

  return res
  .status(200)
  .json(new ApiResponse(200,user, "user details updated successfully"))
});

// For Admin Use Only 
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User Not Found from the given id ",
      });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user fethed Successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

export { getUserById, getAllUsers, updateUserDetails,updateUserProfilePicture };
