"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  IconBell,
  IconCheck,
  IconStar,
  IconTrash,
  IconUserCircle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "New Student Registration",
    message: "A new student has registered and needs approval.",
    time: "2 hours ago",
    type: "system",
    isRead: false,
    isImportant: true,
    icon: IconUserCircle,
  },
  {
    id: 2,
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight at 2 AM.",
    time: "5 hours ago",
    type: "alert",
    isRead: true,
    isImportant: true,
    icon: IconAlertCircle,
  },
  // Add more notifications...
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationsList, setNotificationsList] = useState(notifications);

  const filteredNotifications = notificationsList.filter((notification) => {
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "important") return notification.isImportant;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotificationsList(
      notificationsList.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const toggleImportant = (id: number) => {
    setNotificationsList(
      notificationsList.map((n) =>
        n.id === id ? { ...n, isImportant: !n.isImportant } : n
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationsList(notificationsList.filter((n) => n.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                Recent updates
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNotificationsList(
                    notificationsList.map((n) => ({ ...n, isRead: true }))
                  )
                }
              >
                Mark all as read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  All
                  <Badge variant="secondary" className="ml-2">
                    {notificationsList.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  onClick={() => setActiveTab("unread")}
                >
                  Unread
                  <Badge variant="secondary" className="ml-2">
                    {notificationsList.filter((n) => !n.isRead).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="important"
                  onClick={() => setActiveTab("important")}
                >
                  Important
                  <Badge variant="secondary" className="ml-2">
                    {notificationsList.filter((n) => n.isImportant).length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4",
                      !notification.isRead && "bg-muted/50"
                    )}
                  >
                    <notification.icon className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleImportant(notification.id)}
                      >
                        <IconStar
                          className={cn(
                            "h-4 w-4",
                            notification.isImportant &&
                              "fill-yellow-400 text-yellow-400"
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <IconBell className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No notifications
                    </h3>
                    <p className="text-muted-foreground">
                      You're all caught up! Check back later for new updates.
                    </p>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
