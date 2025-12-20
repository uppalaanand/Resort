import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Gallery from "../models/Gallery";

// Helper to map uploaded files to URLs
const getImageUrls = (files: Express.Multer.File[] | undefined) => {
  if (!files) return [];
  return files.map((file) => file.path); // Cloudinary URLs
};

/* ---------------- CREATE GALLERY IMAGE ---------------- */
export const createGallery = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400);
      throw new Error("Please upload at least one image");
    }

    const images = getImageUrls(files);

    const { category, alt } = req.body;

    const gallery = await Gallery.create({
      images,
      category,
      alt,
    });

    res.status(201).json(gallery);
  }
);

/* ---------------- GET ALL GALLERY ---------------- */
export const getGallery = asyncHandler(
  async (_req: Request, res: Response) => {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(gallery);
  }
);

/* ---------------- UPDATE GALLERY ---------------- */
export const updateGallery = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    if (files && files.length > 0) {
      gallery.images = files.map((file) => file.path);
    }

    gallery.category = req.body.category || gallery.category;
    gallery.alt = req.body.alt || gallery.alt;

    const updatedGallery = await gallery.save();
    res.status(200).json(updatedGallery);
  }
);

/* ---------------- DELETE GALLERY ---------------- */
export const deleteGallery = asyncHandler(
  async (req: Request, res: Response) => {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      res.status(404);
      throw new Error("Gallery item not found");
    }

    await gallery.deleteOne();
    res.status(200).json({ message: "Gallery deleted successfully" });
  }
);