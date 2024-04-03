import { Router } from "express";
import {
  createAccount,
  createNewAccessToken,
  deleteAccount,
  deleteReviewerAccount,
  deleteSubAdminAccount,
  getAllReviewers,
  getAllSubAdmins,
  login,
  logout,
  updateProfilePicture,
  updateUserPassword,
  getProfile,
} from "../controllers/auth.controller";
import { validateSchema } from "../middleware/validateSchema.middleware";
import { registerSchema } from "../schema/register.schema";
import { loginSchema } from "../schema/login.schema";
import { privateRoute, publicRoute } from "../middleware/auth.middleware";
import { userRole } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

router.post(
  "/create-account",
  publicRoute,
  validateSchema(registerSchema),
  createAccount
);

router.get("/profile", privateRoute, getProfile);

router.post("/login", publicRoute, validateSchema(loginSchema), login);

router.get("/sub-admins", privateRoute, userRole(Role.ADMIN), getAllSubAdmins);

router.get(
  "/reviewers/:program",
  privateRoute,
  userRole(Role.SUB_ADMIN),
  getAllReviewers
);

router.get("/token", publicRoute, createNewAccessToken);

router.patch("/update-profile-picture", privateRoute, updateProfilePicture);

router.patch("/update-password", privateRoute, updateUserPassword);

router.delete("/delete-account", privateRoute, deleteAccount);

router.delete(
  "/delete-reviewer-account/:id",
  privateRoute,
  userRole(Role.SUB_ADMIN),
  deleteReviewerAccount
);

router.delete(
  "/delete-sub-admin/:id",
  privateRoute,
  userRole(Role.ADMIN),
  deleteSubAdminAccount
);

router.get("/logout", privateRoute, logout);

export { router as authRoute };
