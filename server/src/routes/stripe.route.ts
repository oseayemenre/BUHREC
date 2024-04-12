import { Router } from "express";
import {
  createSession,
  getPayment,
  webhook,
} from "../controllers/stripe.controller";
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

router.get("/", privateRoute, getPayment);

export { router as stripeRoute };
