import { type Request } from "express";

export interface IUpdateUserRequest extends Request {
  user?: string;
  password: string;
}
