import { Program, User, UserSubscription } from "@prisma/client";
import { type TRegisterSchema } from "../schema/register.schema";
import { prisma } from "../utils/prisma";

export const findAllAdmins = async () => {
  return await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });
};

export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { username } });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: TRegisterSchema): Promise<User> => {
  return await prisma.user.create({
    data,
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const updateUserPass = async (
  oldPassword: string,
  newPassword: string
): Promise<User> => {
  return await prisma.user.update({
    where: {
      password: oldPassword,
    },

    data: {
      password: newPassword,
    },
  });
};

export const deleteReviewerOrSubAdmin = async (id: string): Promise<User> => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

export const updateAvatar = async ({
  id,
  avatar,
}: {
  id: string;
  avatar: string;
}): Promise<User> => {
  return await prisma.user.update({
    where: {
      id,
    },

    data: {
      avatar,
    },
  });
};

export const getSubAdmins = async (): Promise<User[]> => {
  return await prisma.user.findMany({
    where: {
      role: "SUB_ADMIN",
    },
  });
};

export const getAllReviewersByCourse = async (
  program: Program
): Promise<User[]> => {
  return await prisma.user.findMany({
    where: {
      role: "REVIEWER",
      program,
    },
  });
};
