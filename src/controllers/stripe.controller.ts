import { URL, WEBHOOK_SECRET } from "../secret";
import { catchAsync } from "../utils/catchAsync";
import { stripe } from "../utils/stripe";
import { type Response } from "express";
import { IRequestMiddleWare } from "../interfaces/requestMiddleWare.interface";
import Stripe from "stripe";
import { findUserSubscription } from "../services/stripe.services";
import { ErrorHandler } from "../utils/errorHandler";
import { prisma } from "../utils/prisma";
import { IResponse } from "../interfaces/indexResponse.interface";

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
      success_url: URL,
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
    const signature = req.headers.get("Stripe-Signature") as string;
    const body = await req.text();

    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.userId)
        throw new ErrorHandler("User id is required", 401);

      await prisma.userSubscription.create({
        data: {
          userId: session.metadata.userId,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeSubscriptionId: subscription.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Subscription succesfully created",
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await prisma.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },

        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Subscription succesfully updated",
      });
    }
  }
);
