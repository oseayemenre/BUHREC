import { Router } from "express";
import { checkOutSession } from "../controllers/stripe.controller";

const router: Router = Router();

router.get("/checkout-session", checkOutSession);

export { router as stripeRoute };
