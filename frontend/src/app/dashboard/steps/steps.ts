"use client";

import { Tour } from "nextstepjs";

export const steps: Tour[] = [
  {
    tour: "mainTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome",
        content: "Let's get started with NextStep!",
        selector: "#step1",
        side: "right",
        showControls: true,
        showSkip: true,
      },
      // More steps...
    ],
  },
];
