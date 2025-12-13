"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pb";
import { Toaster } from "@/components/ui/sonner";
import {
  IconBell,
  IconHome,
  IconLogout,
  IconLogs,
  IconUser,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is a teacher
    if (!pb.authStore.isValid) {
      router.push("/teacher/auth/login");
      return;
    }

    // Verify user is a teacher
    const userRole = pb.authStore.record?.role;
    if (userRole !== "TEACHER") {
      pb.authStore.clear();
      router.push("/teacher/auth/login");
    }
  }, [router]);

  const handleLogout = async () => {
    pb.authStore.clear();
    toast.success("Logged out successfully");
    router.push("/teacher/auth/login");
  };

  return (
    <>
      <Toaster richColors position="top-left" />

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="bg-white dark:bg-slate-950 border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/teacher/dashboard"
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <IconHome className="w-6 h-6 text-primary" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Teacher Portal</h1>
                <p className="text-xs text-muted-foreground">SHEJA Cards</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push("/teacher/dashboard/logs")}
              >
                <IconLogs className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <IconLogout className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
