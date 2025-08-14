"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  IconActivity,
  IconUserCircle,
  IconUsers,
  IconSchool,
  IconSettings,
  IconFileText,
  IconTrash,
  IconRefresh,
  IconFilter,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchLogs } from "@/services/logs.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Action type icons mapping
const actionIcons: { [key: string]: any } = {
  USER_LOGIN: IconUserCircle,
  USER_LOGOUT: IconUserCircle,
  STAFF_CREATED: IconUsers,
  STAFF_UPDATED: IconUsers,
  STAFF_DELETED: IconUsers,
  STUDENT_CREATED: IconUsers,
  STUDENT_UPDATED: IconUsers,
  STUDENT_DELETED: IconUsers,
  CLASS_CREATED: IconSchool,
  CLASS_UPDATED: IconSchool,
  CLASS_DELETED: IconSchool,
  SCHOOL_CREATED: IconSchool,
  SCHOOL_UPDATED: IconSettings,
  SCHOOL_LOGO_UPDATED: IconSettings,
  SCHOOL_COLORS_UPDATED: IconSettings,
  PROFILE_UPDATED: IconUserCircle,
  PASSWORD_CHANGED: IconUserCircle,
  AVATAR_UPDATED: IconUserCircle,
  default: IconActivity,
};

// Action type colors mapping
const actionColors: { [key: string]: string } = {
  USER_LOGIN: "text-green-600",
  USER_LOGOUT: "text-blue-600",
  STAFF_CREATED: "text-emerald-600",
  STAFF_UPDATED: "text-amber-600",
  STAFF_DELETED: "text-red-600",
  STUDENT_CREATED: "text-emerald-600",
  STUDENT_UPDATED: "text-amber-600",
  STUDENT_DELETED: "text-red-600",
  CLASS_CREATED: "text-emerald-600",
  CLASS_UPDATED: "text-amber-600",
  CLASS_DELETED: "text-red-600",
  SCHOOL_CREATED: "text-emerald-600",
  SCHOOL_UPDATED: "text-amber-600",
  SCHOOL_LOGO_UPDATED: "text-amber-600",
  SCHOOL_COLORS_UPDATED: "text-amber-600",
  PROFILE_UPDATED: "text-amber-600",
  PASSWORD_CHANGED: "text-amber-600",
  AVATAR_UPDATED: "text-amber-600",
  default: "text-gray-600",
};

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const filters: any = {};

        if (activeTab !== "all") {
          filters.entityType = activeTab;
        }

        const response = await fetchLogs({
          ...filters,
          page: currentPage,
          limit: 50,
        });
        setLogs(response.items || []);
      } catch (error) {
        console.error("Error loading logs:", error);
        toast.error("Failed to load activity logs");
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [activeTab, currentPage]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  const getActionIcon = (action: string) => {
    return actionIcons[action] || actionIcons.default;
  };

  const getActionColor = (action: string) => {
    return actionColors[action] || actionColors.default;
  };

  const filteredLogs = logs.filter((log) => {
    if (activeTab === "all") return true;
    return log.entityType === activeTab;
  });

  const getEntityTypeCount = (entityType: string) => {
    return logs.filter((log) => log.entityType === entityType).length;
  };

  const getAllCount = () => {
    return logs.length;
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconActivity className="h-5 w-5" />
                Activity Logs
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconRefresh className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  All
                  <Badge variant="secondary" className="ml-2">
                    {getAllCount()}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  onClick={() => setActiveTab("staff")}
                >
                  Staff
                  <Badge variant="secondary" className="ml-2">
                    {getEntityTypeCount("staff")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  onClick={() => setActiveTab("student")}
                >
                  Students
                  <Badge variant="secondary" className="ml-2">
                    {getEntityTypeCount("student")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="class"
                  onClick={() => setActiveTab("class")}
                >
                  Classes
                  <Badge variant="secondary" className="ml-2">
                    {getEntityTypeCount("class")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="school"
                  onClick={() => setActiveTab("school")}
                >
                  School
                  <Badge variant="secondary" className="ml-2">
                    {getEntityTypeCount("school")}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading activity logs...</span>
                  </div>
                ) : (
                  <>
                    {filteredLogs.map((log) => {
                      const IconComponent = getActionIcon(log.action);
                      const actionColor = getActionColor(log.action);

                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <IconComponent
                            className={cn("h-5 w-5 mt-1", actionColor)}
                          />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">
                              {log.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Action: {log.action.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(log.timestamp)}
                            </p>
                            {log.expand?.userId && (
                              <p className="text-xs text-muted-foreground">
                                By: {log.expand.userId.name}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {filteredLogs.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <IconActivity className="h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">
                          No activity logs
                        </h3>
                        <p className="text-muted-foreground">
                          No activity has been recorded yet. Actions will appear
                          here as they occur.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
