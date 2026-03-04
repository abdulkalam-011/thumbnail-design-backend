import express from 'express';
const router = express.Router();
import {ApiResponse} from '../utils/ApiResponse.js';
import {upload} from '../middlewares/multer.middleware.js';
import {loginUser, registerUser} from '../controllers/auth.controllers.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { logoutUser } from '../controllers/auth.controllers.js';




// route :/api/v1/auth/register
// purpose : register user
router.post("/register", upload.single("profilePicture"), registerUser  );

// route :/api/v1/auth/login
// purpose : login user
router.post("/login", loginUser );


router.post("/logout", authenticateUser, logoutUser );
export {router as authRoutes};