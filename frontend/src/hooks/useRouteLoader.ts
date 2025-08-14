"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export function useRouteLoader() {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // Next.js app router has no direct onRouteChangeStart/Complete,
    // so we just listen to popstate + custom events
    window.addEventListener("routeChangeStart", handleStart);
    window.addEventListener("routeChangeEnd", handleStop);

    return () => {
      window.removeEventListener("routeChangeStart", handleStart);
      window.removeEventListener("routeChangeEnd", handleStop);
    };
  }, [router]);

  return {
    triggerStart: () => window.dispatchEvent(new Event("routeChangeStart")),
    triggerEnd: () => window.dispatchEvent(new Event("routeChangeEnd")),
  };
}
