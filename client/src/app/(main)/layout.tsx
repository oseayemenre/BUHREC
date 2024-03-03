import { type Metadata } from "next";
import { Roboto } from "next/font/google";
import React from "react";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <Toaster position="top-center" reverseOrder={false} />
      <body className={roboto.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
