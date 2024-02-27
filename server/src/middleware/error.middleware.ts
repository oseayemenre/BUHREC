import { type Request, type Response, type NextFunction } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import { type IErrorMiddleWare } from "../interfaces/error.interface";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import {
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const errorMiddleware = (
  error: ErrorHandler,
  req: Request,
  res: Response<IErrorMiddleWare>,
  next: NextFunction
) => {
  error.message = error.message || "Internal server error";
  error.status = error.status || 500;

  if (error instanceof JsonWebTokenError) {
    throw new ErrorHandler("Token could not be validated", 401);
  }

  if (error instanceof TokenExpiredError) {
    throw new ErrorHandler("Token is expired", 401);
  }

  if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientValidationError
  ) {
    throw new ErrorHandler(error.message, 400);
  }

  res.status(error.status).json({
    status: "failed",
    message: error.message,
    stackTrace: process.env.NODE_ENV === "production" ? null : error.stack,
  });

  return next();
};
