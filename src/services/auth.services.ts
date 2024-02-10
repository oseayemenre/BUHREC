import { type TRegisterSchema } from "../schema/register.schema";
import { prisma } from "../utils/prisma";

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: TRegisterSchema) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUserPass = async (
  oldPassword: string,
  newPassword: string
) => {
  return await prisma.user.update({
    where: {
      password: oldPassword,
    },

    data: {
      password: newPassword,
    },
  });
};
