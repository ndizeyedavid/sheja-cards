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
import { createClass } from "@/services/classes.service";
import { IconBooks } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Classes } from "@/types/classes.types";

export default function AddClassForm({
  setClasses,
}: {
  setClasses: (classes: Classes[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm();
  const academicYear: any = localStorage.getItem("academicYear");

  const handleAddClass = async (data: any) => {
    try {
      setLoading(true);
      const res = await createClass(data);
      toast.success("Class created successfully");
      reset();
      setClasses((prevClasses: Classes[]) => [...prevClasses, res]);
    } catch (err: any) {
      console.error("ERROR: ", err);
      console.error("PB ERROR:", err.response);
      toast.error("Unable to create a new class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="not-print">
          <IconBooks className="mr-2 h-4 w-4" />
          New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new class.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAddClass)}>
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
                defaultValue={academicYear}
                required
                {...register("academicYear")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">
              {!loading ? "Save Class" : <Loader2 className="animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
