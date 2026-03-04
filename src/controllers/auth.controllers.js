import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToCloudinary } from "../utils/fileUpload.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    if ( !refreshToken) {
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
    }

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed", [], error.stack);
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and password are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "user logged in successfully"
    )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });

  res
  .clearCookie("accessToken", {
    httpOnly: true,
    secure:true,
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure:true,
    sameSite: "strict",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
