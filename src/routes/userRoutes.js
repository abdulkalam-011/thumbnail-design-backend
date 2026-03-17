import express from "express";
const router = express.Router();
import {
  getAllUsers,
  getUserById,
  updateUserDetails,
  updateUserProfilePicture,
} from "../controllers/user.controllers.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router
  .route("/update-profile-picture")
  .patch(
    authenticateUser,
    upload.single("profilePicture"),
    updateUserProfilePicture
  );
router.route("/update-user").patch(authenticateUser, updateUserDetails);


// for admin use only
router.use(authorizeRoles("admin"));

// Get all users
router.route("/").get(authenticateUser, getAllUsers);

// Get a single user by ID
router.route("/:id").get(authenticateUser, getUserById);

export { router as userRoutes };
