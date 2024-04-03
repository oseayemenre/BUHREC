import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import "@/app/globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

export const nunito_sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={nunito_sans.className}>
      <Navbar />
      {children}
    </main>
  );
};

export default RootLayout;
