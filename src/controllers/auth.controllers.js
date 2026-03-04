import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToCloudinary } from "../utils/fileUpload.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if ([name, email, password].some((field) => field.trim() === "")) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiError(400, "Email already in use"));
    }

    const profilePictureLocalPath = req.file?.path || "";

    let profilePictureUrl = "";
    if (profilePictureLocalPath) {
      const profilePicture = await uploadFileToCloudinary(
        profilePictureLocalPath
      );

      profilePictureUrl = profilePicture?.url || "";
    }
    const user = await User.create({
      name,
      email,
      password,
      profilePicture: profilePictureUrl || "",
      refreshToken: "",
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(201)
      .json(new ApiResponse(201, "User created successfully", createdUser));
  } catch (error) {
    console.log("user registration error ", error);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};

export { registerUser };
