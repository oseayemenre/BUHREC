import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";

export const getAllComment = catchAsync(
  async (req: IRequestMiddleWare, res: Response) => {
    res.send("comment router reached");
  }
);

export const postComment = catchAsync(
  async (req: Request, res: Response) => {}
);
