import multer from 'multer';
import path from 'path';

// Set folder where images will be saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Create "uploads" folder if not exists
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

// Filter allowed image types
const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;

