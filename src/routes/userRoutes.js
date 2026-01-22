import express from 'express';
const router = express.Router();
import {User} from '../models/user.models.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';



//  route :/api/v1/user/
// Create a new user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body; 
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiError(400, 'Email already in use'));
    }   
    const newUser = new User({ name, email, password });
    await newUser.save();   
    return res.status(201).json(new ApiResponse(201, 'User created successfully', newUser));
  }
  catch (error) {
    return res.status(500).json(new ApiError(500, 'Server error'));
  } 
});


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');  
    return res.status(200).json(new ApiResponse(200, 'Users fetched successfully', users));
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Server error'));
  } 
});

// Get user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    } 
    return res.status(200).json(new ApiResponse(200, 'User fetched successfully', user));
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Server error'));
  } 
});
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;  
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }
    return res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Server error'));
  }
});

router.post('/:id/avatar', async (req, res) => {
  const userId = req.params.id;
  const { profilePicture } = req.body; 
  try {
    const user = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true }).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }   
    return res.status(200).json(new ApiResponse(200, 'User avatar updated successfully', user));
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Server error'));
  }
});

export {router as userRoutes};