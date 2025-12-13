"use client";

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
import { OTPInput } from "@/components/ui/otp-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import pb from "@/lib/pb";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpId, setOtpId] = useState("");
  const router = useRouter();

  const emailForm = useForm<EmailFormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OTPFormData>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(otpSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      // Check if email exists in staff collection and is a teacher
      const staffRecords = await pb.collection("staff").getFullList({
        filter: `email = "${data.email}"`,
      });

      if (staffRecords.length === 0) {
        toast.error("Email not found in our system");
        setIsLoading(false);
        return;
      }

      const staff = staffRecords[0];

      // Check if user is a teacher
      if (staff.role !== "TEACHER") {
        toast.error("Only teachers can access this portal");
        setIsLoading(false);
        return;
      }

      // Request OTP from PocketBase and get otpId
      const req = await pb.collection("staff").requestOTP(data.email);

      setUserEmail(data.email);
      setOtpId(req.otpId);
      setStep("otp");
      toast.success("OTP sent to your email");
    } catch (error: any) {
      console.error("Error requesting OTP:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      // Authenticate with OTP using otpId and OTP password
      const authData = await pb
        .collection("staff")
        .authWithOTP(otpId, data.otp);

      if (authData) {
        toast.success("Login successful!");
        router.push("/teacher/dashboard");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-left" />
      <div className="h-screen flex items-center justify-center">
        <div className="w-full h-full grid lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="relative max-w-sm m-auto w-full flex flex-col items-center p-8 outline-0 sm:outline-2 outline-border/40 dark:outline-border/80 outline-offset-0.5">
            <div className="max-sm:hidden absolute border-t top-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8" />
            <div className="max-sm:hidden absolute border-b bottom-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8" />
            <div className="max-sm:hidden absolute border-s left-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8" />
            <div className="max-sm:hidden absolute border-e right-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8" />

            <div className="max-sm:hidden absolute border-t -top-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6" />
            <div className="max-sm:hidden absolute border-b -bottom-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6" />
            <div className="max-sm:hidden absolute border-s -left-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6" />
            <div className="max-sm:hidden absolute border-e -right-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6" />

            <IconInnerShadowTop className="h-9 w-9" />
            <p className="mt-4 text-xl font-semibold tracking-tight">
              Welcome Back, Teacher
            </p>
            <p className="text-sm font-regular tracking-tight text-muted-foreground">
              {step === "email"
                ? "Enter your email to continue to your account"
                : `Enter the OTP sent to ${userEmail}`}
            </p>

            {/* Email Step */}
            {step === "email" && (
              <Form {...emailForm}>
                <form
                  className="w-full space-y-4 mt-7"
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Type your email address"
                            className="w-full"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link
                    href="/teacher/auth/forgot-email"
                    className="text-sm block underline text-muted-foreground text-right"
                  >
                    Forgot your email?
                  </Link>
                  <Button
                    type="submit"
                    className="mt-3 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Continue with Email"}
                  </Button>
                </form>
              </Form>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <Form {...otpForm}>
                <form
                  className="w-full space-y-4 mt-7"
                  onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                >
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>One-Time Password</FormLabel> */}
                        <FormControl>
                          <OTPInput
                            maxLength={6}
                            disabled={isLoading}
                            containerClassName="justify-center"
                            inputClassName="border-2 hover:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2 mt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setStep("email");
                        emailForm.reset();
                        otpForm.reset();
                        setOtpId("");
                      }}
                      disabled={isLoading}
                    >
                      Back to Email
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Didn't receive the OTP?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => onEmailSubmit({ email: userEmail })}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              </Form>
            )}

            <div className="mt-5 space-y-5"></div>
          </div>

          {/* Right Side - Illustration */}
          <div className="bg-muted hidden lg:block border-l relative">
            <div className="flex items-center justify-center gap-2 absolute right-8 top-7">
              <div className="flex items-center justify-center">
                <IconInnerShadowTop className="!size-6" />
              </div>
              <span className="text-lg font-bold relative top-0.5">
                SHEJA Cards
              </span>
            </div>

            <div className="h-full w-full flex items-center justify-center">
              <Image
                src="/assets/images/auth.png"
                width={500}
                height={500}
                alt="Login illustration"
                className="w-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
