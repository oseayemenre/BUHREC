import { type Comment, type User } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const createComment = async (
  comment: Omit<Comment, "id" | "createdAt" | "updatedAt">
) => {
  return await prisma.comment.create({
    data: {
      userId: comment.userId,
      message: comment.message,
      documentId: comment.documentId,
    },
  });
};

export const getComment = async (user: { id: string; documentId: string }) => {
  return await prisma.comment.findMany({
    where: {
      userId: user.id,
      documentId: user.documentId,
    },
  });
};

export const findCommentById = async (
  comment: Omit<
    Comment,
    "userId" | "message" | "documentId" | "createdAt" | "updatedAt"
  >
) => {
  return await prisma.comment.findUnique({
    where: {
      id: comment.id,
    },
  });
};

export const updateUserComment = async (
  comment: Omit<Comment, "userId" | "documentId" | "createdAt" | "updatedAt">
) => {
  return await prisma.comment.update({
    where: {
      id: comment.id,
    },

    data: {
      message: comment.message,
    },
  });
};

export const deleteUserComment = async (
  comment: Omit<
    Comment,
    "userId" | "documentId" | "createdAt" | "updatedAt" | "message"
  >
) => {
  return await prisma.comment.delete({
    where: {
      id: comment.id,
    },
  });
};
