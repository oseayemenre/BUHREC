import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

export const nunito_sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={nunito_sans.className}>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </main>
  );
};

export default RootLayout;
