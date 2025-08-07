"use client";
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
    IconPrinter,
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
import { useEffect, useState } from "react";
import { Classes } from "@/types/classes.types";
import Loading from "./Loading";
import AddClassForm from "../forms/AddClassForm";
import { deleteClass, fetchClasses } from "@/services/classes.service";
import { toast } from "sonner";
import UpdateClassForm from "../forms/UpdateClassForm";

export default function ClassesTable() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [classes, setClasses] = useState<Classes[]>([]);

    useEffect(() => {
        setIsLoading(true);
        fetchClasses().then((res) => {
            setClasses(res as unknown as Classes[]);
            setIsLoading(false);
        });
    }, []);

    const filteredClasses = classes.filter((Class) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            Class.name.toLowerCase().includes(searchTerm) ||
            (Class.combination?.toLowerCase() || "").includes(searchTerm)
        );
    });

    const handleDeleteClass = async (ClassId: string) => {
        try {
            if (
                !confirm(
                    "Are you sure you want to delete this class!\nNote that the students in the class will also be deleted!!!"
                )
            )
                return;
            await deleteClass(ClassId);
            setClasses(classes.filter((Class) => Class.id !== ClassId));
            toast.success("Class deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Unable to delete class");
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">Class List</CardTitle>
                    <Badge variant="secondary">
                        {!isLoading ? `${filteredClasses.length} classes` : "Loading..."}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative flex-1 w-full max-w-sm">
                            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by class name or combination..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 w-full"
                            />
                        </div>

                        <div className="flex items-center">
                            <AddClassForm setClasses={setClasses} />
                            <Button className="ml-4" onClick={() => window.print()}>
                                <IconPrinter className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-28 pr-5">#</TableHead> */}
                                    <TableHead>Class Name</TableHead>
                                    <TableHead>Combination</TableHead>
                                    <TableHead>Academic Year</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <Loading category="default" />
                                ) : (
                                    filteredClasses.map((Class) => (
                                        <TableRow key={Class.id}>
                                            <TableCell className="capitalize">
                                                {Class.name}
                                            </TableCell>
                                            <TableCell className="uppercase">
                                                {Class.combination
                                                    ? Class.combination
                                                    : "-"}
                                            </TableCell>
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
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <UpdateClassForm
                                                            classData={Class}
                                                            setClasses={setClasses}
                                                        />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDeleteClass(
                                                                    Class.id
                                                                )
                                                            }
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
