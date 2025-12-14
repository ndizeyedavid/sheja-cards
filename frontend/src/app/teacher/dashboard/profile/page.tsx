"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import pb from "@/lib/pb";
import { toast } from "sonner";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconShield,
  IconCheck,
  IconEdit,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface TeacherInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  created: string;
}

export default function ProfilePage() {
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const loadTeacherInfo = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.record) {
          const teacherData: TeacherInfo = {
            id: pb.authStore.record.id,
            name: pb.authStore.record.name,
            email: pb.authStore.record.email,
            role: pb.authStore.record.role,
            phone: pb.authStore.record.phone,
            avatar: pb.authStore.record.avatar,
            created: pb.authStore.record.created,
          };

          setTeacher(teacherData);
          form.reset({
            name: teacherData.name,
            email: teacherData.email,
            phone: teacherData.phone || "",
          });
        }
      } catch (error) {
        console.error("Error loading teacher info:", error);
        toast.error("Failed to load profile information");
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherInfo();
  }, [form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const updated = await pb.collection("staff").update(teacher?.id || "", {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      setTeacher({
        ...teacher!,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <IconUser className="w-5 h-5" />
                Personal Information
              </span>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <IconEdit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSaving} className="gap-2">
                      <IconCheck className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {teacher?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">{teacher?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <IconMail className="w-4 h-4" />
                      Email Address
                    </p>
                    <p className="font-medium">{teacher?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <IconPhone className="w-4 h-4" />
                      Phone Number
                    </p>
                    <p className="font-medium">
                      {teacher?.phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <IconShield className="w-4 h-4" />
                      Role
                    </p>
                    <p className="font-medium capitalize">{teacher?.role}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {teacher?.created
                        ? new Date(teacher.created).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your account security and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                ✓ Password Security
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Your password is secure and meets all requirements
              </p>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your experience and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your classes
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Get weekly class performance summaries
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the interface
                </p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
