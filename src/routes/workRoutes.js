import express from 'express';
const router = express.Router();

import { uploadWork } from '../controllers/work.controllers.js';




router.route("/upload-work").post(uploadWork)

export {router as workRoutes};