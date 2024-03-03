import { type Comment, type User } from "@prisma/client";
import { prisma } from "../utils/prisma";

// Reminder to add documentId later
export const createComment = async (
  comment: Omit<Comment, "id" | "documentId" | "createdAt" | "updatedAt">
) => {
  return await prisma.comment.create({
    data: {
      userId: comment.userId,
      message: comment.message,
    },
  });
};

export const getComment = async (
  user: Omit<
    User,
    | "firstname"
    | "lastname"
    | "username"
    | "email"
    | "password"
    | "role"
    | "level"
    | "program"
    | "createdAt"
    | "updatedAt"
  >
) => {
  return await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      comment: true,
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
