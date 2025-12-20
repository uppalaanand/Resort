import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/events",
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

export const uploadEvent = multer({
  storage,
  fileFilter,
});