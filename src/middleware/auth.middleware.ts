import { type NextFunction, type Response, type Request } from "express";
import { type IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import { ErrorHandler } from "../utils/errorHandler";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ACCESS_SECRET } from "../secret";

export const privateRoute = (
  req: IRequestMiddleWare,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.access_token;

  if (!token) throw new ErrorHandler("Token not found", 404);

  const decode = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  if (!decode)
    throw new ErrorHandler("Token could not be verified as a valid token", 401);

  req.user = decode.id;

  return next();
};

export const publicRoute = (
  req: IRequestMiddleWare,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.access_token;
  if (token) throw new ErrorHandler("User already logged in", 400);
  return next();
};
