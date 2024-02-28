import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import React from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className={poppins.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
