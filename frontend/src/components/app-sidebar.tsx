"use client";
import {
  IconBook,
  IconCertificate,
  IconDashboard,
  IconUsers,
  IconInnerShadowTop,
  IconUserUp,
  IconIdBadge2,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@shejacards.com",
    avatar: "/avatars/admin.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: IconUsers,
    },
    {
      title: "Classes",
      url: "/dashboard/classes",
      icon: IconBook,
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: IconUserUp,
    },
    {
      title: "Templates",
      url: "/dashboard/templates",
      icon: IconCertificate,
    },
    {
      title: "Card Generator",
      url: "/dashboard/card-generator",
      icon: IconIdBadge2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SHEJA Cards.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
