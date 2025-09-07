import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createStudent } from "@/services/students.service";
import { Camera, RotateCcw, Check, X, Settings } from "lucide-react";
import { DatePicker } from "../DatePicker";
import { Card, CardContent } from "@/components/ui/card";
import Webcam from "react-webcam";
import {
  CameraEnhancer,
  generateFilterString,
  getVignetteStyle,
} from "../camera/CameraEnhancer";
import { CameraSettings, defaultCameraSettings } from "../camera/CameraConfig";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.date("Date of birth is required"),
  registrationNumber: z.string().optional(),
  class: z.string().min(1, "Class is required"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface CameraModalProps {
  onAddStudent: (student: any) => void;
  selectedClass: string;
}

export function CameraModal({ onAddStudent, selectedClass }: CameraModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(
    defaultCameraSettings
  );

  const webcamRef = useRef<Webcam>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      class: selectedClass,
    },
  });

  // Generate filter styles for real-time preview
  const filterStyle = {
    filter: generateFilterString(cameraSettings.enhancements),
    ...getVignetteStyle(cameraSettings.enhancements.vignette),
  };

  // Capture photo from webcam with enhancements
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: cameraSettings.videoConstraints.width,
      height: cameraSettings.videoConstraints.height,
    });

    if (imageSrc) {
      // Apply enhancements to captured image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply CSS filters to canvas context
        ctx!.filter = generateFilterString(cameraSettings.enhancements);
        ctx!.drawImage(img, 0, 0);

        const enhancedImageSrc = canvas.toDataURL(
          "image/jpeg",
          cameraSettings.screenshotQuality
        );
        setCapturedImage(enhancedImageSrc);

        // Convert to file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `student-photo-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              setCapturedFile(file);
            }
          },
          "image/jpeg",
          cameraSettings.screenshotQuality
        );
      };

      img.src = imageSrc;
      setShowForm(true);
    }
  }, [cameraSettings]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setCapturedFile(null);
    setShowForm(false);
  }, []);

  // Handle form submission
  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsLoading(true);

      const studentData = {
        ...data,
        profileImage: capturedFile,
      };

      const newStudent = await createStudent({
        // @ts-ignore
        data: studentData,
        Class: selectedClass,
      });

      onAddStudent(newStudent);
      toast.success("Student added successfully with photo");
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to add student");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setShowForm(false);
    setShowEnhancer(false);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        } else {
          setOpen(newOpen);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-4">
          <Camera className="mr-2 h-4 w-4" />
          Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showForm ? "Add Student Details" : "Take Student Photo"}
          </DialogTitle>
        </DialogHeader>

        {!showForm ? (
          // Camera interface
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera View */}
              <div className="lg:col-span-2">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                  <div style={filterStyle} className="w-full h-full">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat={cameraSettings.screenshotFormat as any}
                      videoConstraints={cameraSettings.videoConstraints}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "1/1" }}
                    />
                  </div>
                  {/* Grid overlay for alignment */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Vertical lines */}
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30"></div>
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30"></div>
                    {/* Horizontal lines */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30"></div>
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30"></div>
                    {/* Center point */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Enhancement Controls */}
              <div className="lg:col-span-1">
                {showEnhancer ? (
                  <CameraEnhancer
                    settings={cameraSettings}
                    onSettingsChange={setCameraSettings}
                  />
                ) : (
                  <div className="flex flex-col space-y-2">
                    <CameraEnhancer
                      settings={cameraSettings}
                      onSettingsChange={setCameraSettings}
                      isCompact={true}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEnhancer(true)}
                      className="w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Advanced Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={capturePhoto}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Camera className="mr-2 h-5 w-5" />
                Capture Enhanced Photo
              </Button>
              <Button onClick={handleClose} variant="outline" size="lg">
                Cancel
              </Button>
              {showEnhancer && (
                <Button
                  onClick={() => setShowEnhancer(false)}
                  variant="ghost"
                  size="lg"
                >
                  Hide Settings
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Form interface with captured photo
          <div className="space-y-4">
            {/* Photo preview */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={capturedImage!}
                  alt="Captured student photo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
                <Button
                  onClick={retakePhoto}
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full p-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Student form */}
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter student name" />
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
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={
                            selectedClass.split(" ").join("") +
                            "-" +
                            Math.floor(Math.random() * 1000)
                          }
                          {...field}
                          placeholder="Auto-generated if empty"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Adding Student..." : "Add Student"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={retakePhoto}
                    disabled={isLoading}
                  >
                    Retake Photo
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
