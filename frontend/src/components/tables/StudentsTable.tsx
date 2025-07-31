import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBooks,
  IconUserCircle,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconSearch,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Students } from "@/types/student.types";
import Loading from "./Loading";

interface StudentsTableProps {
  students: Students[];
  isFiltered: boolean;
  selectedYear: string;
  selectedClass: string;
  isLoading: boolean;
}

export default function StudentsTable({
  students,
  isFiltered,
  selectedYear,
  selectedClass,
  isLoading,
}: StudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = isFiltered
    ? students.filter(
        (student) =>
          student.academicYear === selectedYear &&
          student.class === selectedClass &&
          (searchQuery === "" ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleViewStudent = (studentId: number) => {
    console.log("View student:", studentId);
  };

  const handleEditStudent = (studentId: number) => {
    console.log("Edit student:", studentId);
  };

  const handleDeleteStudent = (studentId: number) => {
    console.log("Delete student:", studentId);
  };

  return (
    <>
      {!isFiltered ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <IconBooks className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Select an academic year and class to view students
          </p>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Student List - {selectedClass} ({selectedYear})
            </CardTitle>
            <Badge variant="secondary">
              {!isLoading
                ? `${filteredStudents.length} students`
                : "Loading..."}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-4 w-full">
              <div className="relative flex-1 w-full max-w-sm">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeletons
                    <Loading />
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              <IconUserCircle className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <IconDotsVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewStudent(student.id)}
                              >
                                <IconEye className="mr-2 h-4 w-4" />
                                View Info
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditStudent(student.id)}
                              >
                                <IconEdit className="mr-2 h-4 w-4" />
                                Update
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
