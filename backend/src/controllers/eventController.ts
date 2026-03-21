import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Event from "../models/Event";
import { deleteCache, getCache, setCache } from "../utils/cache";

// Helper to map uploaded files to URLs
const getImageUrls = (files: Express.Multer.File[] | undefined) => {
  if (!files) return [];
  return files.map((file) => file.path); // Cloudinary URLs
};


// @desc    Create a Event item
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    // Get uploaded files
    // const files = req.files as Express.Multer.File[];
    const files = req.files as Express.Multer.File[];
    // Validate that at least one image is uploaded
    if (!files || files.length === 0) {
      res.status(400);
      throw new Error("Please upload at least one image");
    }
    // Map uploaded files to image URLs
    const images = getImageUrls(files);
    // Get other event details from request body
    const { title, description, startDate, endDate } = req.body;
    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      res.status(400);
      throw new Error("All fields are required");
    }
    // Create new event
    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      images,
    });
    // Invalidate cache for events list
    await deleteCache("events:all");
    // Return created event
      res.status(201).json(event);
    }
);


//Before Caching
// @decs   Get all events
// @route   GET /api/events
// @access  Public
// export const getEvents = asyncHandler(
//   async (_req: Request, res: Response) => {
//     const events = await Event.find().sort({ startDate: 1 });
//     res.status(200).json(events);
//   }
// );


//After Caching
// @decs   Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (_req: Request, res: Response) => {
  // Create a cache key for all events
  const cacheKey = "events:all";
  //Try to get from cache
  const cachedEvents = await getCache(cacheKey);
  // If found in cache, return it
  if(cachedEvents) {
    // console.log("Serving events from Redis");
    return (res as any).status(200).json(cachedEvents);
  }
  // If not in cache, fetch from DB
  const events = await Event.find().sort({ startDate: 1 });
  // Store in cache for future requests for 1 hour (3600 seconds)
  await setCache(cacheKey, events, 3600);
  // console.log("Serving events from MongoDB");
  // Return the response
  res.status(200).json(events);
  }
);


//Before Caching
// @decs   Get event by ID
// @route   GET /api/events/:id
// @access  Public
// export const getEventById = asyncHandler(
//   async (req: Request, res: Response) => {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       res.status(404);
//       throw new Error("Event not found");
//     }
//     res.status(200).json(event);
//   }
// );


//After Caching
// @decs   Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req: Request, res: Response) => {
  // Create a cache key specific to this event ID
  const cacheKey = `event:${req.params.id}`;
  // Try to get event from cache
  const cachedEvent = await getCache(cacheKey);
  // If found in cache, return it
  if(cachedEvent) {
    // console.log(`Serving event ${req.params.id} from Redis`);
    return (res as any).status(200).json(cachedEvent);
  }
  // If not in cache, fetch from DB
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  // Store in cache for future requests for 1 hour (3600 seconds)
  await setCache(cacheKey, event, 3600);
  // console.log(`Serving event ${req.params.id} from MongoDB`);
  // Return the response
  res.status(200).json(event);
  }
);


// @desc    Update an event
// @route   PATCH /api/events/:id
// @access  Private/Admin
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  // Get event ID and uploaded files
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  // Find the event by ID
  const event = await Event.findById(id);
  // If not found, return 404
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  // Update event fields
  // Replace images if new images uploaded
  if (files && files.length > 0) {
    // event.images = files.map((file) => file.path);
    event.images = getImageUrls(files);
  }
  // Update other fields if provided
  event.title = req.body.title || event.title;
  event.description = req.body.description || event.description;
  event.startDate = req.body.startDate || event.startDate;
  event.endDate = req.body.endDate || event.endDate;
  // Save the updated event
  const updatedEvent = await event.save();
  // Invalidate cache for this event and all events list
  await deleteCache(`event:${id}`);
  await deleteCache("events:all");
  // Return updated event
  res.status(200).json(updatedEvent);
  }
);


// @desc    Delete a Event (Permanent delete)
// @route   DELETE /api/event/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  // Find the event by ID
  const event = await Event.findById(req.params.id);
  // If not found, return 404
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  // Delete the event
  await event.deleteOne();
  // Invalidate cache for this event and all events list
  await deleteCache(`event:${req.params.id}`);
  await deleteCache("events:all");
  // Return success message
  res.status(200).json({ message: "Event deleted successfully" });
  }
);