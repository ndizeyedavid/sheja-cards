"use client";

export const dynamic = 'force-dynamic';

import { IconInnerShadowTop } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import pb from "@/lib/pb";

export const runtime = 'edge';
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function page() {
  const { register, handleSubmit } = useForm();
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpReq, setOtpReq] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const studentId: any = searchParams?.get("student");

  const loginStaff = async (data: any) => {
    try {
      // fetch student school
      const student: any = await pb.collection("students").getOne(studentId, {
        expand: "school",
      });

      // check if staff email exist for that school
      const isStaffInSchool: any = await pb.collection("staff").getFullList({
        filter: `email = "${data.email}" && school = "${student.school}"`,
      });

      if (isStaffInSchool.length === 0)
        return toast.error(
          `You are not authorized in ${student.expand.school.name}`
        );

      // aight now the fella exists, time for the OTP auth
      const req = await pb.collection("staff").requestOTP(data.email);
      toast.success(`Login code sent to "${data.email}" successfully`);
      setOtpSent(true);
      setOtpReq(req);
    } catch (err: any) {
      console.error("ERROR: ", err);
      console.error("PB ERROR: ", err.response);
      toast.error("An error occured trying to send OTP");
    }
  };

  const loginWithOTP = async (e: any) => {
    try {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const otp = Array.from(form.elements)
        .filter((el) => el instanceof HTMLInputElement && el.name === "otp")
        .map((input: any) => input.value)
        .join("");

      const authData = await pb
        .collection("staff")
        .authWithOTP(otpReq.otpId, otp);

      toast.success("Login Successful");
      router.push(`/scan/${studentId}/${authData.record.role.toLowerCase()}`);
    } catch (err: any) {
      console.error("ERROR: ", err);
      console.error("PB ERROR: ", err.response);
      toast.error(err.message || "OTP Verification failed, Incorrect OTP");
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {!otpSent ? (
            <form onSubmit={handleSubmit(loginStaff)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <IconInnerShadowTop className="size-6" />
                    </div>
                    <span className="sr-only">Sheja Cards.</span>
                  </a>
                  <h1 className="text-xl font-bold">Welcome to Sheja Cards.</h1>
                  <div className="text-center text-sm">
                    This page is reserved for staff members only!
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mellow@sheja.com"
                      required
                      {...register("email")}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {!loading ? "Login" : <Loader2 />}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={loginWithOTP} className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <IconInnerShadowTop className="size-6" />
                  </div>
                  <span className="sr-only">Sheja Cards.</span>
                </a>
                <h1 className="text-xl font-bold">Sheja Cards.</h1>
                <div className="text-center text-sm">
                  Enter a 6 digit password sent to your email
                </div>
              </div>
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => {
                      const input = e.target;
                      if (input.value.length === 1) {
                        const next =
                          input.nextElementSibling as HTMLInputElement | null;
                        next?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      const input = e.currentTarget;
                      if (e.key === "Backspace" && input.value === "") {
                        const prev =
                          input.previousElementSibling as HTMLInputElement | null;
                        prev?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {!loading ? "Verify OTP" : <Loader2 />}
              </Button>
            </form>
          )}
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
