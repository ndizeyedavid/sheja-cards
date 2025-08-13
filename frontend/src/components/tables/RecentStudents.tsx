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
import { recentStudents } from "@/services/students.service";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { Skeleton } from "../ui/skeleton";
import { Istudent } from "@/types/student.types";

export function RecentStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      try {
        const recent: any = await recentStudents();
        setStudents(recent.items);
      } catch (err: any) {
        console.error("error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Students</h2>
        {!loading ? (
          <Badge variant="secondary">{students.length} students</Badge>
        ) : (
          <Skeleton className="w-16 h-7" />
        )}
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Date Of Birth</TableHead>
              <TableHead>Class</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading ? (
              students.length == 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-base font-semibold"
                  >
                    No Recent Student
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student: Istudent) => (
                  <TableRow key={student.registrationNumber + Math.random()}>
                    <TableCell>{student.registrationNumber}</TableCell>
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
                      </div>
                    </TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {student.expand.Class.name}{" "}
                      {student.expand.Class?.combination}
                    </TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <Loading category="recent" />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
