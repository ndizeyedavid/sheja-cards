"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import {
  Loader2,
  Wifi,
  WifiOff,
  Camera,
  User,
  Calendar,
  Hash,
} from "lucide-react";
import pb from "@/lib/pb";
import { Students } from "@/types/student.types";
import { updateStudent } from "@/services/students.service";
import Image from "next/image";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.any(),
  registrationNumber: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface RealtimeStudentModalProps {
  selectedClass: string;
  onStudentUpdated: (student: Students) => void;
  children: React.ReactNode;
}

export function RealtimeStudentModal({
  selectedClass,
  onStudentUpdated,
  children,
}: RealtimeStudentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingStudent, setPendingStudent] = useState<Students | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      gender: "MALE",
      dateOfBirth: "",
      registrationNumber: "",
    },
  });

  // Setup realtime listener for new students
  useEffect(() => {
    if (!isOpen) return;

    let unsubscribe: (() => void) | null = null;

    const setupRealtimeListener = async () => {
      try {
        setIsConnected(true);
        setIsWaiting(true);
        // Subscribe to students collection changes
        unsubscribe = await pb.collection("students").subscribe("*", (e) => {
          console.log("Realtime event:", e.action);

          // Only process CREATE events for students with empty names (from camera)
          if (e.action == "create") {
            const newStudent = e.record as any as Students;
            // Check if this is a new student from camera (has image but no complete details)
            if (newStudent.profileImage) {
              setIsWaiting(false);
              // If class matches or no class filter
              setPendingStudent(newStudent as any as Students);

              // Pre-fill form with any existing data
              form.reset({
                name: newStudent.name || "",
                gender: (newStudent.gender as "MALE" | "FEMALE") || "MALE",
                dateOfBirth: "",
                registrationNumber: newStudent.registrationNumber || "",
              });

              toast.success(
                "New student photo detected! Complete the details below."
              );
            }
          }
        });

        console.log("Realtime listener setup complete");
      } catch (error) {
        console.error("Failed to setup realtime listener:", error);
        setIsConnected(false);
        toast.error("Failed to connect to realtime updates");
      }
    };

    setupRealtimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isOpen, selectedClass, form]);

  // Handle modal close
  const handleClose = () => {
    setIsOpen(false);
    setIsWaiting(true);
    setPendingStudent(null);
    setIsConnected(false);
    form.reset();
  };

  // Handle form submission
  const onSubmit = async (data: StudentFormValues) => {
    if (!pendingStudent) return;

    setIsSubmitting(true);
    try {
      const updatedStudent = await updateStudent(pendingStudent.id, {
        name: data.name,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth.toISOString(),
        registrationNumber: data.registrationNumber || undefined,
      });

      onStudentUpdated(updatedStudent as any as Students);
      toast.success("Student details updated successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update student");
      console.error("Update student error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi
              className={`h-5 w-5 ${
                isConnected ? "text-green-500" : "text-red-500"
              }`}
            />
            Realtime Student Creation
          </DialogTitle>
          <DialogDescription>
            {isWaiting
              ? "Waiting for a new student photo to be captured..."
              : "Complete the student details below"}
          </DialogDescription>
        </DialogHeader>

        {isWaiting ? (
          // Waiting State
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary/60" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">
                Listening for new photos...
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Take a photo using the camera page. As soon as it's captured, it
                will appear here for you to complete the student details.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">
                    Connected to realtime updates
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">
                    Disconnected from realtime updates
                  </span>
                </>
              )}
            </div>

            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        ) : (
          // Student Form State
          <div className="space-y-6">
            {/* Student Image Preview */}
            {pendingStudent?.profileImage && (
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                  {/* {console.log(pendingStudent)} */}
                  <Image
                    src={pb.files.getURL(
                      pendingStudent,
                      pendingStudent.profileImage
                    )}
                    width={500}
                    height={500}
                    alt="Student photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter student's full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
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
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Registration Number (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter registration number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Complete Student"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
