import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
 

const getUserById = asyncHandler(async(req,res)=>{
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        statusCode:404,
        message:"User Not Found from the given id "
      });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user fethed Successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
})


export {getUserById}