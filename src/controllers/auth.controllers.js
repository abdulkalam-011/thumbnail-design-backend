import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToCloudinary } from "../utils/fileUpload.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { json } from "express";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    if (!refreshToken) {
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
      .json(new ApiResponse(201, createdUser, "User Created successfully"));
  } catch (error) {
    console.log("user registration error ", error);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    return res.status(400).json({
      statusCode: 400,
      message: "email and password is required",
      data: null,
      success: false,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not Found ",
      data: null,
      success: false,
    });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      statusCode: 401,
      message: "Inavalid Credentials",
      data: null,
      success: false,
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
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

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  // user.refreshToken = "";
  // await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json(new ApiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  // const incomingAccessToken = req.cookies?.accessToken || req.body.accessToken;

  if (!incomingRefreshToken) {
    // throw new ApiError(401, "refresh token is not provided");
    return res.status(401).json({
      message: "refresh token is not provided",
      success: false,
    });
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      throw new ApiError(400, "user not found on given token ");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used  ");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", refreshToken, options)
      .cookie("refreshToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "acces token generated successfully "
        )
      );
  } catch (error) {
    return res.status(401).json({
      message: `${error.message}`,
      error,
      success: false,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    res.status(400).json({
      message: "all fields are required",
      success: false,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "new Password and confirm Password must be same",
      success: false,
    });
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "old password did not correct ",
      success: false,
    });
  }

  // if(oldPassword !==user?.password){
  //   return res.status(400).json({
  //     message:"password did not match from user",
  //     success:false
  //   })
  // }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password updated successfully"));
});

const deleteCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      statusCode: 401,
      message: "user is Not authorized or logged in ",
      data: null,
      success: false,
    });
  }

  const deletedUser = await User.findByIdAndDelete(user?._id);

  if (!deletedUser) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not found",
      data: null,
      success: false,
    });
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const getLOggedInUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");

  if (!user) {
    return res.status(401).json({
      statusCode: 401,
      message: "User is not logged or not found ",
      data: null,
      success: false,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "logged in user fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  deleteCurrentUser,
  getLOggedInUser,
};
