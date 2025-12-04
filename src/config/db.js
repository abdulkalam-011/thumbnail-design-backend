import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DATABASE_NAME}`
    );
    console.log("DATABASE CONNECTED SUCCESSFULLY", conn.connection.host);
  } catch (err) {
    console.log("DATABASE CONNECTION ERR : ", err);
    process.exit(1);
  }
};

export default connectDB;
