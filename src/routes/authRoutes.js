import express from 'express';
const router = express.Router();
import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  
  // const user = await User.findOne({email});
  // if(!user){
  //   return new ApiError(401, 'Invalid email or password');
  // }
   const user = {email,password}
   return res.status(200).json(user);
});

router.post('/register', (req, res) => {
  // Registration logic here
  res.send('Register route');
}); 

export {router as authRoutes};