import { type Metadata } from "next";
import React from "react";
import "@/app/globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "BUHREC",
  description: "BUHREC",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

export default RootLayout;
