import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconFilter } from "@tabler/icons-react";

interface FiltercardProps {
  academicYears: string[];
  classes: string[];
  setIsLoading: (loading: boolean) => void;
  setIsFiltered: (filtered: boolean) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedClass: string;
  setSelectedClass: (className: string) => void;
}

export default function Filtercard({
  academicYears,
  classes,
  setIsLoading,
  setIsFiltered,
  selectedYear,
  setSelectedYear,
  selectedClass,
  setSelectedClass,
}: FiltercardProps) {
  const handleFilter = async () => {
    setIsLoading(true);
    setIsFiltered(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Filter Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="sm:ml-auto" onClick={() => handleFilter()}>
            <IconFilter className="mr-2 h-4 w-4" />
            Filter Students
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
