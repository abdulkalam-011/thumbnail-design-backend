import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
       type: String, 
       required: [true, "Name is required"] 
    },
    email: { 
       type: String,
       required: [true, "Email is required"], 
       unique: true 
      },
    password: { 
      type: String, 
      required: [true, "Password is required"]
     },
    refreshToken: {
       type: String
       },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String, default: ""},
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
