import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log(CLOUDINARY_CLOUD_NAME);
// Function to create Multer storage for a specific folder
export const storage = (folderName: string) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    } as any,
  });

export { cloudinary };