"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { fetchClasses } from "@/services/classes.service";
import { Classes } from "@/types/classes.types";

interface ClassFilterCardProps {
  onClassSelect: (classId: string) => void;
  isLoading: boolean;
}

export default function ClassFilterCard({
  onClassSelect,
  isLoading,
}: ClassFilterCardProps) {
  const [classes, setClasses] = useState<Classes[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      const classesData = await fetchClasses();
      setClasses(classesData);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleSearch = () => {
    if (selectedClass) {
      onClassSelect(selectedClass);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Reports</CardTitle>
        <CardDescription>
          Select a class to view student reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Select Class
            </label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class..." />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} {cls.combination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSearch}
            disabled={!selectedClass || isLoading || loadingClasses}
            className="gap-2"
          >
            <IconSearch className="h-4 w-4" />
            View Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
