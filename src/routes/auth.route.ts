import { Router } from "express";
import {
  createAccount,
  createNewAccessToken,
  login,
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

export { router as authRoute };
