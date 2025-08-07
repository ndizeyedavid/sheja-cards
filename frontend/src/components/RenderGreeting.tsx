"use client";

import pb from "@/lib/pb";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function RenderGreeting() {
  const [uname, setUname] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    try {
      setUname(pb.authStore.record?.name);
    } catch (err) {
      setUname("N/A");
      console.error("failed to fetch name in render greeting", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning,";
  } else if (hour < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }

  return (
    <span className="flex items-center gap-3">
      {greeting}
      {!loading ? (
        uname?.split(" ")[0]
      ) : (
        <Skeleton className="w-[170px] h-8 rounded" />
      )}
    </span>
  );
}
