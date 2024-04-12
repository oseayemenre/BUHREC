import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </main>
  );
};

export default RootLayout;
