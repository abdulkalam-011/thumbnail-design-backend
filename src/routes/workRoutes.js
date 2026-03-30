import express from "express";
const router = express.Router();

import {
  getAllWorks,
  getWorkById,
  uploadWork,
} from "../controllers/work.controllers.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

router.route("/").get(getAllWorks);
router.route("/:workId").get(getWorkById);
router.use(authenticateUser, authorizeRoles("admin"));
router.route("/").post(uploadWork);

export { router as workRoutes };
