"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SubjectInfo, ClassInfo } from "@/services/teacher.service";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface SubjectDetailsModalProps {
  subject: SubjectInfo | null;
  classData: ClassInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SubjectStats {
  totalStudents: number;
  averageMarks: number;
}

export function SubjectDetailsModal({
  subject,
  classData,
  isOpen,
  onClose,
}: SubjectDetailsModalProps) {
  const [stats, setStats] = useState<SubjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && subject) {
      loadSubjectStats();
    }
  }, [isOpen, subject]);

  const loadSubjectStats = async () => {
    if (!subject) return;

    setIsLoading(true);
    try {
      // Import pb here to avoid circular dependencies
      const { default: pb } = await import("@/lib/pb");

      // Fetch students in the class
      const students = await pb.collection("students").getFullList({
        filter: `Class = "${subject.assignedClass}"`,
      });

      // Fetch marks for this subject
      const marks = await pb.collection("marks").getFullList({
        filter: `subject = "${subject.id}"`,
      });

      // Calculate average marks
      const totalMarks = marks.reduce(
        (sum: number, mark: any) => sum + mark.marksObtained,
        0
      );
      const averageMarks = marks.length > 0 ? totalMarks / marks.length : 0;

      setStats({
        totalStudents: students.length,
        averageMarks: Math.round(averageMarks * 100) / 100,
      });
    } catch (error) {
      console.error("Error loading subject stats:", error);
      toast.error("Failed to load subject details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subject Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject Info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Subject Name
              </label>
              <p className="text-sm font-medium">{subject.subjectName}</p>
            </div>

            {classData && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Class
                </label>
                <Badge variant="outline">{classData.name}</Badge>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Subject ID
              </label>
              <p className="text-xs font-mono text-muted-foreground">
                {subject.id}
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
                  <p className="text-xs text-muted-foreground">
                    Avg Marks recored
                  </p>
                  <p className="text-2xl font-bold">{stats.averageMarks}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
