import express from 'express';
const router = express.Router();
import {ApiResponse} from '../utils/ApiResponse.js';
import {upload} from '../middlewares/multer.middleware.js';
import {deleteCurrentUser, getLOggedInUser, loginUser, refreshAccessToken, registerUser, resetPassword} from '../controllers/auth.controllers.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { logoutUser } from '../controllers/auth.controllers.js';




// route :/api/v1/auth/register
// purpose : register user
router.post("/register", upload.single("profilePicture"), registerUser  );

// route :/api/v1/auth/login
// purpose : login user
router.post("/login", loginUser );

// route : /api/v1/auth/logout
// purpose : logout user >> req.user 
router.post("/logout", authenticateUser, logoutUser );

// route : /api/v1/auth/refresh-token
// purpose : refresh access token after expiry  
router.post("/refresh-token", refreshAccessToken );

// route : /api/v1/auth/reset-password
// purpose : updating user password to a new password 
 router.route("/reset-password").put(authenticateUser,resetPassword)


// route : /api/v1/auth/delete-me
// purpose : delete the current user from database
router.delete("/delete-me",authenticateUser,deleteCurrentUser)


// route : /api/v1/auth/get-me
// purpose : get the current logged in user 
router.get("/get-me",authenticateUser,getLOggedInUser)


export {router as authRoutes};