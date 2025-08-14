"use client";
import "../print.css";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pb";
import { Separator } from "@radix-ui/react-separator";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { ChevronLeft, Loader, Loader2, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [ClassData, setClassData] = useState<any>({});
  const [students, setStudents] = useState<any>([]);

  const params = useParams();
  const classId: any = params.id;
  const scale = 2;

  useEffect(() => {
    (async () => {
      try {
        const Class = await pb
          .collection("classes")
          .getOne(classId, { expand: "school" });
        const Students = await pb
          .collection("students")
          .getFullList({
            filter: `Class="${classId}" && isDeleted = false`,
            expand: "Class",
          });

        // console.log(Class);
        setClassData(Class);
        setStudents(Students);
      } catch (err: any) {
        console.error("Failed to retrieve student cards", err.response);
      } finally {
        setLoading(false);
      }
    })();
  }, [classId]);
  return (
    <>
      <header
        id="no-print"
        className="flex h-(--header-height) py-2 mb-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
      >
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <Link href="/dashboard/card-generator">
            <Button className="mr-5" size="icon" variant="outline">
              <ChevronLeft />
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            <IconInnerShadowTop className="-ml-1" />
            <span className=" font-bold">SHEJA Cards</span>
          </div>
          <Separator
            orientation="vertical"
            className="mx-7 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium capitalize">
            {loading && <Skeleton className="w-[150px] h-8" />}
            {ClassData.name} {ClassData.combination}
          </h1>
          <div className="ml-14 flex items-center gap-2">
            <AcademicYearSelector disabled={true} />
          </div>
          <div className="ml-6">
            {loading ? (
              <Skeleton className="w-[150px] h-8" />
            ) : (
              <span className="text-center font-medium">
                {ClassData.expand.school.name}
              </span>
            )}
          </div>
        </div>
        <Button
          className="mr-5"
          disabled={loading}
          onClick={() => window.print()}
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              <Printer />
              Print
            </>
          )}
        </Button>
      </header>
      <section id="print-area">
        {loading ? (
          <div className="flex items-center justify-center animate-spin">
            <Loader className="size-[200px]" />
          </div>
        ) : (
          students.map((student: any, index: number) => (
            <div
              key={student.id}
              id="cards"
              className="bg-white shadow-lg mb-5 border border-gray-200 mx-auto relative overflow-hidden"
              style={{
                width: `${213 * scale}px`,
                height: `${338 * scale}px`,
                aspectRatio: "2.125/3.375",
              }}
            >
              {/* Header */}
              <div className="relative h-20 bg-white flex flex-col items-center justify-center px-4">
                <div className="rounded mt-7 mb-1 flex items-center justify-center">
                  {ClassData.expand.school?.logo && (
                    <Image
                      src={pb.files.getURL(
                        ClassData.expand.school,
                        ClassData.expand.school.logo
                      )}
                      width={80}
                      height={80}
                      alt="School Logo"
                    />
                  )}
                </div>
                <div className="text-center">
                  <h2
                    className="font-bold leading-tight"
                    style={{
                      fontSize: `${7 * scale}px`,
                      color: ClassData.expand.school?.colorPalette?.secondary,
                    }}
                  >
                    {ClassData.expand.school?.name}
                  </h2>
                  <p
                    className="text-gray-700 leading-tight"
                    style={{ fontSize: `${4.5 * scale}px` }}
                  >
                    {ClassData.expand.school?.address}
                  </p>
                </div>
              </div>

              {/* Profile Section */}
              <div className="relative">
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 33%, 100% 0%, 100% 100%, 0% 100%)",
                    background: ClassData.expand.school?.colorPalette?.primary,
                    height: "100vh",
                  }}
                />
                <div className="relative pt-8 pb-6 flex flex-col items-center">
                  <div
                    className="rounded-full bg-white p-1 mb-4"
                    style={{
                      width: `${80 * scale}px`,
                      height: `${80 * scale}px`,
                    }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={pb.files.getURL(student, student.profileImage)}
                        alt={student.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center px-2">
                    <h3
                      className="font-bold text-white uppercase leading-tight mb-1"
                      style={{ fontSize: `${13 * scale}px` }}
                    >
                      {student.name}
                    </h3>
                    <p
                      className="text-white leading-tight"
                      style={{ fontSize: `${11 * scale}px` }}
                    >
                      {student.Class
                        ? `${ClassData.name} ${ClassData.combination}`
                        : "Student"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div
                className="px-6 py-8 text-white relative z-10"
                style={{ marginTop: `${-19 * scale}px` }}
              >
                <div className="space-y-1">
                  {[
                    {
                      label: "Reg No",
                      value: student.registrationNumber || student.id,
                    },
                    { label: "Gender", value: student.gender || "N/A" },
                    {
                      label: "DOB",
                      value: new Date(student.dateOfBirth).toLocaleDateString(),
                    },
                    { label: "Valid Year", value: student.academicYear },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex text-white"
                      style={{ fontSize: `${9 * scale}px` }}
                    >
                      <span className="w-[84px] flex-shrink-0">
                        {item.label}
                      </span>
                      <span className="w-1">:</span>
                      <span className="flex-1 truncate ml-2">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="absolute"
                  style={{
                    bottom: `${-4 * scale}px`,
                    right: `${16 * scale}px`,
                  }}
                >
                  <div
                    className="shadow-md rounded-md p-1 flex items-center justify-center"
                    style={{
                      width: `${50 * scale}px`,
                      height: `${50 * scale}px`,
                    }}
                  >
                    <QRCodeSVG
                      value={"http:localhost:3000/scan/" + student.id}
                      size={102 * scale}
                      bgColor="transparent"
                      fgColor="white"
                    />
                  </div>
                </div>

                <div className="absolute bottom-[-100px]">
                  {[
                    {
                      label: "School Email",
                      value: "ghjk@ghjk.ca",
                    },
                    { label: "School Contact", value: "N/A" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex text-white ">
                      <span className="w-[120px] flex-shrink-0">
                        {item.label}
                      </span>
                      <span className="w-1">:</span>
                      <span className="flex-1 truncate ml-2">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-[-150px] right-2">
                  <span className="opacity-20">Created using Sheja Cards</span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
