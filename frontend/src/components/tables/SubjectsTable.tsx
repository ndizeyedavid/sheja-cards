"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Subject } from "@/types/subjects.types";
import Loading from "./Loading";
import AddSubjectForm from "../forms/AddSubjectForm";
import { deleteSubject, fetchSubjects } from "@/services/subjects.service";
import { toast } from "sonner";
import UpdateSubjectForm from "../forms/UpdateSubjectForm";

export default function SubjectsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchSubjects().then((res) => {
      setSubjects(res as unknown as Subject[]);
      setIsLoading(false);
    });
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      subject.subjectName.toLowerCase().includes(searchTerm) ||
      (subject.subjectCode?.toLowerCase() || "").includes(searchTerm)
    );
  });

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      if (!confirm("Are you sure you want to delete this Subject?")) return;
      await deleteSubject(subjectId);
      setSubjects(subjects.filter((subject) => subject.id !== subjectId));
      toast.success("Subject deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete subject");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Subject List</CardTitle>
          <Badge variant="secondary">
            {!isLoading ? `${filteredSubjects.length} subjects` : "Loading..."}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="relative flex-1 w-full max-w-sm">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>

            <div className="flex items-center">
              <AddSubjectForm setSubjects={setSubjects} />
              <Button className="ml-4" onClick={() => window.print()}>
                <IconPrinter className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Assigned Teacher</TableHead>
                  <TableHead>Assigned Class</TableHead>
                  <TableHead>Subject Credit</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <Loading category="default" />
                ) : (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="uppercase">
                        {/* {console.log(subject.assignedTeacher)} */}

                        {subject.subjectCode}
                      </TableCell>
                      <TableCell className="capitalize">
                        {subject.subjectName}
                      </TableCell>
                      <TableCell className="capitalize">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-auto p-2 text-left font-normal hover:underline"
                            >
                              {
                                // @ts-ignore
                                subject.assignedTeacher?.name || "Unassigned"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            {
                              // @ts-ignore
                              subject.assignedTeacher ? (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage
                                        // @ts-ignore
                                        src={subject.assignedTeacher.avatar}
                                      />
                                      <AvatarFallback>
                                        {
                                          // @ts-ignore
                                          subject.assignedTeacher.name
                                            ?.split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                        }
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-semibold">
                                        {
                                          // @ts-ignore
                                          subject.assignedTeacher.name
                                        }
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {
                                          // @ts-ignore
                                          subject.assignedTeacher.role
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2 border-t pt-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Email
                                      </p>
                                      <p className="text-sm font-medium">
                                        {
                                          // @ts-ignore
                                          subject.assignedTeacher.email
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Phone
                                      </p>
                                      <p className="text-sm font-medium">
                                        {
                                          // @ts-ignore
                                          subject.assignedTeacher.phone
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Status
                                      </p>
                                      <Badge
                                        variant={
                                          // @ts-ignore
                                          subject.assignedTeacher.verified
                                            ? "default"
                                            : "destructive"
                                        }
                                      >
                                        {
                                          // @ts-ignore

                                          subject.assignedTeacher.verified
                                            ? "Verified"
                                            : "Not yet verified"
                                        }
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No teacher assigned
                                </p>
                              )
                            }
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="capitalize">
                        {subject.assignedClass?.map((singleClass, key) => (
                          <ul key={key} className="space-y-0 p-0 list">
                            <li className=" list-disc" key={key}>
                              {singleClass.name} {singleClass.combination}
                            </li>
                          </ul>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={"secondary"}>
                          {subject.subjectCredit ? subject.subjectCredit : "-"}
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
                            <UpdateSubjectForm
                              subjectData={subject}
                              setSubjects={setSubjects}
                            />
                            <DropdownMenuItem
                              onClick={() => handleDeleteSubject(subject.id)}
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
    </>
  );
}
