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
    IconUserPlus,
    IconUpload,
    IconPrinter,
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
import { AddStudentModal } from "../students/AddStudentModal";
import { UpdateStudentModal } from "../students/UpdateStudentModal";
import { ViewStudentModal } from "../students/ViewStudentModal";
import { deleteStudent } from "@/services/students.service";

interface StudentsTableProps {
    students: Students[];
    isFiltered: boolean;
    selectedClass: string;
    isLoading: boolean;
    setStudents: any;
}

export default function StudentsTable({
    students,
    isFiltered,
    selectedClass,
    isLoading,
    setStudents,
}: StudentsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = isFiltered
        ? students.filter(
              (student) =>
                  student.class === selectedClass &&
                  (searchQuery === "" ||
                      student.name.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : [];

    const handleViewStudent = (studentId: string) => {
        console.log("View student:", studentId);
    };

    const handleEditStudent = (studentId: string) => {
        console.log("Edit student:", studentId);
    };

    const handleAddStudent = (newStudent: any) => {
        setStudents([...students, newStudent]);
    };

    const handleUpdateStudent = (updatedStudent: any) => {
        setStudents(
            students.map((student) =>
                student.id === updatedStudent.id ? updatedStudent : student
            )
        );
    };

    const handleDeleteStudent = async (studentId: string) => {
        try {
            await deleteStudent(studentId);
            setStudents(students.filter((student) => student.id !== studentId));
            toast.success("Student deleted successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete student");
        }
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
                            Student List - {selectedClass}
                        </CardTitle>
                        <Badge variant="secondary">
                            {!isLoading
                                ? `${filteredStudents.length} students`
                                : "Loading..."}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="relative flex-1 w-full max-w-sm">
                                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-full"
                                />
                            </div>

                            <div className="flex items-center">
                                <Button variant="outline" className="ml-4">
                                    <IconUpload className="mr-2 h-4 w-4" />
                                    Bulk add
                                </Button>
                                <AddStudentModal
                                    onAddStudent={handleAddStudent}
                                    selectedClass={selectedClass}
                                />
                                <Button className="ml-4">
                                    <IconPrinter className="size-4" />
                                </Button>
                            </div>
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
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[80px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        // Loading skeletons
                                        <Loading category="default" />
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    {student.registrationNumber}
                                                </TableCell>
                                                <TableCell className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={student.avatar}
                                                            alt={student.name}
                                                        />
                                                        <AvatarFallback>
                                                            {student.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {student.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.gender}</TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        student.dateOfBirth
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>{student.class}</TableCell>

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
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <ViewStudentModal
                                                                student={student}
                                                            />
                                                            <UpdateStudentModal
                                                                student={student}
                                                                onUpdateStudent={
                                                                    handleUpdateStudent
                                                                }
                                                            />
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDeleteStudent(
                                                                        student.id
                                                                    )
                                                                }
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
