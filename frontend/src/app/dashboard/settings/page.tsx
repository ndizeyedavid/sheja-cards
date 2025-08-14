"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  IconBuilding,
  IconMail,
  IconPalette,
  IconSettings,
  IconShield,
  IconDatabase,
} from "@tabler/icons-react";
import { Palette, UploadIcon, Loader2 } from "lucide-react";
import { ColorPicker } from "@/components/form-input/ColorPicker";
import { PhoneInput } from "@/components/form-input/PhoneInput";
import { toast } from "sonner";
import {
  fetchSchool,
  updateSchool,
  updateSchoolLogo,
  updateSchoolColors,
} from "@/services/school.service";

export default function page() {
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

  const { handleSubmit, control, reset, setValue } = form;

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        setIsLoadingData(true);
        const data = await fetchSchool();
        setSchoolData(data);

        // Set form values
        setValue("name", data.name || "");
        setValue("email", data.email || "");
        setValue("phone", data.phone || "");
        setValue("address", data.address || "");
        setValue("primaryColor", data.colorPalette?.primary || "#FFFFFF");
        setValue("secondaryColor", data.colorPalette?.secondary || "#FFFFFF");
        setValue("accentColor", data.colorPalette?.accent || "#FFFFFF");
      } catch (error: any) {
        console.error("Error loading school data:", error.response);
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

      // Update school information
      await updateSchool({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      // Update colors
      await updateSchoolColors({
        primary: formData.primaryColor,
        secondary: formData.secondaryColor,
        accent: formData.accentColor,
      });

      // Update logo if provided
      if (formData.logo && formData.logo.length > 0) {
        await updateSchoolLogo(formData.logo[0]);
      }

      toast.success("School settings updated successfully");
    } catch (error) {
      console.error("Error updating school settings:", error);
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
            {/* School Information */}
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
                            <Input
                              {...field}
                              placeholder="Enter school name"
                              autoComplete="off"
                            />
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
                              placeholder="Enter school email"
                              autoComplete="off"
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
                            <Input
                              {...field}
                              placeholder="Enter school address"
                              autoComplete="off"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <PhoneInput
                              {...field}
                              placeholder="07********"
                              autoComplete="off"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* School design */}
            <Card>
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
                              maxSize={5 * 1024 * 1024} // 5MB
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
                                  <FileUploadItem key={file.name} value={file}>
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
                              value={field.value || "#FFFFFF"}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Choose your school&apos;s primary color
                          </FormDescription>
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
                              value={field.value || "#FFFFFF"}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Choose your school&apos;s secondary color
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accent Color (Optional)</FormLabel>
                          <FormControl>
                            <ColorPicker
                              value={field.value || "#FFFFFF"}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Choose an optional accent color
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || isLoadingData}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
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
