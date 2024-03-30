import { Router } from "express";
import { privateRoute } from "../middleware/auth.middleware";
import { userRole } from "../middleware/role.middleware";
import {
  approveDocument,
  assignDocument,
  getDocument,
  getDocuments,
  unassignReviewer,
  uploadDocument,
} from "../controllers/document.controller";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/upload-document",
  privateRoute,
  userRole(Role.RESEARCHER),
  uploadDocument
);

router.get(
  "/program/:program",
  privateRoute,
  userRole(Role.SUB_ADMIN),
  getDocuments
);

router.get(
  "/single-document",
  privateRoute,
  userRole([Role.REVIEWER]),
  getDocument
);

router.patch(
  "/approve-document/:id",
  privateRoute,
  userRole(Role.REVIEWER),
  approveDocument
);

router.patch(
  "/assign-document/:documentId/:reviewerId",
  privateRoute,
  userRole(Role.SUB_ADMIN),
  assignDocument
);

router.delete(
  "/:documentId",
  privateRoute,
  userRole(Role.SUB_ADMIN),
  unassignReviewer
);

export { router as documentRoute };
