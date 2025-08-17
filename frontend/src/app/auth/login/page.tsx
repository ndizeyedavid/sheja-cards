"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Blocks } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconInnerShadowTop, IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

import { useRouter, useSearchParams } from "next/navigation";
import { signin } from "@/services/auth.service";
import pb from "@/lib/pb";

const loginSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean(),
  })
  .required();

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [schoolCount, setSchoolCount] = useState<number>(0);
  const searcParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const count = await pb.collection("school").getFullList();
      setSchoolCount(count.length);
    })();
    setIsNew(searcParams.get("new") ? true : false);
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
      console.log(data);
      const user = await signin(data);
      // console.log(user);
      toast.success("Login successful");
      router.replace(`/dashboard${searcParams.get("new") ? "?new=true" : ""}`);
      reset();
    } catch (error: any) {
      console.error(error.response);
      const errorMessage: string = error.response?.message || "Login failed";
      toast.error(
        error.response.status === 400
          ? "Incorrect email or password"
          : errorMessage
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" {...register("remember")} />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="forget-password">
                  <Button type="button" variant="link" className="px-0 text-sm">
                    Forgot password?
                  </Button>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="signup">
                <Button variant="link" className="px-0 font-medium">
                  Sign up for free
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent signup notification dialog box */}
      <AlertDialog open={isNew}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Thank you for choosing Sheja cards
            </AlertDialogTitle>
            <AlertDialogDescription>
              It's a great honor for sheja cards to be serving you in managing
              your school's student cards. Your account and school's account
              have been successfully created now login to proceed to your
              dashboard
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsNew(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
