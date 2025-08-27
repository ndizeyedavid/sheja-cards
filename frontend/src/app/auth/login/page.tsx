"use client";

export const dynamic = "force-dynamic";

// Imports

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import { signin } from "@/services/auth.service";
import pb from "@/lib/pb";

export const runtime = "edge";
import { ApiError } from "@/types/api.types";

const loginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean(),
  })
  .required();

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [schoolCount, setSchoolCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const count = await pb.collection("school").getFullList();
          setSchoolCount(count.length);
        } catch (error) {
          console.error("Failed to fetch school count:", error);
        }
      })();
      setIsNew(searchParams?.get("new") ? true : false);
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signin(data);
      toast.success("Login successful");
      router.replace(
        `/dashboard${searchParams?.get("new") ? "?new=true" : ""}`
      );
      reset();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.message || "Login failed";
      toast.error(
        apiError.status === 400 ? "Incorrect email or password" : errorMessage
      );
    }
  };

  return (
    <section className="w-full min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden rounded-[0_10px_10px_0]">
        <div className="absolute inset-0 bg-black/70"></div>
        <Image
          src="/login-bg.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          loading="lazy"
          sizes="fill"
          className="opacity-70"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="space-y-8 text-center max-w-md">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <IconInnerShadowTop className="!size-5" />
              </div>
              <span className="text-2xl font-bold">SHEJA Cards</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                Welcome to the future of Student cards
              </h1>
              <p className="text-lg text-white/90">
                Join thousands of schools who trust our platform to streamline
                their student cards management.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{schoolCount}</div>
                <div className="text-sm text-white/80">Active Schools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-white/80">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardContent className="p-8 space-y-8">
            {/* Mobile Brand Header */}
            <div className="lg:hidden text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconInnerShadowTop className="!size-5" />
                </div>
                <span className="text-xl font-bold">SHEJA Cards</span>
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold">Sign in to your account</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 h-12 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      {...register("email")}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 h-12 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      {...register("password")}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forget-password"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="flex items-center justify-center">
              <span className="text-center">
                Don't have an account?{" "}
                <Link href="/auth/signup">
                  <Button variant="link">Signup</Button>
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
