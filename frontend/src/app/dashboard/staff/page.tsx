"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { AddStaffModal } from "@/components/staff/AddStaffModal";
import { UpdateStaffModal } from "@/components/staff/UpdateStaffModal";
import { RoleBadge } from "@/components/staff/RoleBadge";
import { Staff, NewStaffData, StaffRole } from "@/types/staff";
import { deleteStaff, fetchStaff } from "@/services/staff.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const staffData = await fetchStaff();
      setStaff(
        staffData.map((member: any) => ({
          id: member.id,
          collectionId: member.collectionId,
          collectionName: member.collectionName,
          created: member.created,
          updated: member.updated,
          name: member.name,
          email: member.email,
          role: member.role as StaffRole,
          phone: member.phone,
          idNumber: member.idNumber,
          status: member.status || "active",
          school: member.school,
          avatar: member.avatar,
        }))
      );
    } catch (error) {
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      search === "" ||
      member.name.toLowerCase().includes(search?.toLowerCase()) ||
      member.email.toLowerCase().includes(search?.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = (data: Staff) => {
    setStaff([...staff, data]);
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff(
      staff.map((member) =>
        member.id === updatedStaff.id ? updatedStaff : member
      )
    );
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to remove this staff member?"))
        return;
      await deleteStaff(id);
      setStaff(staff.filter((member) => member.id !== id));
      toast.success("Staff member deleted successfully");
    } catch (error) {
      toast.error("Failed to delete staff member");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff Management</CardTitle>
          <AddStaffModal onAddStaff={handleAddStaff} />
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* <div className="relative flex-1 max-w-sm">
                            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search staff..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div> */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={StaffRole.DOS}>DOS</SelectItem>
                <SelectItem value={StaffRole.BURSAR}>Bursar</SelectItem>
                <SelectItem value={StaffRole.TEACHER}>Teacher</SelectItem>
                <SelectItem value={StaffRole.PATRON}>Patron</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  {/* <TableHead>ID Number</TableHead> */}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No staff members found
                    </TableCell>
                  </TableRow>
                )}
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell>{member.phone}</TableCell>
                    {/* <TableCell>{member.idNumber}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UpdateStaffModal
                          staff={member}
                          onUpdateStaff={handleUpdateStaff}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteStaff(member.id)}
                        >
                          <IconTrash className="h-4 w-4" />
                          <span className="sr-only">Delete staff</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
