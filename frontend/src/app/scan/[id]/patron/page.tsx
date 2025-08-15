"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import pb from "@/lib/pb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Student = {
  id: string;
  name: string;
  status: string;
  registrationNumber: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  expand: {
    Class: {
      name: string;
      combination: string;
      academicYear: string;
    };
    school: School;
  };
};

type School = {
  id: string;
  name: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
};

type DisciplineMark = {
  id: string;
  term: number;
  marks: number;
  student: string;
  academicYear: string;
  created: string;
};

type Permission = {
  id: string;
  reason: string;
  timeOut: string;
  timeIn: string;
  student: string;
  academicYear: string;
  created: string;
};

export default function PatronPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disciplineMarks, setDisciplineMarks] = useState<DisciplineMark[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const router = useRouter();
  // Form states
  const [newMark, setNewMark] = useState({
    term: 1,
    marks: 0,
  });
  const [newPermission, setNewPermission] = useState({
    reason: "",
    timeOut: "",
    timeIn: "",
  });

  useEffect(() => {
    async function fetchDetails() {
      try {
        const studentRecord = await pb
          .collection("students")
          .getOne(id as string, {
            expand: "Class, school",
          });
        setStudent(studentRecord as Student);

        // Fetch discipline marks
        const marks = await pb.collection("discipline_marks").getFullList({
          filter: `student = "${id}" && academicYear = "${studentRecord.expand.Class.academicYear}"`,
          sort: "-created",
        });
        setDisciplineMarks(marks);

        // Fetch permissions
        const perms = await pb.collection("permissions").getFullList({
          filter: `student = "${id}" && academicYear = "${studentRecord.expand.Class.academicYear}"`,
          sort: "-created",
        });
        setPermissions(perms);
      } catch (err: any) {
        console.error("ERROR: ", err);
        setError(err.message || "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    }

    if (!pb.authStore.record) return router.replace(`/scan/${id}`);
    fetchDetails();
  }, [id]);
  const handleMarkSubmit = async () => {
    try {
      if (!student) return;
      await pb.collection("discipline_marks").create({
        term: newMark.term,
        marks: newMark.marks,
        student: id,
        academicYear: student.expand.Class.academicYear,
      });
      toast.success("Discipline mark added successfully");
      // Refresh marks
      const marks = await pb.collection("discipline_marks").getFullList({
        filter: `student = "${id}" && academicYear = "${student.expand.Class.academicYear}"`,
        sort: "-created",
      });
      setDisciplineMarks(marks);
    } catch (err: any) {
      console.error("ERROR: ", err);
      toast.error(err.message || "Failed to add discipline mark");
    }
  };

  const handlePermissionSubmit = async () => {
    try {
      if (!student) return;
      await pb.collection("permissions").create({
        reason: newPermission.reason,
        timeOut: newPermission.timeOut,
        timeIn: newPermission.timeIn,
        student: id,
        academicYear: student.expand.Class.academicYear,
      });
      toast.success("Permission added successfully");
      // Refresh permissions
      const perms = await pb.collection("permissions").getFullList({
        filter: `student = "${id}" && academicYear = "${student.expand.Class.academicYear}"`,
        sort: "-created",
      });
      setPermissions(perms);
    } catch (err: any) {
      console.error("ERROR: ", err);
      toast.error(err.message || "Failed to add permission");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !student) {
    return <div>Error: {error || "Failed to load details"}</div>;
  }

  // mi🤗 auth logout logic, lame isn't it😂
  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    pb.authStore.clear();
    router.push(`/scan/${id}`);
  };

  return (
    <>
      <header
        id="no-print"
        className="flex h-(--header-height) py-4 mb-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
      >
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <div className="flex items-center gap-1">
            <IconInnerShadowTop className="-ml-1" />
            <span className=" font-bold">SHEJA Cards</span>
          </div>
          <Separator
            orientation="vertical"
            className="mx-7 data-[orientation=vertical]:h-4"
          />
          <div className="">
            {loading ? (
              <Skeleton className="w-[150px] h-8" />
            ) : (
              <span className="text-center font-medium">
                {student.expand.school.name}
              </span>
            )}
          </div>
          <div className="ml-14 flex items-center gap-2">
            <AcademicYearSelector disabled={true} />
          </div>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="mr-5">
          Logout
        </Button>
      </header>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Patron Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="size-[150px]">
                  <AvatarImage
                    src={pb.files.getURL(student, student.profileImage)}
                    alt={student.name}
                  />
                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{student.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {student.expand.Class.name}{" "}
                    {student.expand.Class.combination}
                  </p>
                </div>
              </div>
              <Separator orientation="horizontal" className="my-5" />
              <div className="mt-4 grid gap-2">
                <p>
                  <strong>Registration Number:</strong>{" "}
                  {student.registrationNumber}
                </p>
                <p>
                  <strong>Gender:</strong> {student.gender}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={student.status} />
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-5">
            {/* Discipline Marks Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Discipline Marks</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Mark</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Discipline Mark</DialogTitle>
                        <DialogDescription>
                          Add a new discipline mark for the current academic
                          year.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Term</Label>
                          <Select
                            value={newMark.term.toString()}
                            onValueChange={(value) =>
                              setNewMark({ ...newMark, term: parseInt(value) })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Term 1</SelectItem>
                              <SelectItem value="2">Term 2</SelectItem>
                              <SelectItem value="3">Term 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Marks (out of 40)</Label>
                          <Input
                            type="number"
                            max={40}
                            min={0}
                            value={newMark.marks}
                            onChange={(e) =>
                              setNewMark({
                                ...newMark,
                                marks: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleMarkSubmit}>Save Mark</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disciplineMarks.map((mark) => (
                      <TableRow key={mark.id}>
                        <TableCell>Term {mark.term}</TableCell>
                        <TableCell>{mark.marks}/40</TableCell>
                        <TableCell>
                          {new Date(mark.created).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {disciplineMarks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No discipline marks recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Permissions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Permissions</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Permission</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Permission</DialogTitle>
                        <DialogDescription>
                          Record a new permission for the student.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Reason</Label>
                          <Input
                            value={newPermission.reason}
                            onChange={(e) =>
                              setNewPermission({
                                ...newPermission,
                                reason: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Time Out</Label>
                          <Input
                            type="datetime-local"
                            value={newPermission.timeOut}
                            onChange={(e) =>
                              setNewPermission({
                                ...newPermission,
                                timeOut: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Time In</Label>
                          <Input
                            type="datetime-local"
                            value={newPermission.timeIn}
                            onChange={(e) =>
                              setNewPermission({
                                ...newPermission,
                                timeIn: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handlePermissionSubmit}>
                          Save Permission
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reason</TableHead>
                      <TableHead>Time Out</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>{permission.reason}</TableCell>
                        <TableCell>
                          {new Date(permission.timeOut).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(permission.timeIn).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {Math.round(
                            (new Date(permission.timeIn).getTime() -
                              new Date(permission.timeOut).getTime()) /
                              (1000 * 60)
                          )}{" "}
                          minutes
                        </TableCell>
                      </TableRow>
                    ))}
                    {permissions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No permissions recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
