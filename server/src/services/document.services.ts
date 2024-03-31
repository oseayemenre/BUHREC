import { Document, Program, Status, User } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const sendDocument = async (
  data: Omit<
    Document,
    "id" | "status" | "createdAt" | "updatedAt" | "reviewerId" | "dateAssigned"
  >
): Promise<Document> => {
  return await prisma.document.create({
    data: {
      name: data.name,
      documentUrl: data.documentUrl,
      userId: data.userId,
    },
  });
};

export const getAllDocuments = async (
  program: Program
): Promise<
  {
    document: Document[];
  }[]
> => {
  return await prisma.user.findMany({
    where: {
      role: "RESEARCHER",
      program,
    },

    select: {
      document: true,
    },
  });
};

export const findDocument = async ({
  userId,
}: {
  userId: string;
}): Promise<Document | null> => {
  return await prisma.document.findUnique({
    where: {
      userId,
    },
  });
};

export const getUserDocument = async (data: {
  id: string;
}): Promise<{ document: Document[] | null } | null> => {
  return await prisma.user.findUnique({
    where: {
      id: data.id,
    },

    select: {
      document: true,
    },
  });
};

export const reviewerGetUserDocument = async (data: {
  id: string;
}): Promise<Document | null> => {
  return await prisma.document.findUnique({
    where: {
      id: data.id,
    },
  });
};

export const approvedocument = async (id: string): Promise<Document> => {
  return await prisma.document.update({
    where: {
      id,
    },

    data: {
      status: Status.APPROVED,
    },
  });
};

export const findReviewer = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const addDocument = async (
  reviewerId: string,
  documentId: string
): Promise<Document> => {
  return await prisma.document.update({
    where: {
      id: documentId,
    },

    data: {
      reviewerId,
      dateAssigned: new Date(),
    },
  });
};

export const removeReviewer = async (id: string): Promise<Document> => {
  return await prisma.document.update({
    where: {
      id,
    },

    data: {
      reviewerId: null,
      dateAssigned: null,
    },
  });
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  return await prisma.document.findUnique({
    where: {
      id,
    },
  });
};
