import { Comment } from "@prisma/client";

export interface IGetComment {
  status: "success";
  comments: Comment[];
}

export interface ICommentParams {
  id: string;
}
