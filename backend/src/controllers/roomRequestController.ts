import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import RoomRequest from "../models/RoomRequest";
import Room from "../models/Room";

interface AuthRequest extends Request {
  user?: any;
  body: any;
  params: any;
}

/**
 * @desc    Create Room Request (when room is NOT available)
 * @route   POST /api/room-requests
 * @access  Private
 */
export const createRoomRequest = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      roomId,
      fromDate,
      toDate,
      numberOfGuests,
      extraBeds,
      specialRequests,
      contactName,
      contactPhone,
      checkInTime,
      checkOutTime
    } = req.body;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400);
      throw new Error("Invalid date format");
    }

    if (end <= start) {
      res.status(400);
      throw new Error("End date must be after start date");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    if (numberOfGuests > room.maxGuests) {
      res.status(400);
      throw new Error(
        `Maximum ${room.maxGuests} guests allowed for this room`
      );
    }

    const request = await RoomRequest.create({
      user: req.user._id,
      room: roomId,
      fromDate: start,
      toDate: end,
      numberOfGuests,
      extraBeds,
      specialRequests,
      contactName,
      contactPhone,
      checkInTime,
      checkOutTime,
      status: "Pending",
    });

    res.status(201).json(request);
  }
);

/**
 * @desc    Get all room requests (Admin)
 * @route   GET /api/room-requests
 * @access  Private/Admin
 */
export const getAllRoomRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const requests = await RoomRequest.find({})
      .populate("user", "name email")
      .populate("room", "name")
      .sort({ createdAt: -1 });

    res.json(requests);
  }
);

/**
 * @desc    Get logged-in user's room requests
 * @route   GET /api/room-requests/my
 * @access  Private
 */
export const getMyRoomRequests = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const requests = await RoomRequest.find({ user: req.user._id })
      .populate("room", "name images")
      .sort({ createdAt: -1 });

    res.json(requests);
  }
);

/**
 * @desc    Update Room Request Status (Admin)
 * @route   PATCH /api/room-requests/:id/status
 * @access  Private/Admin
 */
export const updateRoomRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = (req as any).body;

    const request = await RoomRequest.findById((req as any).params.id);

    if (!request) {
      res.status(404);
      throw new Error("Room request not found");
    }

    request.status = status;
    const updatedRequest = await request.save();

    res.json(updatedRequest);
  }
);