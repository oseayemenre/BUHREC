import { URL } from "../secret";
import { catchAsync } from "../utils/catchAsync";
import { stripe } from "../utils/stripe";
import { type Request, type Response } from "express";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import { prisma } from "../utils/prisma";

export const checkOutSession = catchAsync(
  async (req: IRequestMiddleWare, res: Response) => {
    const user = await prisma.userSubscription.findUnique({
      where: {
        userId: req.user,
      },
    });

    if (user && user.stripeCustomerId) {
      const billingPortal = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${URL}`,
      });

      return res.json(200).json({
        url: billingPortal.url,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "NGN",
            product_data: {
              name: "BUHREC",
              description:
                "Upon the completion of the payment of subscription, an email will be sent to you, confirming your transaction. This payment is non-refundable upon completion. Thank you for using our services.",
            },
            unit_amount: 2000000,
            recurring: {
              interval: "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000/",
      billing_address_collection: "auto",
    });

    return res.status(200).json({ url: session.url });
  }
);
