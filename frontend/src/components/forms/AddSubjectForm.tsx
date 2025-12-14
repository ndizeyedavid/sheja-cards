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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSubject } from "@/services/subjects.service";
import { fetchStaff } from "@/services/staff.service";
import { fetchClasses } from "@/services/classes.service";
import { IconBooks } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Subject } from "@/types/subjects.types";
import { Staff } from "@/types/staff";
import { Classes } from "@/types/classes.types";

export default function AddSubjectForm({
  setSubjects,
}: {
  setSubjects: Dispatch<SetStateAction<Subject[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const { register, handleSubmit, reset, control } = useForm();

  useEffect(() => {
    if (open) {
      loadTeachersAndClasses();
    }
  }, [open]);

  const loadTeachersAndClasses = async () => {
    try {
      const [teachersData, classesData] = await Promise.all([
        fetchStaff(),
        fetchClasses(),
      ]);
      // Filter only teachers
      const teachersList = teachersData.filter(
        (staff: Staff) => staff.role === "TEACHER"
      );
      setTeachers(teachersList);
      // console.log(classesData);
      setClasses(classesData);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Failed to load teachers and classes");
    }
  };

  const handleAddSubject = async (data: any) => {
    try {
      setLoading(true);
      const subjectData = {
        ...data,
        assignedClass: selectedClasses.length > 0 ? selectedClasses : undefined,
      };
      const res = await createSubject(subjectData);
      console.log(res);
      toast.success("Subject created successfully");
      reset();
      setSelectedClasses([]);
      setSubjects((prevSubjects: Subject[]) => [...prevSubjects, res]);
      setOpen(false);
    } catch (err: any) {
      console.error("ERROR: ", err);
      console.error("PB ERROR:", err.response);
      toast.error("Unable to create a new subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="not-print">
          <IconBooks className="mr-2 h-4 w-4" />
          New Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new subject.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAddSubject)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectCode" className="text-right">
                Subject Code
              </Label>
              <Input
                disabled={loading}
                id="subjectCode"
                className="col-span-3"
                required
                {...register("subjectCode")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectName" className="text-right">
                Subject Name
              </Label>
              <Input
                disabled={loading}
                id="subjectName"
                className="col-span-3"
                required
                {...register("subjectName")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subjectCredit" className="text-right">
                Subject Credit
              </Label>
              <Input
                disabled={loading}
                id="subjectCredit"
                className="col-span-3"
                {...register("subjectCredit")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="assignedTeacher" className="text-right ">
                Assigned Teacher
              </Label>
              <Controller
                name="assignedTeacher"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-2">
              <Label className="text-right pt-2">Assigned Classes</Label>
              <div className="col-span-3 space-y-2 flex flex-wrap gap-4 items-center">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`class-${classItem.id}`}
                      checked={selectedClasses.includes(classItem.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClasses([
                            ...selectedClasses,
                            classItem.id,
                          ]);
                        } else {
                          setSelectedClasses(
                            selectedClasses.filter((id) => id !== classItem.id)
                          );
                        }
                      }}
                      disabled={loading}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`class-${classItem.id}`}
                      className="font-normal cursor-pointer flex-1"
                    >
                      {classItem.name} {classItem.combination}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">
              {!loading ? "Save Subject" : <Loader2 className="animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
