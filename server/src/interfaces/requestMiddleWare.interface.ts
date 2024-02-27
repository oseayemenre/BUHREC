import { type Request } from "express";

export interface IRequestMiddleWare extends Request {
  user?: string;
}
