"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStudent } from "@/services/students.service";
import {
  Camera,
  RotateCcw,
  Settings,
  X,
  Check,
  ArrowLeft,
  Download,
  Share,
  Grid3X3,
} from "lucide-react";
import Webcam from "react-webcam";
import {
  CameraEnhancer,
  generateFilterString,
  getVignetteStyle,
} from "@/components/camera/CameraEnhancer";
import {
  CameraSettings,
  defaultCameraSettings,
} from "@/components/camera/CameraConfig";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchClasses } from "@/services/classes.service";
import { Classes } from "@/types/classes.types";

export default function CameraPage() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(
    defaultCameraSettings
  );

  const webcamRef = useRef<Webcam>(null);

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

  // Download photo
  const downloadPhoto = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.download = `photo-${Date.now()}.jpg`;
      link.href = capturedImage;
      link.click();
    }
  }, [capturedImage]);

  // Share photo (if Web Share API is available)
  const sharePhoto = useCallback(async () => {
    if (capturedFile && navigator.share) {
      try {
        await navigator.share({
          files: [capturedFile],
          title: "Student Photo",
        });
      } catch (error) {
        console.log("Error sharing:", error);
        // Fallback to download
        downloadPhoto();
      }
    } else {
      downloadPhoto();
    }
  }, [capturedFile, downloadPhoto]);

  // Handle photo approval and auto-save
  const approvePhoto = async () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }

    if (!capturedFile) {
      toast.error("No photo to save");
      return;
    }

    try {
      setIsLoading(true);

      // Auto-generate student data with just the photo and class
      const studentData = {
        name: "",
        gender: "",
        dateOfBirth: "",
        registrationNumber: "",
        profileImage: capturedFile,
      };

      const newStudent = await createStudent({
        data: studentData,
        Class: selectedClass,
      });

      toast.success("Photo saved successfully! Student can be edited later.");

      // Reset and go back to camera
      setCapturedImage(null);
      setCapturedFile(null);
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save photo");
      console.error(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  // Get available classes (you might want to fetch this from your API)
  useEffect(() => {
    (async () => {
      const classes: Classes[] = await fetchClasses();
      setClasses(classes);
    })();
  }, []);
  if (showForm && capturedImage) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between text-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={retakePhoto}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Approve Photo</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Photo preview - Full screen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full">
            <img
              src={capturedImage}
              alt="Captured student photo"
              className="w-full aspect-square rounded-2xl object-cover shadow-2xl"
            />

            {/* Class info overlay */}
            {selectedClass && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {classes.find((c) => c.id === selectedClass)?.name ||
                  "Unknown Class"}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex gap-4 max-w-sm mx-auto">
            <Button
              onClick={retakePhoto}
              variant="outline"
              size="lg"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={isLoading}
            >
              <X className="mr-2 h-5 w-5" />
              Retake
            </Button>
            <Button
              onClick={approvePhoto}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading || !selectedClass}
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Approve & Save
                </>
              )}
            </Button>
          </div>

          {!selectedClass && (
            <p className="text-center text-white/70 text-sm mt-2">
              Please select a class before approving
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Camera</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={`text-white hover:bg-white/20 ${
              showGrid ? "bg-white/20" : ""
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-screen">
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

        {/* Grid overlay */}
        {showGrid && (
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
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        {/* Class Selection - Top Row */}
        <div className="px-4 pt-4 pb-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="bg-white/15 backdrop-blur-sm border-white/30 text-white h-12 text-base rounded-xl">
              <SelectValue placeholder="Select class for student" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {classes.map((cls) => (
                <SelectItem
                  key={cls.id}
                  value={cls.name + " " + cls.combination}
                  className="text-base py-3"
                >
                  {cls.name + " " + cls.combination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Controls - Bottom Row */}
        <div className="px-4 pb-6 pt-2">
          <div className="flex items-center justify-between">
            {/* Left: Settings */}
            <Sheet open={showEnhancer} onOpenChange={setShowEnhancer}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/20 rounded-full w-14 h-14 p-0 backdrop-blur-sm"
                >
                  <Settings className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-xl">Camera Settings</SheetTitle>
                  <SheetDescription className="text-base">
                    Adjust photo enhancement settings for better quality
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <CameraEnhancer
                    settings={cameraSettings}
                    onSettingsChange={setCameraSettings}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Center: Capture Button */}
            <Button
              onClick={capturePhoto}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 active:bg-gray-200 rounded-full size-16 p-0 shadow-2xl transition-all duration-150 active:scale-95"
            >
              <Camera className="size-7" />
            </Button>

            {/* Right: Grid Toggle */}
            <Button
              onClick={() => setShowGrid(!showGrid)}
              variant="ghost"
              size="lg"
              className={`rounded-full w-14 h-14 p-0 backdrop-blur-sm transition-colors ${
                showGrid
                  ? "text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Grid3X3 className="h-7 w-7" />
            </Button>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <Button
              onClick={() => setCameraSettings(defaultCameraSettings)}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              <span className="text-sm">Reset</span>
            </Button>

            <div className="h-6 w-px bg-white/30"></div>

            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.download = `camera-settings-${Date.now()}.json`;
                link.href = URL.createObjectURL(
                  new Blob([JSON.stringify(cameraSettings, null, 2)], {
                    type: "application/json",
                  })
                );
                link.click();
              }}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2"
            >
              <Download className="h-5 w-5 mr-2" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
