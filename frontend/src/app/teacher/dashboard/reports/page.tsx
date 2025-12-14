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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pb";
import { toast } from "sonner";
import {
  IconChartBar,
  IconDownload,
  IconTrendingUp,
  IconUsers,
  IconAward,
} from "@tabler/icons-react";

interface ClassInfo {
  id: string;
  name: string;
}

interface ClassStats {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

export default function ReportsPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.record) {
          const classRecords = await pb.collection("subjects").getFullList({
            filter: `assignedTeacher = "${pb.authStore.record.id}"`,
            expand: "assignedClass",
          });

          const uniqueClasses: { [key: string]: ClassInfo } = {};
          classRecords.forEach((subject: any) => {
            if (subject.expand?.assignedClass) {
              const classData = subject.expand.assignedClass;
              if (!uniqueClasses[classData.id]) {
                uniqueClasses[classData.id] = {
                  id: classData.id,
                  name: classData.name,
                };
              }
            }
          });

          setClasses(Object.values(uniqueClasses));
        }
      } catch (error) {
        console.error("Error loading classes:", error);
        toast.error("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  const handleClassChange = async (classId: string) => {
    setSelectedClass(classId);
    setStats(null);

    try {
      // Fetch students in the class
      const students = await pb.collection("students").getFullList({
        filter: `Class = "${classId}"`,
      });

      if (students.length === 0) {
        toast.info("No students in this class");
        return;
      }

      // Calculate statistics
      let totalScore = 0;
      let highestScore = 0;
      let lowestScore = 100;
      let passCount = 0;

      for (const student of students) {
        const marks = await pb.collection("marks").getFullList({
          filter: `student = "${student.id}"`,
        });

        const studentTotal = marks.reduce(
          (sum, mark) => sum + mark.marksObtained,
          0
        );
        totalScore += studentTotal;
        highestScore = Math.max(highestScore, studentTotal);
        lowestScore = Math.min(lowestScore, studentTotal);

        if (studentTotal >= 40) passCount++;
      }

      setStats({
        totalStudents: students.length,
        averageScore: Math.round(totalScore / students.length),
        highestScore,
        lowestScore: lowestScore === 100 ? 0 : lowestScore,
        passRate: Math.round((passCount / students.length) * 100),
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
      toast.error("Failed to calculate statistics");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Class Reports</h1>
            <p className="text-muted-foreground">
              View detailed analytics and performance reports
            </p>
          </div>
          <Button className="gap-2">
            <IconDownload className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Class Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class to view reports" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <IconUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalStudents}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <IconTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    out of 200
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <IconAward className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Highest Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.highestScore}</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <IconChartBar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    Lowest Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.lowestScore}</div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <IconTrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    Pass Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.passRate}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconChartBar className="w-5 h-5" />
                    Performance Distribution
                  </CardTitle>
                  <CardDescription>
                    Score distribution across the class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Excellent (80-100)
                        </span>
                        <span className="text-sm font-semibold">35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "35%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Good (60-79)
                        </span>
                        <span className="text-sm font-semibold">45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Average (40-59)
                        </span>
                        <span className="text-sm font-semibold">15%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "15%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Below Average (&lt;40)
                        </span>
                        <span className="text-sm font-semibold">5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: "5%" }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTrendingUp className="w-5 h-5" />
                    Key Insights
                  </CardTitle>
                  <CardDescription>
                    Important observations about class performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                        ✓ Strong Performance
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        80% of students scored above 60, indicating strong class
                        performance
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                        ℹ Average Improvement
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Average score improved by 12% compared to last term
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                        ⚠ Attention Needed
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        5 students need additional support to improve their
                        scores
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!selectedClass && (
          <Card>
            <CardContent className="py-12 text-center">
              <IconChartBar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Select a class to view reports
              </h3>
              <p className="text-muted-foreground">
                Choose a class from the dropdown above to see detailed analytics
                and performance reports
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
