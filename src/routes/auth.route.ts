import { Router } from "express";
import {
  createAccount,
  createNewAccessToken,
  deleteAccount,
  login,
  logout,
  updateUserPassword,
} from "../controllers/auth.controller";
import { validateSchema } from "../middleware/validateSchema.middleware";
import { registerSchema } from "../schema/register.schema";
import { loginSchema } from "../schema/login.schema";
import { privateRoute, publicRoute } from "../middleware/auth.middleware";

const router: Router = Router();

router.post(
  "/create-account",
  publicRoute,
  validateSchema(registerSchema),
  createAccount
);

router.post("/login", publicRoute, validateSchema(loginSchema), login);

router.get("/token", publicRoute, createNewAccessToken);

router.patch("/update-password", privateRoute, updateUserPassword);

router.delete("/delete-account", privateRoute, deleteAccount);

router.get("logout", privateRoute, logout);

export { router as authRoute };
