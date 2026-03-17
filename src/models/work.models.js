import mongoose, { Schema } from "mongoose";

const workSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description:{
      type:String
    },
    videoId: {
      type: String,
      default: "",
    },
    channel:{
      type:Array,
    },
    thumbnails:Object,
    statistics:Object,
    category: {
     type:String
    },
    link: {
      type: String,
      default: "",
    },
    lastUpdated:{
      type:Date,
    }
  },
  { timestamps: true }
);

export const Work = mongoose.model("Work", workSchema);
