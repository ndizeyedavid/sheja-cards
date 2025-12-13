"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pb";
import { toast } from "sonner";
import {
  IconBook,
  IconUsers,
  IconClipboardList,
  IconCalendar,
  IconBell,
  IconLogout,
  IconChevronRight,
  IconGraduate,
  IconFileText,
  IconBarChart,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TeacherInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}

interface ClassInfo {
  id: string;
  name: string;
  combination?: string;
  studentCount?: number;
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get current teacher info
        if (pb.authStore.isValid && pb.authStore.record) {
          setTeacher({
            id: pb.authStore.record.id,
            name: pb.authStore.record.name,
            email: pb.authStore.record.email,
            role: pb.authStore.record.role,
            avatar: pb.authStore.record.avatar,
            phone: pb.authStore.record.phone,
          });

          // Fetch classes assigned to this teacher
          const classRecords = await pb.collection("subjects").getFullList({
            filter: `assignedTeacher = "${pb.authStore.record.id}"`,
            expand: "assignedClass",
          });

          // Extract unique classes
          const uniqueClasses: { [key: string]: ClassInfo } = {};
          classRecords.forEach((subject: any) => {
            if (subject.expand?.assignedClass) {
              const classData = subject.expand.assignedClass;
              if (!uniqueClasses[classData.id]) {
                uniqueClasses[classData.id] = {
                  id: classData.id,
                  name: classData.name,
                  combination: classData.combination,
                };
              }
            }
          });

          setClasses(Object.values(uniqueClasses));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    pb.authStore.clear();
    toast.success("Logged out successfully");
    router.push("/teacher/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-950 border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconGraduate className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Teacher Portal</h1>
              <p className="text-xs text-muted-foreground">SHEJA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <IconBell className="w-5 h-5" />
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {teacher?.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening in your classes today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <IconUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Total Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Classes assigned to you
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <IconClipboardList className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks to complete
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <IconFileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pending review
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <IconBarChart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                Avg. Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Class average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Classes Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBook className="w-5 h-5" />
                  Your Classes
                </CardTitle>
                <CardDescription>
                  Manage and view your assigned classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {classes.length > 0 ? (
                  <div className="space-y-3">
                    {classes.map((classItem) => (
                      <Link
                        key={classItem.id}
                        href={`/teacher/classes/${classItem.id}`}
                      >
                        <div className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {classItem.name}
                                {classItem.combination && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({classItem.combination})
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Manage students and marks
                              </p>
                            </div>
                            <IconChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IconBook className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No classes assigned yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCalendar className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex-col gap-2"
                  >
                    <IconFileText className="w-5 h-5" />
                    <span className="text-xs">Record Marks</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex-col gap-2"
                  >
                    <IconBarChart className="w-5 h-5" />
                    <span className="text-xs">View Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex-col gap-2"
                  >
                    <IconUsers className="w-5 h-5" />
                    <span className="text-xs">Manage Students</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex-col gap-2"
                  >
                    <IconClipboardList className="w-5 h-5" />
                    <span className="text-xs">Attendance</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {teacher?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{teacher?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {teacher?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Role</p>
                    <p className="font-medium capitalize">{teacher?.role}</p>
                  </div>
                  {teacher?.phone && (
                    <div>
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p className="font-medium">{teacher?.phone}</p>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Marks recorded</p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Class attendance updated</p>
                      <p className="text-xs text-muted-foreground">
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Report generated</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Check our documentation or contact support
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-xs">
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full text-xs">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
