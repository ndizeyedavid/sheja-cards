"use client";

import pb from "@/lib/pb";

export default function RenderGreeting() {
  const uname: any = pb.authStore.record;
  console.log(uname);
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
    <span>
      {greeting} {uname?.name?.split(" ")[0]}
    </span>
  );
}
