"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Staff, StaffRole } from "@/types/staff";
import { ApiError } from "@/types/api.types";
import pb from "@/lib/pb";

export default function Page() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<StaffRole | "all">("all");
  const router = useRouter();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const records = await pb.collection("staff").getFullList<Staff>({
        sort: "-created",
        expand: "school",
      });
      setStaff(records);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.message || "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("staff").delete(id);
      toast.success("Staff member deleted successfully");
      fetchStaff();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.message || "Failed to delete staff member");
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole =
      selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesRole;
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
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your school staff members here
          </p>
        </div>

        <Button
          onClick={() => router.push("/staff/new")}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Staff
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-48">
          <Label htmlFor="role-filter" className="sr-only">
            Filter by role
          </Label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) =>
              setSelectedRole(e.target.value as StaffRole | "all")
            }
            className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">All Roles</option>
            {Object.values(StaffRole).map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-card text-card-foreground rounded-lg shadow-sm border p-6 space-y-4"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Role</p>
              <p className="text-muted-foreground capitalize">{member.role}</p>
            </div>

            <div className="pt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/staff/${member.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(member.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {filteredStaff.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No staff members found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}