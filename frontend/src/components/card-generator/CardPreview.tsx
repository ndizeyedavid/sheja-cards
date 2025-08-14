"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";
import pb from "@/lib/pb";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface CardPreviewProps {
  student: any;
}

export function CardPreview({ student }: CardPreviewProps) {
  const [schoolData, setSchoolData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const schoolId = pb.authStore.record?.school;
      if (schoolId) {
        const res = await pb.collection("school").getOne(schoolId);
        setSchoolData(res);
      }
    })();
  }, []);

  if (!student) {
    return (
      <Card className="flex items-center justify-center h-[320px] border-dashed">
        <p className="text-muted-foreground">
          Select a student to preview card
        </p>
      </Card>
    );
  }

  // reusable card UI
  const CardUI = (scale = 1) => (
    <div
      className="bg-white shadow-lg border border-gray-200 mx-auto relative overflow-hidden"
      style={{
        width: `${213 * scale}px`,
        height: `${338 * scale}px`,
        aspectRatio: "2.125/3.375",
      }}
    >
      {/* Header */}
      <div className="relative h-20 bg-white flex flex-col items-center justify-center px-4">
        <div className="w-12 h-10 rounded mb-1 flex items-center justify-center">
          {schoolData?.logo && (
            <Image
              src={pb.files.getURL(schoolData, schoolData.logo)}
              width={200}
              height={200}
              alt="School Logo"
            />
          )}
        </div>
        <div className="text-center">
          <h2
            className="font-bold leading-tight"
            style={{
              fontSize: `${7 * scale}px`,
              color: schoolData?.colorPalette?.secondary,
            }}
          >
            {schoolData?.name}
          </h2>
          <p
            className="text-gray-700 leading-tight"
            style={{ fontSize: `${4.5 * scale}px` }}
          >
            {schoolData?.address}
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)",
            background: schoolData?.colorPalette?.primary,
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
              {student.expand?.Class
                ? `${student.expand.Class.name} ${student.expand.Class.combination}`
                : "Student"}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div
        className="px-6 py-2 text-white relative z-10"
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
              <span className="w-12 flex-shrink-0">{item.label}</span>
              <span className="w-1">:</span>
              <span className="flex-1 truncate">{item.value}</span>
            </div>
          ))}
        </div>
        <div
          className="absolute"
          style={{
            bottom: `${16 * scale}px`,
            right: `${16 * scale}px`,
          }}
        >
          <div
            className="shadow-md rounded-md p-1 flex items-center justify-center"
            style={{
              width: `${40 * scale}px`,
              height: `${40 * scale}px`,
            }}
          >
            <QRCodeSVG
              value={"http://localhost:3000/scan/" + student.id}
              size={32 * scale}
              bgColor="transparent"
              fgColor="white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="sticky top-10 cursor-pointer">{CardUI(1)}</div>
      </DialogTrigger>
      <DialogContent
        title="blah-blah-blah"
        className="max-w-fit bg-transparent border-none shadow-none p-0"
      >
        {CardUI(1.3)} {/* Full screen-ish, scaled 3x */}
      </DialogContent>
    </Dialog>
  );
}
