import { Document, Program, Status, User } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const sendDocument = async (
  data: Omit<Document, "id" | "status" | "createdAt" | "updatedAt">
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

// export const addDocument = async(reviewerId:string, documentId: string): Promise<User> => {

//   // const document = await prisma.document.findMany({
//   //   where: {
//   //     id: documentId
//   //   }
//   // })

//   // return await prisma.user.update({
//   //   where: {
//   //     id: reviewerId
//   //   },

//   //   data: {
//   //     document: {

//   //     }
//   //   }
//   // })
// }
