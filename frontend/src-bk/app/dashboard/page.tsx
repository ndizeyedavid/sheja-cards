import { SectionCards } from "@/components/section-cards";

import SearchStudent from "@/components/search-bar/SearchStudent";
import { RecentStudents } from "@/components/tables/RecentStudents";
import { StudentDistribution } from "@/components/graphs/StudentDistribution";

export default function page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />

      {/* Search bar for a student */}
      <SearchStudent />

      {/* <div className="px-4 lg:px-6"><ChartAreaInteractive /></div> */}
      <div className="px-4 lg:px-6">
        <StudentDistribution />
      </div>

      <RecentStudents />
    </div>
  );
}
