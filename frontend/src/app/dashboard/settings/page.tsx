"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { IconBuilding } from "@tabler/icons-react";
import { UploadIcon, Loader2, Palette } from "lucide-react";
import { ColorPicker } from "@/components/form-input/ColorPicker";
import { PhoneInput } from "@/components/form-input/PhoneInput";
import { toast } from "sonner";
import {
  fetchSchool,
  updateSchool,
  updateSchoolLogo,
  updateSchoolColors,
} from "@/services/school.service";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";
import pb from "@/lib/pb";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: null,
      primaryColor: "#FFFFFF",
      secondaryColor: "#FFFFFF",
      accentColor: "#FFFFFF",
    },
  });

  const { handleSubmit, control, reset, setValue, watch } = form;

  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedPhone = watch("phone");
  const watchedAddress = watch("address");
  const watchedLogo = watch("logo");
  const watchedPrimaryColor = watch("primaryColor");
  const watchedSecondaryColor = watch("secondaryColor");
  const watchedAccentColor = watch("accentColor");

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        setIsLoadingData(true);
        const data = await fetchSchool();
        setSchoolData(data);
        setValue("name", data.name || "");
        setValue("email", data.email || "");
        setValue("phone", data.phone || "");
        setValue("address", data.address || "");
        setValue("primaryColor", data.colorPalette?.primary || "#FFFFFF");
        setValue("secondaryColor", data.colorPalette?.secondary || "#FFFFFF");
        setValue("accentColor", data.colorPalette?.accent || "#FFFFFF");
      } catch (error: any) {
        toast.error("Failed to load school data");
      } finally {
        setIsLoadingData(false);
      }
    };
    loadSchoolData();
  }, [setValue]);

  const onSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      await updateSchool({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      await updateSchoolColors({
        primary: formData.primaryColor,
        secondary: formData.secondaryColor,
        accent: formData.accentColor,
      });
      if (formData.logo && formData.logo.length > 0) {
        await updateSchoolLogo(formData.logo[0]);
      }
      toast.success("School settings updated successfully");
    } catch (error) {
      toast.error("Failed to update school settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBuilding className="h-5 w-5" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading school data...</span>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter school name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter email"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter address" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <PhoneInput {...field} placeholder="07********" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              {/* Card Design settings */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    School Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading school data...</span>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Logo</FormLabel>
                            <FormControl>
                              <FileUpload
                                accept="image/*"
                                maxSize={5 * 1024 * 1024}
                                onValueChange={field.onChange}
                                value={field.value ? [field.value] : []}
                              >
                                <FileUploadDropzone className="min-h-[120px]">
                                  <div className="flex flex-col items-center gap-2">
                                    <UploadIcon className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                      Drag & drop or click to upload
                                    </p>
                                  </div>
                                  <FileUploadTrigger asChild>
                                    <Button variant="secondary" size="sm">
                                      Select File
                                    </Button>
                                  </FileUploadTrigger>
                                </FileUploadDropzone>
                                {field.value &&
                                  (field.value as File[]).map((file: File) => (
                                    <FileUploadItem
                                      key={file.name}
                                      value={file}
                                    >
                                      <FileUploadItemPreview />
                                      <FileUploadItemMetadata />
                                    </FileUploadItem>
                                  ))}
                              </FileUpload>
                            </FormControl>
                            <FormDescription>
                              Allowed: png, jpg, jpeg (max: 5MB)
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="accentColor"
                        render={({ field }) => (
                          <FormItem className="invisible">
                            <FormLabel>Accent Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview card */}
              <Card className="w-[30%]">
                <div
                  className="bg-white shadow-lg border border-gray-200 mx-auto relative overflow-hidden"
                  style={{ width: "213px", height: "338px" }}
                >
                  <div className="relative h-20 bg-white flex flex-col items-center justify-center px-4">
                    <div className="w-12 h-10 rounded mb-1 flex items-center justify-center">
                      {watchedLogo && watchedLogo.length > 0 ? (
                        <Image
                          src={URL.createObjectURL(watchedLogo[0])}
                          width={200}
                          height={200}
                          alt="School Logo"
                        />
                      ) : schoolData?.logo ? (
                        <Image
                          src={pb.files.getURL(schoolData, schoolData.logo)}
                          width={200}
                          height={200}
                          alt="School Logo"
                        />
                      ) : null}
                    </div>
                    <div className="text-center">
                      <h2
                        className="font-bold leading-tight text-[7px] text-black"
                        style={{
                          color: watchedSecondaryColor,
                        }}
                      >
                        {watchedName || "School Name"}
                      </h2>
                      <p className="text-gray-700 leading-tight text-[4.5px]">
                        {watchedAddress || "School Address"}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)",
                        background: watchedPrimaryColor,
                        height: "100vh",
                      }}
                    />
                    <div className="relative pt-8 pb-6 flex flex-col items-center">
                      <div
                        className="rounded-full bg-white p-1 mb-4"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            src={""}
                            alt="Student"
                            className="object-cover"
                          />
                          <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-center px-2">
                        <h3 className="font-bold text-white uppercase leading-tight mb-1 text-[13px]">
                          Student Name
                        </h3>
                        <p className="text-white leading-tight text-[11px]">
                          Class Here
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-2 text-white relative z-10 mt-[-19px]">
                    <div className="space-y-1 text-[9px]">
                      {["Reg No", "Gender", "DOB", "Valid Year"].map(
                        (label, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className="w-12">{label}</span>
                            <span className="w-1">:</span>
                            <span className="truncate bg-gray-400/70 w-[80px] h-2 rounded" />
                          </div>
                        )
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div
                        className="shadow-md rounded-md p-1 flex items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <QRCodeSVG
                          value="http://localhost:3000/scan/"
                          size={32}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || isLoadingData}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
