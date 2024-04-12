import { URL, WEBHOOK_SECRET } from "../secret";
import { catchAsync } from "../utils/catchAsync";
import { stripe } from "../utils/stripe";
import { Request, type Response } from "express";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import Stripe from "stripe";
import {
  createSubscription,
  findUserSubscription,
  updateUserSubscription,
  findUserPayment,
} from "../services/stripe.services";
import { ErrorHandler } from "../utils/errorHandler";
import { IResponse } from "../interfaces/response.interface";
import { findUserById } from "../services/auth.services";
import { sendPaymentVerifiedMail } from "../utils/sendMail";

export const createSession = catchAsync(
  async (req: IRequestMiddleWare, res: Response) => {
    const user = await findUserSubscription(req.user as string);

    if (user && user.stripeCustomerId) {
      const billingPortal = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: URL,
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
      success_url: "http://localhost:3000/dashboard",
      cancel_url: URL,
      billing_address_collection: "auto",
      metadata: {
        userId: req.user as string,
      },
    });

    return res.status(200).json({ url: session.url });
  }
);

export const webhook = catchAsync(
  async (req: Request, res: Response<IResponse>) => {
    const signature = req.headers["stripe-signature"] as string;
    const body = req.body;

    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.userId)
        throw new ErrorHandler("User id is required", 401);

      await createSubscription({
        userId: session.metadata.userId,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionId: subscription.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      });

      const user = await findUserById(session.metadata.userId);

      await sendPaymentVerifiedMail({ email: user?.email as string });

      return res.status(201).json({
        status: "success",
        message: "Subscription succesfully created",
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await updateUserSubscription({
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      });

      return res.status(200).json({
        status: "success",
        message: "Subscription succesfully updated",
      });
    }
  }
);

export const getPayment = catchAsync(
  async (req: IRequestMiddleWare, res: Response) => {
    const payment = await findUserPayment(req.user as string);

    res.status(200).json({
      payment,
    });
  }
);
