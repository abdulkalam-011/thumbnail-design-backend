import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadFileToCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("file uploaded successfully:", uploadResult.url);
    return uploadResult;
  } catch (error) {
    console.log("file upload failed ", error);
    fs.unlinkSync(filePath);
    return null;
  }
};

export { uploadFileToCloudinary };
