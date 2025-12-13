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
import { updateSubject } from "@/services/subjects.service";
import { fetchStaff } from "@/services/staff.service";
import { fetchClasses } from "@/services/classes.service";
import { IconEdit } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Subject } from "@/types/subjects.types";
import { Staff } from "@/types/staff";
import { Classes } from "@/types/classes.types";

interface UpdateSubjectFormProps {
  subjectData: Subject;
  setSubjects: Dispatch<SetStateAction<Subject[]>>;
}

export default function UpdateSubjectForm({
  subjectData,
  setSubjects,
}: UpdateSubjectFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<Classes[]>(
    Array.isArray(subjectData.assignedClass) &&
      subjectData.assignedClass.length > 0 &&
      typeof subjectData.assignedClass[0] === "object"
      ? (subjectData.assignedClass as unknown as Classes[])
      : []
  );
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      subjectCode: subjectData.subjectCode,
      subjectName: subjectData.subjectName,
      subjectCredit: subjectData.subjectCredit,
      //   @ts-ignore
      assignedTeacher: subjectData.assignedTeacher?.id || "",
    },
  });

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
      setClasses(classesData);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Failed to load teachers and classes");
    }
  };

  const handleUpdateSubject = async (data: any) => {
    try {
      setLoading(true);
      const subjectData_updated = {
        ...data,
        assignedClass:
          selectedClasses.length > 0
            ? selectedClasses.map((cls) => cls.id)
            : undefined,
      };
      const res = await updateSubject(subjectData.id, subjectData_updated);
      setSubjects((prevSubjects: Subject[]) =>
        prevSubjects.map((s) => (s.id === subjectData.id ? res : s))
      );
      toast.success("Subject updated successfully");
      setOpen(false);
    } catch (err: any) {
      console.error("Failed to update subject", err.response);
      toast.error("Unable to update the subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-full flex items-center justify-start p-0"
        >
          <IconEdit className="h-4 w-4 text-gray-400" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Subject</DialogTitle>
          <DialogDescription>
            Update the details of the subject.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdateSubject)}>
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
              <Label htmlFor="assignedTeacher" className="text-right">
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
                          {teacher.name}
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
                      checked={selectedClasses.some(
                        (cls: any) => cls.id === classItem.id
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClasses([...selectedClasses, classItem]);
                        } else {
                          setSelectedClasses(
                            selectedClasses.filter(
                              (cls: any) => cls.id !== classItem.id
                            )
                          );
                        }
                      }}
                      disabled={loading}
                      className="h-4 w-4"
                    />
                    {/* {console.log({
                      slecred: selectedClasses[0].id,
                    })} */}
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
              {!loading ? (
                "Update Subject"
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
