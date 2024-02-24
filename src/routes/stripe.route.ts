import { Router } from "express";
import { createSession, webhook } from "../controllers/stripe.controller";
import { privateRoute } from "../middleware/auth.middleware";
import { userRole } from "../middleware/role.middleware";

const router: Router = Router();

router.get(
  "/create-session",
  privateRoute,
  userRole("RESEARCHER"),
  createSession
);

router.post("/webhook", webhook);

export { router as stripeRoute };
