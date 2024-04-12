import { useState, useEffect } from "react";

export interface IPayment {
  payment: {
    id: string;
    userId: string;
    stripeCustomerId?: string;
    stripePriceId?: string;
    stripeSubscriptionId?: string;
    stripeCurrentPeriodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}
export const useWebhook = () => {
  const [webhook, setWebhook] = useState<IPayment>();

  useEffect(() => {
    const handleGetWebhook = async () => {
      const res = await fetch("http://localhost:8000/api/v1/stripe", {
        method: "GET",
        credentials: "include",
      });

      const data = (await res.json()) as IPayment;

      setWebhook(data);
    };

    handleGetWebhook();
  }, []);

  return { webhook };
};
