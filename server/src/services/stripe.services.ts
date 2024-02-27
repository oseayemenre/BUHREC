import { prisma } from "../utils/prisma";
import { type UserSubscription } from "@prisma/client";

export const findUserSubscription = async (userId: string) => {
  return await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
  });
};

export const createSubscription = async (
  userSubscription: Omit<UserSubscription, "id" | "createdAt" | "updatedAt">
) => {
  return await prisma.userSubscription.create({
    data: {
      userId: userSubscription.userId,
      stripeCustomerId: userSubscription.stripeCustomerId,
      stripePriceId: userSubscription.stripePriceId,
      stripeSubscriptionId: userSubscription.stripeSubscriptionId,
      stripeCurrentPeriodEnd: userSubscription.stripeCurrentPeriodEnd,
    },
  });
};

export const updateUserSubscription = async (
  userSubscription: Omit<
    UserSubscription,
    "id" | "userId" | "stripeCustomerId" | "createdAt" | "updatedAt"
  >
) => {
  return await prisma.userSubscription.update({
    where: {
      stripeSubscriptionId: userSubscription.stripeSubscriptionId as string,
    },

    data: {
      stripePriceId: userSubscription.stripePriceId,
      stripeCurrentPeriodEnd: userSubscription.stripeCurrentPeriodEnd,
    },
  });
};
