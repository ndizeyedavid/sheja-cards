"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// You can replace this with your actual data fetching
const students = [
  {
    id: 1,
    name: "Sofia Davis",
    email: "sofia.davis@example.com",
    avatar: "/avatars/01.png",
    course: "Web Development",
    joinedOn: "2024-02-15",
    status: "active",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@example.com",
    avatar: "/avatars/02.png",
    course: "Data Science",
    joinedOn: "2024-02-14",
    status: "pending",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "/avatars/03.png",
    course: "UI/UX Design",
    joinedOn: "2024-02-13",
    status: "active",
  },
  {
    id: 4,
    name: "Lucas Martin",
    email: "lucas.martin@example.com",
    avatar: "/avatars/04.png",
    course: "Mobile Development",
    joinedOn: "2024-02-12",
    status: "inactive",
  },
];

export function RecentStudents() {
  return (
    <div className="space-y-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Students</h2>
        <Badge variant="secondary">{students.length} students</Badge>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{student.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {student.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  {new Date(student.joinedOn).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      student.status === "active"
                        ? "default"
                        : student.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {student.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
