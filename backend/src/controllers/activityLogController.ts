import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ActivityLog from '../models/ActivityLog';

// @desc    Get activity logs (with filters)
// @route   GET /api/activity-logs
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
  const { action, entityType, performedBy, limit: limitStr, page: pageStr } = req.query;
  
  const limit = parseInt(limitStr as string) || 50;
  const page = parseInt(pageStr as string) || 1;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (action) filter.action = action;
  if (entityType) filter.entityType = entityType;
  if (performedBy) filter.performedBy = performedBy;

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments(filter),
  ]);

  res.json({
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get activity logs for a specific entity
// @route   GET /api/activity-logs/entity/:type/:id
// @access  Private/Admin
export const getEntityLogs = asyncHandler(async (req: Request, res: Response) => {
  const { type, id } = req.params;

  const logs = await ActivityLog.find({ entityType: type, entityId: id })
    .populate('performedBy', 'name email role')
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(logs);
});
