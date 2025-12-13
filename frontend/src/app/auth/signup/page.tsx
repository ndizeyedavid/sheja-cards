"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
// @ts-ignore
import { PasswordInput } from "@/components/ui/password-input";
// @ts-ignore
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import RenderText from "./RenderText";
import { Loader2, Phone, UploadIcon, XIcon } from "lucide-react";
import { PhoneInput } from "@/components/form-input/PhoneInput";
import { ColorPicker } from "@/components/form-input/ColorPicker";
import { AnimatePresence } from "framer-motion";
import { MotionSlide } from "@/components/motion/MotionSlide";
import { signup } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function page() {
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const totalSteps = 7; // Updated from 6 to 7
  const router = useRouter();

  const form = useForm();

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      if (step < totalSteps - 1) {
        if (step == 2) {
          if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
        }

        setStep(step + 1);
      } else {
        const response = await signup(formData);
        console.log(response);
        toast.success("Account created successfully");
        router.push("/auth/login?new=true");
      }
    } catch (error: any) {
      console.error("ERROR: ", error);
      console.error("PB ERROR: ", error.response);
      toast.error("Account creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-background dark:to-muted/20 p-4">
      <div className="space-y-4 w-full max-w-lg">
        <div className="flex items-center justify-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300 ease-in-out",
                  index <= step ? "bg-primary" : "bg-primary/30",
                  index < step && "bg-primary"
                )}
              />
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5",
                    index < step ? "bg-primary" : "bg-primary/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Register a new account</CardTitle>
            <CardDescription>{RenderText({ step })}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <MotionSlide key={step}>
                {step === 0 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-primary">
                            Welcome to SHEJA!
                          </h3>
                          <p className="text-muted-foreground">
                            We&apos;re excited to help you set up your
                            school&apos;s digital presence. This registration
                            process consists of 6 simple steps:
                          </p>
                        </div>

                        <div className="grid gap-4 pl-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm">Personal Information</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm">Account Security</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm">Identity Verification</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm">School Details</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm">School Branding</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm">Final Review</p>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4 bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            Please ensure you have the following ready:
                            <br />• Valid ID number
                            <br />• School logo (if available)
                            <br />• School contact information
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" size="sm" className="font-medium">
                          Get Started
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 1 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-y-4"
                    >
                      <FormField
                        key="fname"
                        control={control}
                        name="fname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="lname"
                        control={control}
                        name="lname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="phone"
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                {...field}
                                placeholder="07***********"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          className="font-medium"
                          size="sm"
                          onClick={handleBack}
                          disabled={Number(step) === 0}
                        >
                          Back
                        </Button>
                        <Button type="submit" size="sm" className="font-medium">
                          {Number(step) === 5 ? "Submit" : "Next"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 2 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-y-4"
                    >
                      <FormField
                        key="email"
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your login email"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="password"
                        control={control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <PasswordInput
                                {...field}
                                placeholder="Enter your password"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="confirmPassword"
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                              <PasswordInput
                                {...field}
                                placeholder="Confirm your password"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          className="font-medium"
                          size="sm"
                          onClick={handleBack}
                          disabled={Number(step) === 0}
                        >
                          Back
                        </Button>
                        <Button type="submit" size="sm" className="font-medium">
                          {Number(step) === 5 ? "Submit" : "Next"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 3 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-y-4"
                    >
                      <FormField
                        key="idNumber"
                        control={control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your ID Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="XXXXXXXXXXXXXXXXXXX"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription>
                              For security purposes, it&apos;s essential to
                              confirm your national ID
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          className="font-medium"
                          size="sm"
                          onClick={handleBack}
                          disabled={Number(step) === 0}
                        >
                          Back
                        </Button>
                        <Button type="submit" size="sm" className="font-medium">
                          {Number(step) === 5 ? "Submit" : "Next"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 4 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-y-4"
                    >
                      <FormField
                        key="schoolName"
                        control={control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter the name of your school"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="schoolEmail"
                        control={control}
                        name="schoolEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter the email of your school"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="schoolPhone"
                        control={control}
                        name="schoolPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Phone Number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                {...field}
                                placeholder="07********"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="schoolLocation"
                        control={control}
                        name="schoolLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Location</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Province / District / Sector"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          className="font-medium"
                          size="sm"
                          onClick={handleBack}
                          disabled={Number(step) === 0}
                        >
                          Back
                        </Button>
                        <Button type="submit" size="sm" className="font-medium">
                          {Number(step) === 5 ? "Submit" : "Next"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 5 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-y-4"
                    >
                      <FormField
                        key="schoolLogo"
                        control={control}
                        name="schoolLogo"
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
                                {field.value && field.value.length > 0 && (
                                  <div className="mt-4 space-y-3">
                                    {field.value.map((file: File) => (
                                      <div
                                        key={file.name}
                                        className="space-y-2"
                                      >
                                        <div className="relative w-full max-w-xs border rounded-lg overflow-hidden bg-muted p-2">
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt="School Logo Preview"
                                            className="w-full h-auto object-contain max-h-[200px]"
                                          />
                                        </div>
                                        <FileUploadItem
                                          key={file.name}
                                          value={file}
                                        >
                                          <FileUploadItemPreview />
                                          <FileUploadItemMetadata />
                                        </FileUploadItem>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </FileUpload>
                            </FormControl>
                            <FormDescription>
                              Allowed: png, jpg, jpeg (max: 5MB)
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="primaryColor"
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
                        key="secondaryColorar"
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
                        key="accentColor"
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

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          className="font-medium"
                          size="sm"
                          onClick={handleBack}
                          disabled={Number(step) === 0}
                        >
                          Back
                        </Button>
                        <Button type="submit" size="sm" className="font-medium">
                          {"Next"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 6 && (
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid gap-y-4"
                    >
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold">
                                Personal Information
                              </h3>
                              <div className="grid gap-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    First Name:
                                  </span>
                                  <span>{form.getValues().fname}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Last Name:
                                  </span>
                                  <span>{form.getValues().lname}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Phone:
                                  </span>
                                  <span>{form.getValues().phone}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Email:
                                  </span>
                                  <span>{form.getValues().email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    ID Number:
                                  </span>
                                  <span>{form.getValues().idNumber}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold">
                                School Information
                              </h3>
                              <div className="grid gap-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    School Name:
                                  </span>
                                  <span>{form.getValues().schoolName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    School Email:
                                  </span>
                                  <span>{form.getValues().schoolEmail}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    School Phone:
                                  </span>
                                  <span>{form.getValues().schoolPhone}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Location:
                                  </span>
                                  <span>{form.getValues().schoolLocation}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold">School Branding</h3>
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                  Logo:
                                </span>
                                {form.getValues().qcjk6lW5 && (
                                  <div className="h-12 w-12 rounded-lg border bg-muted">
                                    <img
                                      src={URL.createObjectURL(
                                        form.getValues().schoolLogo[0]
                                      )}
                                      alt="School Logo"
                                      className="h-full w-full object-contain p-1"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                  Primary Color:
                                </span>
                                <div
                                  className="h-4 w-4 rounded-full border"
                                  style={{
                                    backgroundColor:
                                      form.getValues().primaryColor,
                                  }}
                                />
                                <span>{form.getValues().primaryColor}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                  Secondary Color:
                                </span>
                                <div
                                  className="h-4 w-4 rounded-full border"
                                  style={{
                                    backgroundColor:
                                      form.getValues().secondaryColor,
                                  }}
                                />
                                <span>{form.getValues().secondaryColor}</span>
                              </div>
                              {form.getValues().accentColor && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">
                                    Accent Color:
                                  </span>
                                  <div
                                    className="h-4 w-4 rounded-full border"
                                    style={{
                                      backgroundColor:
                                        form.getValues().accentColor,
                                    }}
                                  />
                                  <span>{form.getValues().accentColor}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4 bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            Please review all the information above carefully
                            before submitting. By clicking submit, you confirm
                            that all provided information is correct.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          className="font-medium"
                          size="sm"
                          onClick={handleBack}
                          disabled={Number(step) === 0}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="font-medium"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </MotionSlide>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
