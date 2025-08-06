"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconBuildingLighthouse,
  IconCertificate,
  IconFileText,
  IconTemplate,
} from "@tabler/icons-react";
import React from "react";

const features = [
  {
    icon: IconTemplate,
    title: "Professional Templates",
    description: "Ready-to-use templates for all your school documents",
  },
  {
    icon: IconFileText,
    title: "Smart Forms",
    description: "Interactive forms with built-in validation and automation",
  },
  {
    icon: IconBuildingLighthouse,
    title: "Custom Branding",
    description: "Personalize templates with your school's branding",
  },
];

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative">
            <IconCertificate className="h-24 w-24 text-primary" />
            <div className="absolute -right-2 -top-5">
              <Badge variant="default">Coming Soon</Badge>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-bold tracking-tight">
            Templates Dashboard
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            We're crafting something amazing! A powerful template system to
            streamline your document creation process.
          </p>

          <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
