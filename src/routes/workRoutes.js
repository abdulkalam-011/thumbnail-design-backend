import express from 'express';
const router = express.Router();
import { Work } from '../models/work.models.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import e from 'express';

//  route :/api/v1/auth/login

router.get("/",async(req,res,)=>{

  try {
      const works = await  Work.find();
      return res.status(200).json(new ApiResponse(200, works, works));
  } catch (error) {
    console.log('work route err :', error);
  }
})

router.post("/",async(req,res,)=>{

  try { 

      const { title, description } = req.body;
      if(!title){
        return res.status(400).json(new ApiError(400, "title is required"));
      } 
      const newWork = new Work({
        title,
        description});

      const savedWork = await newWork.save();
      return res.status(201).json(new ApiResponse(201, savedWork, "Work created successfully"));
  }catch (error) {
    console.log('work route err :', error);
  }}) 

export {router as workRoutes};