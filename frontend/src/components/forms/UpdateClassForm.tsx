"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateClass } from "@/services/classes.service";
import { IconEdit } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Classes } from "@/types/classes.types";

interface UpdateClassFormProps {
    classData: Classes;
    setClasses: Dispatch<SetStateAction<Classes[]>>;
}

export default function UpdateClassForm({ classData, setClasses }: UpdateClassFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: classData.name,
            combination: classData.combination,
            academicYear: classData.academicYear,
        },
    });

    const handleUpdateClass = async (data: any) => {
        try {
            setLoading(true);
            const res = await updateClass(classData.id, data);
            setClasses((prevClasses: Classes[]) =>
                prevClasses.map((c) => (c.id === classData.id ? res : c))
            );
            toast.success("Class updated successfully");
            setOpen(false);
        } catch (err: any) {
            console.error("Failed to update class", err.response);
            toast.error("Unable to update the class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-full flex items-center justify-start p-0 text-gray-700"
                >
                    <IconEdit className="h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Update Class</DialogTitle>
                    <DialogDescription>
                        Update the details of the class.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleUpdateClass)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Class Name
                            </Label>
                            <Input
                                disabled={loading}
                                id="name"
                                className="col-span-3"
                                required
                                {...register("name")}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="combination" className="text-right">
                                Combination
                            </Label>
                            <Input
                                disabled={loading}
                                id="combination"
                                className="col-span-3"
                                {...register("combination")}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="academicYear" className="text-right">
                                Academic Year
                            </Label>
                            <Input
                                disabled={loading}
                                id="academicYear"
                                className="col-span-3"
                                required
                                {...register("academicYear")}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} type="submit">
                            {!loading ? (
                                "Update Class"
                            ) : (
                                <Loader2 className="animate-spin" />
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
