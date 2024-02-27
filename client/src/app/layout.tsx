import { type Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

export const inter = Inter({
  subsets: ["latin"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
