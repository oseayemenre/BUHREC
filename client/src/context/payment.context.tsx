"use client";

import { IPayment } from "@/hooks/useWebhook";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IPaymentContext {
  payment: IPayment | null;
  setPayment: Dispatch<SetStateAction<IPayment | null>>;
}

type TChildren = React.ReactNode;

const paymentContext = createContext<IPaymentContext | null>(null);

export const usePayment = () => {
  const context = useContext(paymentContext);

  if (!context) throw new Error("Context can only be used in react components");

  return context;
};

const PaymentProvider = ({ children }: { children: TChildren }) => {
  const [payment, setPayment] = useState<IPayment | null>(null);
  return (
    <paymentContext.Provider value={{ payment, setPayment }}>
      {children}
    </paymentContext.Provider>
  );
};

export default PaymentProvider;
