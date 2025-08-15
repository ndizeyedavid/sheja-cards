import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconEye } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "../tables/StatusBadge";
import pb from "@/lib/pb";

interface ViewStudentModalProps {
  student: any;
}

export function ViewStudentModal({ student }: ViewStudentModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-full flex items-center justify-start p-0 opacity-70"
        >
          <IconEye className="h-4 w-4" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={pb.files.getURL(student, student.profileImage)}
                alt={student.name}
              />
              <AvatarFallback>
                {student.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                {student.registrationNumber}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Gender</p>
              <p className="text-sm text-muted-foreground">{student.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date of Birth</p>
              <p className="text-sm text-muted-foreground">
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Class</p>
              <p className="text-sm text-muted-foreground">
                {student.expand.Class.name} {student.expand.Class.combination}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <StatusBadge status={student.status} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
