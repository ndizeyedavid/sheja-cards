"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconBell,
  IconEdit,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/avatars/admin.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
              >
                <IconEdit className="h-4 w-4" />
                <span className="sr-only">Change avatar</span>
              </Button>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">Admin User</h2>
              <p className="text-muted-foreground">System Administrator</p>
              <p className="text-sm text-muted-foreground">
                Member since January 2024
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Settings */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1234567890" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifs">Email Notifications</Label>
                <Switch id="emailNotifs" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="updates">Product Updates</Label>
                <Switch id="updates" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing">Marketing Emails</Label>
                <Switch id="marketing" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLock className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
