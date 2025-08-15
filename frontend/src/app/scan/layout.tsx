"use client";
import { useEffect } from "react";
import pb from "@/lib/pb";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
// @ts-ignore
import NProgress from "nprogress";

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return (
    <>
      <Toaster richColors position="top-right" />

      {children}
    </>
  );
}
