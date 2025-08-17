"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  Building2,
  Users2,
  UserSquare2,
  ArrowDownRight,
} from "lucide-react";
import RenderGreeting from "./RenderGreeting";
import { getAnalytics } from "@/services/analytics.service";
import { Skeleton } from "./ui/skeleton";

interface Ianalytics {
  students: number;
  staff: number;
  classes: number;
  deletedStudents: number;
  deletedClasses: number;
}

export const SectionCards: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<Ianalytics>({
    students: 0,
    deletedStudents: 0,
    staff: 0,
    classes: 0,
    deletedClasses: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const {
          studentCount,
          staffCount,
          classCount,
          deletedClasses,
          deletedStudents,
        } = await getAnalytics();
        setAnalytics({
          students: studentCount.length,
          staff: staffCount.length,
          classes: classCount.length,
          deletedStudents: deletedStudents.length,
          deletedClasses: deletedClasses.length,
        });
      } catch (error: any) {
        console.error("Failed to fetch analytics:", error.response);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderStat = (
    label: string,
    value: number | string,
    icon: React.JSX.Element,
    decrease?: number
  ) => (
    <Card key={Math.random()}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">
              {typeof value === "number"
                ? Number(value).toLocaleString()
                : value}
            </p>
            {decrease && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <ArrowDownRight className="w-3 h-3" />
                <span>{decrease} deleted</span>
              </div>
            )}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-background px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col mb-3 sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <RenderGreeting />
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your school's analytics
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[150px] w-full p-6 rounded" />
                ))
            : [
                renderStat(
                  "Total Students",
                  analytics.students,
                  <Users2 className="w-8 h-8 text-green-600" />,
                  analytics.deletedStudents
                ),
                renderStat(
                  "Classes",
                  analytics.classes,
                  <Building2 className="w-8 h-8 text-blue-600" />,
                  analytics.deletedClasses
                ),
                renderStat(
                  "Staff Members",
                  analytics.staff,
                  <UserSquare2 className="w-8 h-8 text-orange-600" />
                ),
                renderStat(
                  "Current Academic Year",
                  "2024 / 2025",
                  <Calendar className="w-8 h-8 text-purple-600" />
                ),
              ]}
        </div>
      </div>
    </section>
  );
};
