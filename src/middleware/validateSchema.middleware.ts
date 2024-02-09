import { type NextFunction, type Request, type Response } from "express";
import { type AnyZodObject } from "zod";
import { ErrorHandler } from "../utils/errorHandler";

export const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validate = schema.safeParse(req.body);

    if (!validate.success)
      throw new ErrorHandler("Data could not be validated", 400);

    return next();
  };
