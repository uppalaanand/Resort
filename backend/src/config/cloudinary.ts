import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const CLOUDINARY_CLOUD_NAME="dtes9veeb";
const CLOUDINARY_API_KEY="256193621893441";
const CLOUDINARY_API_SECRET="HQBNEsyQg9Zw2VdNmUWXFlKywBE";

// Cloudinary configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
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