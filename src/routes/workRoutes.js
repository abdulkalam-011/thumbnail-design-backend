import express from 'express';
const router = express.Router();
import { Work } from '../models/work.models.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';

//  route :/api/v1/auth/login

router.get("/",async(req,res,)=>{

  try {
      const works = await  Work.find();
      return res.status(200).json(new ApiResponse(200, 'Users fetched successfully', works));
  } catch (error) {
    
  }

})