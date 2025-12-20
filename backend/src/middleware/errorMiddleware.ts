
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = (res as any).statusCode === 200 ? 500 : (res as any).statusCode;
  
  (res as any).status(statusCode);
  (res as any).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
