"use client";

import { useEffect, useState } from "react";
import { fetchLogs } from "@/services/logs.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLogs, IconFilter, IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogEntry {
  id: string;
  action: string;
  description: string;
  entityType: string;
  entityId?: string;
  userId: string;
  schoolId: string;
  metadata?: any;
  timestamp: string;
  expand?: {
    userId: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const ACTION_COLORS: { [key: string]: string } = {
  MARK_CREATED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  MARK_UPDATED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  MARK_DELETED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  STUDENT_CREATED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  STUDENT_UPDATED:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  STUDENT_DELETED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterEntity, setFilterEntity] = useState<string>("marks");

  useEffect(() => {
    loadLogs();
  }, [filterAction, filterEntity]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetchLogs({
        action: filterAction || undefined,
        entityType: filterEntity || undefined,
        limit: 100,
        page: 1,
      });

      const logItems = (response.items || []).map((log: any) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        entityType: log.entityType,
        entityId: log.entityId,
        userId: log.userId,
        schoolId: log.schoolId,
        metadata: log.metadata,
        timestamp: log.timestamp,
        expand: log.expand,
      }));

      setLogs(logItems);
    } catch (error) {
      console.error("Error loading logs:", error);
      toast.error("Failed to load logs");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    return (
      ACTION_COLORS[action] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <IconLogs className="w-8 h-8" />
          Activity Logs
        </h1>
        <p className="text-muted-foreground">
          View all activities and changes made in the system
        </p>
      </div>

      {/* Filters */}
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Filter by Action
              </label>
              <Select
                value={filterAction || "all"}
                onValueChange={(value) =>
                  setFilterAction(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="MARK_CREATED">Mark Created</SelectItem>
                  <SelectItem value="MARK_UPDATED">Mark Updated</SelectItem>
                  <SelectItem value="MARK_DELETED">Mark Deleted</SelectItem>
                  <SelectItem value="STUDENT_CREATED">
                    Student Created
                  </SelectItem>
                  <SelectItem value="STUDENT_UPDATED">
                    Student Updated
                  </SelectItem>
                  <SelectItem value="STUDENT_DELETED">
                    Student Deleted
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Filter by Entity Type
              </label>
              <Select
                value={filterEntity || "all"}
                onValueChange={(value) =>
                  setFilterEntity(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  <SelectItem value="marks">Marks</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="class">Classes</SelectItem>
                  <SelectItem value="subject">Subjects</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              
            </div>
          </div>
        </CardContent>
      </Card> */}
      <div className="flex items-end justify-end mb-5">
        <Button onClick={loadLogs} className="w-fit gap-2" variant="outline">
          <IconRefresh className="w-4 h-4" />
          Refresh
        </Button>
      </div>
      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>{logs.length} log entries found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm truncate">{log.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.entityType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setDetailsOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <IconLogs className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No logs found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Action
                  </label>
                  <Badge
                    className={`mt-1 ${getActionColor(selectedLog.action)}`}
                  >
                    {selectedLog.action}
                  </Badge>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Entity Type
                  </label>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {selectedLog.entityType}
                  </Badge>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Timestamp
                  </label>
                  <p className="text-sm mt-1">
                    {formatDate(selectedLog.timestamp)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Entity ID
                  </label>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {selectedLog.entityId || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Description
                </label>
                <p className="text-sm mt-2 p-3 bg-muted rounded-lg">
                  {selectedLog.description}
                </p>
              </div>

              {selectedLog.metadata && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Metadata
                  </label>
                  <pre className="text-xs mt-2 p-3 bg-muted rounded-lg overflow-auto max-h-64">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
