import Stripe from "stripe";
import { STRIPE_API_KEY } from "../secret";

export const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});
