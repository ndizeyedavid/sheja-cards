"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  Building2,
  Users2,
  UserSquare2,
} from "lucide-react";
import RenderGreeting from "./RenderGreeting";
import { useEffect, useState } from "react";
import { getAnalytics } from "@/services/analytics.service";
import { Skeleton } from "./ui/skeleton";

interface Ianalytics {
  students: number;
  staff: number;
  classes: number;
}

export const SectionCards: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<Ianalytics>({
    students: 0,
    staff: 0,
    classes: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const { studentCount, staffCount, classCount } = await getAnalytics();

        setAnalytics({
          students: studentCount.length,
          staff: staffCount.length,
          classes: classCount.length,
        });
      } catch (error: any) {
        console.error("Failed to fetch analytics:", error.response);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
              Monitor and manage your schools analytics
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            // Spinner or loading placeholder
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[150px] w-full p-6 rounded" />
              ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {Number(analytics.students).toLocaleString()}
                      </p>
                    </div>
                    <Users2 className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Classes
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {analytics.classes}
                      </p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Staff Members
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {analytics.staff}
                      </p>
                    </div>
                    <UserSquare2 className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Current Academic Year
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        2024 / 2025
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
