import express from "express";
const router = express.Router();


import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getUserById } from "../controllers/user.controllers.js";

//  route : /api/v1/user/
//  Purpose : Create a new user



// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, "Users fetched successfully", users));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});


// Get user by ID
router.get("/:id", getUserById);


router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully", user));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

router.post("/:id/avatar", async (req, res) => {
  const userId = req.params.id;
  const { profilePicture } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    ).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "User avatar updated successfully", user));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

export { router as userRoutes };
