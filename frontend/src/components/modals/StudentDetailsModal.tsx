"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StudentInfo } from "@/services/teacher.service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import pb from "@/lib/pb";

interface StudentDetailsModalProps {
  student: StudentInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentDetailsModal({
  student,
  isOpen,
  onClose,
}: StudentDetailsModalProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Avatar */}
          <div className="flex justify-center">
            <div className=" flex items-center justify-center">
              <Avatar className="size-[100px]">
                <AvatarImage
                  src={pb.files.getURL(
                    student.fullStack[0],
                    student.profileImage
                  )}
                  alt={student.name + "_photo"}
                />
                <AvatarFallback className="border-2">
                  {student.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 items-center">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Reg Number
                </label>
                <p className="text-sm font-medium">
                  {student.registrationNumber}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Name
                </label>
                <p className="text-sm font-medium">{student.name}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Gender
                </label>
                <p className="text-sm font-medium break-all">
                  {student.gender}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Status
                </label>
                <br />
                <Badge variant="outline">{student.status}</Badge>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Class
                </label>
                <p className="text-xs font-mono text-muted-foreground">
                  {student.fullStack[0].expand?.Class.name}{" "}
                  {student.fullStack[0].expand?.Class.combination}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
