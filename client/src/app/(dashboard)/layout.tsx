import { type Metadata } from "next";
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
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </main>
  );
};

export default RootLayout;
