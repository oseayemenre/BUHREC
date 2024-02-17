import { prisma } from "../utils/prisma";

export const findUserSubscription = async (userId: string) => {
  return await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
  });
};
