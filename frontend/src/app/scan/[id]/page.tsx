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
import { IconInnerShadowTop } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

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

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const studentRecord = await pb
          .collection("students")
          .getOne(id as string, {
            expand: "Class, school",
          });
        setStudent(studentRecord as Student);
        setSchool(studentRecord.expand.school as School);
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
        <Button className="mr-5">Login</Button>
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
                  {[1, 2, 3].map((term) => (
                    <div
                      key={term}
                      className="text-center p-4 border rounded-lg"
                    >
                      <h4 className="font-medium mb-2">Term {term}</h4>
                      <p className="text-2xl font-bold text-primary">
                        {90 + term}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Out of 100
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-5" />
              {/* school fees */}
              <div>
                <h3 className="font-semibold mb-2">School Fees Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((term) => (
                    <div
                      key={term}
                      className="text-center p-4 border rounded-lg"
                    >
                      <h4 className="font-medium mb-2">Term {term}</h4>
                      <p className="text-2xl font-bold text-green-600">Paid</p>
                      <p className="text-sm text-muted-foreground">
                        200,000 RWF
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-8" />
              {/* Permissions History */}
              <div>
                <h3 className="font-semibold mb-2">Permissions History</h3>
                <div className="space-y-4">
                  {[
                    {
                      reason: "Buy school materials",
                      timeOut: "2024-01-15T09:30:00",
                      timeIn: "2024-01-15T11:45:00",
                    },
                    {
                      reason: "Medical appointment",
                      timeOut: "2024-02-02T14:00:00",
                      timeIn: "2024-02-02T16:30:00",
                    },
                    {
                      reason: "Family emergency",
                      timeOut: "2024-02-20T10:15:00",
                      timeIn: "2024-02-20T13:00:00",
                    },
                  ].map((permission, index) => (
                    <div key={index} className="p-4 border rounded-lg">
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
                </div>
              </div>
            </CardContent>
          </Card>

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
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    Location: {school.address}
                  </h3>
                  <div className="w-full h-64 bg-gray-900 rounded-2xl shadow">
                    {"Map will go here"}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">School Staff</h3>
                  <div className="grid gap-2">
                    {[
                      {
                        name: "Jean Bosco",
                        role: "Headmaster",
                        phone: "0788550389",
                        email: "bosco@school.edu",
                      },
                      {
                        name: "Alice Mukamana",
                        role: "Secretary",
                        phone: "0788657750",
                        email: "alice@school.edu",
                      },
                      {
                        name: "Eric Niyonzima",
                        role: "Director of Studies",
                        phone: "0788891751",
                        email: "eric@school.edu",
                      },
                      {
                        name: "Claudine Uwase",
                        role: "Bursar",
                        phone: "0782607594",
                        email: "claudine@school.edu",
                      },
                      {
                        name: "Patrick Mugisha",
                        role: "Disciplinary",
                        phone: "0788262838",
                        email: "patrick@school.edu",
                      },
                    ].map((staff, idx) => (
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
                          <span>
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
