import multer from 'multer';
import { storage } from '../config/cloudinary';

export const uploadEvent = multer({ storage: storage('events') });
export const uploadRoom = multer({ storage: storage('rooms') });
export const uploadBanquete = multer({ storage: storage('banquetes') });
export const uploadGallery = multer({ storage: storage('gallery') });
