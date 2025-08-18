"use client";
import { SectionCards } from "@/components/section-cards";

import SearchStudent from "@/components/search-bar/SearchStudent";
import { RecentStudents } from "@/components/tables/RecentStudents";
import { StudentDistribution } from "@/components/graphs/StudentDistribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import pb from "@/lib/pb";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";

export default function page() {
  const [schoolData, setSchoolData] = useState<any>({});
  useEffect(() => {
    (async () => {
      const res = await pb
        .collection("school")
        .getOne(pb.authStore.record?.school);
      console.log(res);

      setSchoolData(res);
    })();
  }, []);
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />

      {/* Search bar for a student */}
      {/* <SearchStudent /> */}

      {/* <div className="px-4 lg:px-6"><ChartAreaInteractive /></div> */}
      <div className="flex px-4 gap-2 lg:px-6">
        <StudentDistribution />
        {/* 
        <Card className="w-[30%]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Student Card Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="bg-white shadow-lg border border-gray-200 mx-auto relative overflow-hidden"
              style={{ width: "213px", height: "338px" }}
            >
              <div className="relative h-20 bg-white flex flex-col items-center justify-center px-4">
                <div className="w-12 h-10 rounded mb-1 flex items-center justify-center">
                  <Image
                    src={pb.files.getURL(schoolData, schoolData.logo)}
                    width={200}
                    height={200}
                    alt="School Logo"
                  />
                </div>
                <div className="text-center">
                  <h2
                    className="font-bold leading-tight text-[7px] text-black"
                    style={{
                      color: schoolData.colorPalette.secondary,
                    }}
                  >
                    {"School Name"}
                  </h2>
                  <p className="text-gray-700 leading-tight text-[4.5px]">
                    {"School Address"}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)",
                    // background: schoolData.colorPalette.primary,
                    height: "100vh",
                  }}
                />
                <div className="relative pt-8 pb-6 flex flex-col items-center">
                  <div
                    className="rounded-full bg-white p-1 mb-4"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={""}
                        alt="Student"
                        className="object-cover"
                      />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="font-bold text-white uppercase leading-tight mb-1 text-[13px]">
                      Student Name
                    </h3>
                    <p className="text-white leading-tight text-[11px]">
                      Class Here
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-2 text-white relative z-10 mt-[-19px]">
                <div className="space-y-1 text-[9px]">
                  {["Reg No", "Gender", "DOB", "Valid Year"].map(
                    (label, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="w-12">{label}</span>
                        <span className="w-1">:</span>
                        <span className="truncate bg-gray-400/70 w-[80px] h-2 rounded" />
                      </div>
                    )
                  )}
                </div>
                <div className="absolute bottom-4 right-4">
                  <div
                    className="shadow-md rounded-md p-1 flex items-center justify-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <QRCodeSVG value="http://localhost:3000/scan/" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <RecentStudents />
    </div>
  );
}
