import express from 'express';
const router = express.Router();
import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';


//  route :/api/v1/auth/login
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  
  const user = await User.findOne({email});
  if(!user){
    return new ApiError(401, 'Invalid email or password');
  }
   return res.status(200).json(user);
});


// route :/api/v1/auth/register
router.post('/register', (req, res) => {
  res.send('Register route');
}); 

export {router as authRoutes};