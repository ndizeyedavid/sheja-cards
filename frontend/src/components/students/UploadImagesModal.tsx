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
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Image, Trash as IconTrash } from "lucide-react";
import { createBulkStudents } from "@/services/students.service";

const studentSchema = z.object({
  students: z.array(
    z.object({
      image: z.instanceof(File),
      name: z.string().min(1, "Name is required"),
      gender: z.enum(["MALE", "FEMALE"]),
      dateOfBirth: z.string().min(1, "Date of birth is required"),
      registrationNumber: z.string().min(1, "Registration number is required"),
    })
  ),
});

type StudentForm = z.infer<typeof studentSchema>;

interface UploadImagesModalProps {
  selectedClass: string;
  onAddStudents: (newStudents: any[]) => void;
}

export function UploadImagesModal({
  selectedClass,
  onAddStudents,
}: UploadImagesModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      students: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "students",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        append({
          image: file,
          name: file.name.split(".")[0],
          gender: "MALE",
          dateOfBirth: "",
          registrationNumber: "",
        });
      });
    }
  };

  const onSubmit = async (data: StudentForm) => {
    try {
      const formData = data.students.map((student) => ({
        name: student.name,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        registrationNumber: student.registrationNumber,
        profileImage: student.image,
      }));

      const newStudents = await createBulkStudents({
        data: formData,
        Class: selectedClass,
      });

      onAddStudents(newStudents);
      setIsOpen(false);
      form.reset();
      toast.success("Students added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add students");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center w-full px-2.5 py-1.5 text-sm hover:bg-primary rounded cursor-default">
          <Image className="mr-3.5 h-4 w-4 opacity-60" />
          <span>Upload From Images</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Student Images</DialogTitle>
          <DialogDescription>
            Upload images and fill in student details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={URL.createObjectURL(field.image)}
                    alt={`Student ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="grid gap-2 flex-1">
                    <FormField
                      control={form.control}
                      name={`students.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`students.${index}.gender`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`students.${index}.dateOfBirth`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`students.${index}.registrationNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="self-start"
                    onClick={() => remove(index)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={fields.length === 0}>
                Add Students
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
