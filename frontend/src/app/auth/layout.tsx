import { Toaster } from "@/components/ui/sonner";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Toaster richColors position="top-right" />
      {children}
    </>
  );
}
