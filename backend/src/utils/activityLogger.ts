import ActivityLog from '../models/ActivityLog';
import { Request } from 'express';

export const logActivity = async (params: {
  action: string;
  entityType: string;
  entityId: any;
  performedBy?: any;
  details?: any;
  req?: Request;
}) => {
  try {
    await ActivityLog.create({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      performedBy: params.performedBy,
      details: params.details,
      ipAddress: params.req?.ip || (params.req?.headers['x-forwarded-for'] as string)
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging should never break the main flow
  }
};

// Action constants for consistency
export const ACTIONS = {
  BOOKING_CREATED: 'BOOKING_CREATED',
  BOOKING_APPROVED: 'BOOKING_APPROVED',
  BOOKING_REJECTED: 'BOOKING_REJECTED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  BOOKING_COMPLETED: 'BOOKING_COMPLETED',
  GUEST_CHECKIN: 'GUEST_CHECKIN',
  GUEST_CHECKOUT: 'GUEST_CHECKOUT',
  ROOM_UPDATED: 'ROOM_UPDATED',
  ROOM_STATUS_CHANGED: 'ROOM_STATUS_CHANGED',
  ROOM_TOGGLED: 'ROOM_TOGGLED',
  BANQUET_TOGGLED: 'BANQUET_TOGGLED',
  PAYMENT_UPDATED: 'PAYMENT_UPDATED',
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  OFFLINE_BOOKING_CREATED: 'OFFLINE_BOOKING_CREATED',
  OTP_SENT: 'OTP_SENT',
  OTP_VERIFIED: 'OTP_VERIFIED',
} as const;
