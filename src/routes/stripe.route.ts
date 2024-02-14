import { Router } from "express";
import { createSession } from "../controllers/stripe.controller";
import { privateRoute } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/create-session", privateRoute, createSession);

export { router as stripeRoute };
