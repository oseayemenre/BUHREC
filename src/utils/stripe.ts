import Stripe from "stripe";
import { STRIPE_API_KEY } from "../secret";

export const stripe = new Stripe(STRIPE_API_KEY, {
  typescript: true,
});
