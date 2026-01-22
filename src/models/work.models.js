import mongoose, { Schema } from "mongoose";

const workSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    beforeImgUrl: {
      type: String,
      default: "",
    },
    afterImgUrl: {
      type: String,
      default: "",
    },
    thumbnailImgUrl: {
      type: String,
      required: [true, "thumbnail image is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    livelink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Work = mongoose.model("Work", workSchema);
