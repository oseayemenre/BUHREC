import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import React from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

export const nunito_sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className={nunito_sans.className}>{children}</main>;
};

export default RootLayout;
