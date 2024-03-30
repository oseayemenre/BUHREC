import { v2 as cloudinaryv2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinaryv2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const cloudinary = cloudinaryv2;
