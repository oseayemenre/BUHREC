import { NextFunction, Response } from "express";
import { findUserById } from "../services/auth.services";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import { ErrorHandler } from "../utils/errorHandler";

export const userRole =
  (userRole: string | string[]) =>
  async (req: IRequestMiddleWare, res: Response, next: NextFunction) => {
    const role = await findUserById(req.user as string);

    if (typeof userRole === "string" && role?.role === userRole) return next();

    if (
      typeof userRole === "object" &&
      userRole.indexOf(role?.role as string) >= 0
    )
      return next();

    return next(
      new ErrorHandler(
        `${role?.lastname} ${role?.firstname} doesn't have access to this route`,
        404
      )
    );
  };
