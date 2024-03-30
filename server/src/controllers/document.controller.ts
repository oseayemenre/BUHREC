import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { cloudinary } from "../utils/cloudinary";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import { ErrorHandler } from "../utils/errorHandler";
import { Document, Program } from "@prisma/client";
import {
  // addDocument,
  approvedocument,
  findDocument,
  findReviewer,
  getAllDocuments,
  getUserDocument,
  sendDocument,
} from "../services/document.services";

export const uploadDocument = catchAsync(
  async (
    req: IRequestMiddleWare,
    res: Response<{ status: string; document: Document }>
  ) => {
    const { document, name } = req.body as { document: string; name: string };

    if (!document.startsWith("data:application/pdf"))
      throw new ErrorHandler("This type of file cannot be validated", 400);

    const documentUrl = await cloudinary.uploader.upload(document, {
      resource_type: "raw",
      folder: "buhrec",
    });

    const checkdocument = await findDocument({ userId: req.user as string });

    if (checkdocument?.status === "PENDING")
      throw new ErrorHandler("A document has already been submitted", 409);

    const file = await sendDocument({
      name,
      documentUrl: documentUrl.secure_url,
      userId: req.user as string,
    });

    res.status(200).json({
      status: "success",
      document: file,
    });
  }
);

export const getDocuments = catchAsync(
  async (req: Request<{ program: Program }>, res: Response) => {
    const { program } = req.params;
    const documents = await getAllDocuments(program);

    res.status(200).json({
      status: "success",
      documents: documents,
    });
  }
);

export const getDocument = catchAsync(
  async (
    req: IRequestMiddleWare,
    res: Response<{ status: string; document: Document[] }>
  ) => {
    const id = req.user as string;
    const document = await getUserDocument({ id });

    res.status(200).json({
      status: "success",
      document: document?.document as Document[],
    });
  }
);

export const approveDocument = catchAsync(
  async (
    req: Request<{ id: string }>,
    res: Response<{ status: string; document: Document }>
  ) => {
    const { id } = req.params;

    const document = await approvedocument(id);
    res.status(200).json({
      status: "success",
      document,
    });
  }
);

export const assignDocument = catchAsync(
  async (
    req: Request<{ documentId: string; reviewerId: string }>,
    res: Response
  ) => {
    const { documentId, reviewerId } = req.params;

    const reviewer = await findReviewer(reviewerId);

    if (reviewer?.role !== "REVIEWER")
      throw new ErrorHandler(
        "This user role is not eligible for this task",
        400
      );

    // const document = addDocument(reviewerId, documentId);
  }
);

export const removeDocument = catchAsync(
  async (req: Request, res: Response) => {}
);
