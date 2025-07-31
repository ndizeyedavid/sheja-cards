import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBooks,
  IconUserCircle,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconSearch,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Classes } from "@/types/classes.types";
import Loading from "./Loading";

interface classesTableProps {
  classes: Classes[];
  isFiltered: boolean;
  selectedYear: string;
  selectedClass: string;
  isLoading: boolean;
}

export default function ClassesTable({ classes }: classesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClass = (ClassId: number) => {
    console.log("Edit Class:", ClassId);
  };

  const handleDeleteClass = (ClassId: number) => {
    console.log("Delete Class:", ClassId);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Class List</CardTitle>
          <Badge variant="secondary">
            {!isLoading ? `${classes.length} classes` : "Loading..."}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="mb-4 w-full">
            <div className="relative flex-1 w-full max-w-sm">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by class name or combination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Combination</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  <Loading />
                ) : (
                  classes.map((Class) => (
                    <TableRow key={Class.id}>
                      <TableCell>{Class.id}</TableCell>
                      <TableCell>{Class.name}</TableCell>
                      <TableCell>{Class.combination}</TableCell>
                      <TableCell>
                        <Badge variant={"secondary"}>
                          {Class.academicYear}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <IconDotsVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClass(Class.id)}
                            >
                              <IconEdit className="mr-2 h-4 w-4" />
                              Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClass(Class.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
