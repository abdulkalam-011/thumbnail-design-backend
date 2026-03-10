import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// helper to grab token from cookies or Authorization header
const getTokenFromRequest = (req) => {
  // prefer cookie for browser clients
  if (req.cookies?.accessToken) return req.cookies.accessToken;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      statusCode:401,
      message:"User is not logged in",
      data:null,
      success:false
    })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return next(new ApiError(401, "User associated with token not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    }
    return next(new ApiError(401, "Invalid access token"));
  }
});

/**
 * Middleware factory that checks the authenticated user's role against
 * one or more allowed roles. Usage: authorizeRoles('admin', 'editor')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Not authenticated"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient privileges"));
    }
    next();
  };
};

/**
 * Verifies a refresh token that may be sent via cookie or request body.
 * Commonly used before issuing a new access token.
 */
const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return next(new ApiError(401, "Refresh token missing"));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      return next(new ApiError(401, "Invalid refresh token"));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Refresh token expired"));
    }
    return next(new ApiError(401, "Invalid refresh token"));
  }
});

export { authenticateUser, authorizeRoles, verifyRefreshToken };
