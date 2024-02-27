import { Comment } from "@prisma/client";

export interface IGetComment {
  comment: Comment[];
}

export interface ICommentParams {
  id: string;
}
