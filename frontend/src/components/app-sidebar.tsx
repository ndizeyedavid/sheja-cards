"use client";
import {
  IconBook,
  IconCertificate,
  IconDashboard,
  IconUsers,
  IconInnerShadowTop,
  IconUserUp,
  IconIdBadge2,
  IconFileIsr,
  IconChecklist,
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
import pb from "@/lib/pb";

const user: any = pb.authStore.record;

const data = {
  user: {
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
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
      title: "Subjects",
      url: "/dashboard/subjects",
      icon: IconCertificate,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconChecklist,
    },
    {
      title: "Student Cards",
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
