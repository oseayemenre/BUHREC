import { Router } from "express";
import {
  createAccount,
  createNewAccessToken,
  deleteAccount,
  deleteReviewerAccount,
  getAllResearchers,
  getAllSubAdmins,
  login,
  logout,
  updateProfilePicture,
  updateUserPassword,
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

router.post("/login", publicRoute, validateSchema(loginSchema), login);

router.get("/sub-admins", privateRoute, userRole(Role.ADMIN), getAllSubAdmins);

router.get(
  "/researchers/:program",
  privateRoute,
  userRole(Role.REVIEWER),
  getAllResearchers
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

router.get("/logout", privateRoute, logout);

export { router as authRoute };
