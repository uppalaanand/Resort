import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Gallery from "../models/Gallery";
import { deleteCache, getCache, setCache } from "../utils/cache";

// Helper to map uploaded files to URLs
const getImageUrls = (files: Express.Multer.File[] | undefined) => {
  if (!files) return [];
  return files.map((file) => file.path); // Cloudinary URLs
};


// @desc    Create a Gallery item
// @route   POST /api/gallery
// @access  Private/Admin
export const createGallery = asyncHandler(async (req: Request, res: Response) => {
  // Get uploaded files
  const files = req.files as Express.Multer.File[];
  // Validate that at least one image is uploaded
  if (!files || files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one image");
  }
  // Map uploaded files to image URLs
  const images = getImageUrls(files);
  // Get category and alt text from request body
  const { category, alt } = req.body;
  // Create new gallery item
  const gallery = await Gallery.create({
    images,
    category,
    alt,
  });
  // Invalidate cache for gallery list
  await deleteCache("gallery:all");
  // Return created gallery item
  res.status(201).json(gallery);
  }
);

//Before Caching
// @desc    Get all galaries
// @route   GET /api/gallery
// @access  Public
// export const getGallery = asyncHandler(
//   async (_req: Request, res: Response) => {
//     const gallery = await Gallery.find().sort({ createdAt: -1 });
//     res.status(200).json(gallery);
//   }
// );


//After Caching
// @desc    Get all galaries
// @route   GET /api/gallery
// @access  Public
export const getGallery = asyncHandler(async (_req: Request, res: Response) => {
  //Create a cache key
  const cacheKey = "gallery:all";
  //try to get cached Date
  const cachedGallery = await getCache(cacheKey);
  //if cached Data exist return it
  if(cachedGallery) {
    //return gallery
    console.log("Serving Gallery from Redis");
    return (res as any).status(200).json(cachedGallery);
  }
  //if not, get data from Mongodb
  const gallery = await Gallery.find().sort({ createdAt: -1 });
  //cache the gallery for future requests
  await setCache(cacheKey, gallery, 3600);
  console.log("Serving Gallery from MongoDB");
  //return res
  res.status(200).json(gallery);
  }
);


// @desc    Update a Gallery item
// @route   PUT /api/galery/:id
// @access  Private/Admin
export const updateGallery = asyncHandler(async (req: Request, res: Response) => {
  // Get gallery ID and uploaded files
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  // Find the gallery item by ID
  const gallery = await Gallery.findById(id);
  // If not found, return 404
  if (!gallery) {
    res.status(404);
    throw new Error("Gallery item not found");
  }
  // Update fields if provided
  if (files && files.length > 0) {
    gallery.images = files.map((file) => file.path);
  }
  // Update category and alt text if provided
  gallery.category = req.body.category || gallery.category;
  gallery.alt = req.body.alt || gallery.alt;
  // Save the updated gallery item
  const updatedGallery = await gallery.save();
  // Invalidate cache for gallery list
  await deleteCache("gallery:all");
  // Return updated gallery item
  res.status(200).json(updatedGallery);
  }
);


// @desc    Delete a Gallery (Permanent delete)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGallery = asyncHandler(async (req: Request, res: Response) => {
    // Find the gallery item by ID
    const gallery = await Gallery.findById(req.params.id);
    // If not found, return 404
    if (!gallery) {
      res.status(404);
      throw new Error("Gallery item not found");
    }
    // Delete the gallery item
    await gallery.deleteOne();
    // Invalidate cache for gallery list
    await deleteCache("gallery:all");
    // Return success message
    res.status(200).json({ message: "Gallery deleted successfully" });
  }
);