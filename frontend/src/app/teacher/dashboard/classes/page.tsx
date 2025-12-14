"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pb";
import { toast } from "sonner";
import {
  IconBook,
  IconUsers,
  IconArrowRight,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface ClassInfo {
  id: string;
  name: string;
  combination?: string;
  studentCount?: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.record) {
          const classRecords = await pb.collection("subjects").getFullList({
            filter: `assignedTeacher = "${pb.authStore.record.id}"`,
            expand: "assignedClass",
          });

          const uniqueClasses: { [key: string]: ClassInfo } = {};
          classRecords.forEach((subject: any) => {
            if (subject.expand?.assignedClass) {
              const classData = subject.expand.assignedClass;
              if (!uniqueClasses[classData.id]) {
                uniqueClasses[classData.id] = {
                  id: classData.id,
                  name: classData.name,
                  combination: classData.combination,
                };
              }
            }
          });

          const classesArray = Object.values(uniqueClasses);
          setClasses(classesArray);
          setFilteredClasses(classesArray);
        }
      } catch (error) {
        console.error("Error loading classes:", error);
        toast.error("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = classes.filter(
      (cls) =>
        cls.name.toLowerCase().includes(query.toLowerCase()) ||
        cls.combination?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Classes</h1>
          <p className="text-muted-foreground">
            Manage and view all your assigned classes
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <IconFilter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/teacher/classes/${classItem.id}`}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {classItem.name}
                        </CardTitle>
                        {classItem.combination && (
                          <CardDescription>
                            {classItem.combination}
                          </CardDescription>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <IconBook className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <IconUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Students
                        </p>
                        <p className="font-semibold">45 Students</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        View Students
                      </Button>
                      <Button
                        className="flex-1 text-xs gap-1 group-hover:gap-2 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Manage
                        <IconArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <IconBook className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "You haven't been assigned any classes yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
