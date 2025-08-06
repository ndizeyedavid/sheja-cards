"use client";

import { useState } from "react";
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
import { IconSearch } from "@tabler/icons-react";
import { AddStaffModal } from "@/components/staff/AddStaffModal";
import { RoleBadge } from "@/components/staff/RoleBadge";
import { Staff, NewStaffData } from "@/types/staff";

// Mock data
const mockStaff: Staff[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@school.com",
    role: "Headmaster",
    phone: "+1234567890",
    idNumber: "ID001",
    status: "active",
  },
  // Add more mock data...
];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      search === "" ||
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = async (data: NewStaffData) => {
    // Mock invite/add staff
    const newStaff: Staff = {
      ...data,
      id: `${staff.length + 1}`,
      status: "active",
    };
    setStaff([...staff, newStaff]);
  };

  return (
    <div className="flex px-6 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff Management</CardTitle>
          <AddStaffModal onAddStaff={handleAddStaff} />
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Headmaster">Headmaster</SelectItem>
                <SelectItem value="DOS">DOS</SelectItem>
                <SelectItem value="Bursar">Bursar</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Librarian">Librarian</SelectItem>
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
                  <TableHead>ID Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                    <TableCell>{member.idNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "active" ? "default" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
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
