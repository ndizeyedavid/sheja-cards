"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import pb from "@/lib/pb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { IconInnerShadowTop, IconLocation } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { schoolFeesService } from "@/services/schoolFees.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LocationEdit, MapPin } from "lucide-react";

type Student = {
  id: string;
  name: string;
  status: string;
  registrationNumber: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  school: string;
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

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feeStatus, setFeeStatus] = useState<
    { term: number; status: string; amount: number }[]
  >([]);
  const [feePayments, setFeePayments] = useState<any[]>([]);
  const [disciplineMarks, setDisciplineMarks] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [schoolStaff, setSchoolStaff] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const studentRecord: Student = await pb
          .collection("students")
          .getOne(id as string, {
            expand: "Class, school",
          });
        const fetchSchoolStaff = await pb.collection("staff").getFullList({
          filter: `school = "${studentRecord.school}"`,
        });
        console.log(fetchSchoolStaff);
        setSchoolStaff(fetchSchoolStaff);
        setStudent(studentRecord as Student);
        setSchool(studentRecord.expand.school as School);

        // Fetch fee status
        const status = await schoolFeesService.getStudentFeeStatus(
          id as string,
          studentRecord.expand.Class.academicYear
        );
        setFeeStatus(status);

        // Fetch fee payments
        const payments = await schoolFeesService.getStudentFees(
          id as string,
          studentRecord.expand.Class.academicYear
        );
        setFeePayments(payments);

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
        console.error("PB ERROR: ", err.response);
        setError(err.message || "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !student || !school) {
    return <div>Error: {error || "Failed to load details"}</div>;
  }

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
        {!pb.authStore.record ? (
          <Link href={"/scan/login?student=" + id}>
            <Button className="mr-5">Login</Button>
          </Link>
        ) : (
          <Link
            href={`/scan/${id}/${pb.authStore.record.role.toLowerCase()}`}
            className="flex items-center gap-2 hover:bg-gray-400/10 p-2 mr-4 rounded-lg cursor-default"
          >
            <div className="size-[45px] bg-gray-900/50 flex items-center justify-center rounded-full">
              <span className=" font-bold text-lg">
                {pb.authStore.record.role.split("")[0]}
              </span>
            </div>
            <div className="-space-y-1">
              <h3 className="opacity-90">
                {pb.authStore.record.name.split(" ")[1]} (
                <b>{pb.authStore.record.role}</b>)
              </h3>
              <h4 className="text-sm opacity-70">
                {pb.authStore.record.email}
              </h4>
            </div>
          </Link>
        )}
      </header>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Student Details</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="#" className="hover:underline">
              {student.expand.school.name}
            </Link>
            <span>/</span>
            <Link href="#" className="hover:underline">
              {student.expand.Class.name} {student.expand.Class.combination}
            </Link>
            <span>/</span>
            <Link href={`/scan/${student.id}`} className="hover:underline">
              {student.name}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Information */}
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
              <Separator orientation="horizontal" className="my-5" />
              {/* Discipline marks */}
              <div>
                <h3 className="font-semibold mb-2">Discipline Marks</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((term) => {
                    const termMark = disciplineMarks.find(
                      (mark) => mark.term === term
                    );
                    return (
                      <div
                        key={term}
                        className="text-center p-4 border rounded-lg"
                      >
                        <h4 className="font-medium mb-2">Term {term}</h4>
                        <p className="text-2xl font-bold text-primary">
                          {termMark ? termMark.marks : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Out of 40
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-5" />
              {/* school fees */}
              <div>
                <h3 className="font-semibold mb-2">School Fees Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  {feeStatus.map((term) => (
                    <Dialog key={term.term}>
                      <DialogTrigger asChild>
                        <div className="text-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <h4 className="font-medium mb-2">Term {term.term}</h4>
                          <p
                            className={`text-2xl font-bold ${
                              term.status === "paid"
                                ? "text-green-600"
                                : term.status === "partial"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {term.status.charAt(0).toUpperCase() +
                              term.status.slice(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {term.amount.toLocaleString()} RWF
                          </p>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Term {term.term} Payment History
                          </DialogTitle>
                          <DialogDescription>
                            Payment records for{" "}
                            {student?.expand.Class.academicYear}
                          </DialogDescription>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Receipt #</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {feePayments
                              .filter((payment) => payment.term === term.term)
                              .map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell>
                                    {new Date(
                                      payment.paymentDate
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    {payment.amount.toLocaleString()} RWF
                                  </TableCell>
                                  <TableCell>{payment.receiptNumber}</TableCell>
                                  <TableCell>
                                    {payment.paymentMethod
                                      .charAt(0)
                                      .toUpperCase() +
                                      payment.paymentMethod.slice(1)}
                                  </TableCell>
                                  <TableCell>{payment.notes}</TableCell>
                                </TableRow>
                              ))}
                            {!feePayments.some(
                              (payment) => payment.term === term.term
                            ) && (
                              <TableRow>
                                <TableCell
                                  colSpan={5}
                                  className="text-center py-4"
                                >
                                  No payment records found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-8" />
              {/* Permissions History */}
              <div>
                <h3 className="font-semibold mb-2">Permissions History</h3>
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{permission.reason}</h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            <p>
                              Out:{" "}
                              {new Date(permission.timeOut).toLocaleString()}
                            </p>
                            <p>
                              In: {new Date(permission.timeIn).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(
                            (new Date(permission.timeIn).getTime() -
                              new Date(permission.timeOut).getTime()) /
                              (1000 * 60)
                          )}{" "}
                          minutes
                        </span>
                      </div>
                    </div>
                  ))}
                  {permissions.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No permissions recorded
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* school info */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={pb.files.getURL(school, school.logo)}
                    alt={school.name}
                  />
                  <AvatarFallback>{school.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{school.name}</h2>
                  <span className="mt-1 flex items-center gap-1">
                    <MapPin className="opacity-80" />
                    {school.address}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">School Staff</h3>
                  <div className="grid gap-2">
                    {schoolStaff.map((staff, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                      >
                        <div>
                          <span className="font-medium">{staff.name}</span>{" "}
                          <span className="text-muted-foreground">
                            ({staff.role})
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="mr-4">
                            <strong>Phone:</strong> {staff.phone}
                          </span>
                          <span
                            style={{
                              display: staff.role == "HEADMASTER" ? "none" : "",
                            }}
                          >
                            <strong>Email:</strong> {staff.email}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact:</h3>
                  <div className="grid gap-1 text-sm">
                    <p>
                      <strong>Phone:</strong> {school.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {school.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
