"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Students } from "@/types/student.types";
import { ApiError } from "@/types/api.types";
import pb from "@/lib/pb";

export default function Page() {
  const [students, setStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const records = await pb.collection("students").getFullList<Students>({
        sort: "-created",
        expand: "class,school",
      });
      setStudents(records);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("students").delete(id);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.message || "Failed to delete student");
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.registrationNumber.toLowerCase().includes(searchTerm) ||
      (student.expand?.class?.name || "").toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 w-full md:w-auto">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">
            Manage your school students here
          </p>
        </div>

        <Button
          onClick={() => router.push("/students/new")}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, registration number, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-card text-card-foreground rounded-lg shadow-sm border p-6 space-y-4"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{student.name}</h3>
              <p className="text-muted-foreground">
                {student.registrationNumber}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Class</p>
              <p className="text-muted-foreground">
                {student.expand?.class?.name || "Not Assigned"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Contact</p>
              <p className="text-muted-foreground">
                {student.parent_phone || "Not Available"}
              </p>
            </div>

            <div className="pt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/students/${student.id}`)}
              >
                View Details
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(student.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No students found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}