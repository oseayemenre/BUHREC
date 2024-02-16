import { Router } from "express";
import { createSession, webhook } from "../controllers/stripe.controller";
import { privateRoute } from "../middleware/auth.middleware";

const router: Router = Router();

router.use(privateRoute);

router.get("/create-session", createSession);

router.post("/webhook", webhook);

export { router as stripeRoute };
