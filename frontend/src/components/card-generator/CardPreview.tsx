"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";
import pb from "@/lib/pb";
import { useEffect, useState } from "react";
import Image from "next/image";

interface CardPreviewProps {
  student: any;
}

export function CardPreview({ student }: CardPreviewProps) {
  const [schoolData, setSchoolData] = useState<any>({});
  useEffect(() => {
    (async () => {
      const schoolId = pb.authStore.record?.school;
      const res = await pb.collection("school").getOne(schoolId);
      setSchoolData(res);
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

  return (
    <div className="sticky top-10">
      {/* ID Card Container - matching PDF dimensions ratio */}
      <div
        className="bg-white shadow-lg border border-gray-200 mx-auto relative overflow-hidden"
        style={{
          width: "213px", // 2.125 inches * 100px/inch
          height: "338px", // 3.375 inches * 100px/inch
          aspectRatio: "2.125/3.375",
        }}
      >
        {/* Header Section with Logo Space */}
        <div className="relative h-20 bg-white flex flex-col items-center justify-center px-4">
          {/* Logo placeholder */}
          <div className="w-12 h-10 rounded mb-1 flex items-center justify-center">
            <Image
              src={pb.files.getURL(schoolData, schoolData.logo)}
              width={200}
              height={200}
              alt="School Logo"
            />
          </div>

          {/* Company Name */}
          <div className="text-center">
            <h2
              className={`font-bold text-[${schoolData.colorPalette.secondary}] leading-tight`}
              style={{ fontSize: "7px" }}
            >
              {schoolData.name}
            </h2>
            <p
              className="text-gray-700 leading-tight"
              style={{ fontSize: "4.5px" }}
            >
              {schoolData.address}
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative">
          {/* Maroon background shape */}
          <div
            className={`absolute inset-0 h-[100vh] bg-[${schoolData.colorPalette.primary}]`}
            style={{
              clipPath: "polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />

          {/* White circle for profile image */}
          <div className="relative pt-8 pb-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white p-1 mb-4">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={pb.files.getURL(student, student.profileImage)}
                  alt={student.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm bg-gray-100">
                  {student.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Designation */}
            <div className="text-center px-2">
              <h3
                className="font-bold text-white uppercase leading-tight mb-1"
                style={{ fontSize: "13px" }}
              >
                {student.name}
              </h3>
              <p
                className="text-white leading-tight"
                style={{ fontSize: "11px" }}
              >
                {student.expand?.Class
                  ? `${student.expand.Class.name} ${student.expand.Class.combination}`
                  : "Student"}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div
          className="px-6 py-2 text-white relative z-10"
          style={{ marginTop: "-19px" }}
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
                style={{ fontSize: "9px" }}
              >
                <span className="w-12 flex-shrink-0">{item.label}</span>
                <span className="w-1">:</span>
                <span className="flex-1 truncate">{item.value}</span>
              </div>
            ))}
          </div>

          {/* QR Code */}
          <div className="absolute bottom-4 right-4">
            <div className="w-10 h-10 shadow-md rounded-md p-1 flex items-center justify-center">
              <QRCodeSVG
                value={"http://localhost3000/scan/" + student.id}
                size={32}
                bgColor="transparent"
                fgColor="white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Label */}
      {/* <p className="text-center text-xs text-muted-foreground mt-2">
        ID Card Preview
      </p> */}
    </div>
  );
}
