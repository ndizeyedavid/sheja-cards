"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ClassInfo } from "@/services/teacher.service";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ClassDetailsModalProps {
  classData: ClassInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ClassStats {
  totalStudents: number;
  totalSubjects: number;
}

export function ClassDetailsModal({
  classData,
  isOpen,
  onClose,
}: ClassDetailsModalProps) {
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && classData) {
      loadClassStats();
    }
  }, [isOpen, classData]);

  const loadClassStats = async () => {
    if (!classData) return;

    setIsLoading(true);
    try {
      // Import pb here to avoid circular dependencies
      const { default: pb } = await import("@/lib/pb");

      // Fetch students count
      const studentsCount = await pb.collection("students").getFullList({
        filter: `Class = "${classData.id}"`,
      });

      // Fetch subjects count
      const subjectsCount = await pb.collection("subjects").getFullList({
        filter: `assignedClass ~ "${classData.id}"`,
      });

      setStats({
        totalStudents: studentsCount.length,
        totalSubjects: subjectsCount.length,
      });
    } catch (error) {
      console.error("Error loading class stats:", error);
      toast.error("Failed to load class details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!classData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Class Name
              </label>
              <p className="text-sm font-medium">{classData.name}</p>
            </div>

            {classData.combination && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Combination
                </label>
                <p className="text-sm font-medium">{classData.combination}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Class ID
              </label>
              <p className="text-xs font-mono text-muted-foreground">
                {classData.id}
              </p>
            </div>

            {/* Stats */}
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Subjects</p>
                  <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
