import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { type IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import {
  createComment,
  deleteUserComment,
  findCommentById,
  getComment,
  updateUserComment,
} from "../services/comment.services";
import {
  type ICommentParams,
  type IGetComment,
} from "../interfaces/comment.interface";
import { type TCommentSchema } from "../schema/comment.schema";
import { type IResponse } from "../interfaces/response.interface";
import { ErrorHandler } from "../utils/errorHandler";

export const getUserComment = catchAsync(
  async (req: IRequestMiddleWare, res: Response<IGetComment | null>) => {
    const comments = await getComment({
      id: req.user as string,
    });

    res.json(comments);
  }
);

export const postComment = catchAsync(
  async (req: IRequestMiddleWare, res: Response<IResponse>) => {
    const body: TCommentSchema = req.body;
    const { message } = body;

    await createComment({ userId: req.user as string, message });

    return res.status(201).json({
      status: "success",
      message: "Comment succesfully created",
    });
  }
);

export const updateComment = catchAsync(
  async (req: Request<ICommentParams>, res: Response<IResponse>) => {
    const id = req.params.id;
    const comment = await findCommentById({ id });

    if (!comment) throw new ErrorHandler("Comment doesn't exist", 404);

    const body: TCommentSchema = req.body;
    const { message } = body;

    await updateUserComment({ id, message });

    return res.status(200).json({
      status: "success",
      message: "Comment succesfuly updated",
    });
  }
);

export const deleteComment = catchAsync(
  async (req: Request<ICommentParams>, res: Response) => {
    const id = req.params.id;
    const comment = await findCommentById({ id });

    if (!comment) throw new ErrorHandler("Comment doesn't exist", 404);

    await deleteUserComment({ id });

    return res.status(200).json({
      status: "success",
      message: "Comment deleted succesfully",
    });
  }
);
