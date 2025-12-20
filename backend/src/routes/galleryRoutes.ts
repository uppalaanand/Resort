import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import { createGallery, getGallery, updateGallery, deleteGallery, } from "../controllers/galleryController";
import { uploadGallery } from "../middleware/uploadGallery";

const router = express.Router();

/* ---------------- GALLERY ROUTES ---------------- */

// Get all gallery images (Public)
router.route("/").get(getGallery as any);
router.route("/").post(protect as any, admin as any, uploadGallery.array("images", 10), createGallery as any);
router.route("/:id").patch(protect as any,admin as any,uploadGallery.array("images", 10),updateGallery as any);
router.route("/:id").delete(protect as any,admin as any,deleteGallery as any);

export default router;
