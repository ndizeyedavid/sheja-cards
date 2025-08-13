"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { AcademicYearSelector } from "./AcademicYearSelector";
import { useEffect, useState } from "react";
import pb from "@/lib/pb";
import { Skeleton } from "./ui/skeleton";

export function SiteHeader() {
  // const pathname = usePathname();
  const [schoolData, setSchoolData] = useState<any>({});
  const [loading, setLoading] = useState<Boolean>(true);
  useEffect(() => {
    (async () => {
      const schoolId = pb.authStore.record?.school;
      const res = await pb.collection("school").getOne(schoolId);
      setSchoolData(res);
      setLoading(false);
    })();
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium capitalize">
          {/* {pathname.split("/").pop()} */}
          {loading && <Skeleton className="w-[150px] h-8" />}
          {schoolData.name}
        </h1>
        <div className="ml-14 flex items-center gap-2">
          <AcademicYearSelector />
        </div>
      </div>
    </header>
  );
}
