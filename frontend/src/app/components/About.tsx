"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Award,
  Briefcase,
  Code,
  Sparkles,
  Building,
  LineChart,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

interface StatItemProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  decimalPlaces?: number;
  color?: string;
}

const StatItem = ({
  value,
  label,
  icon,
  delay = 0,
  decimalPlaces = 0,
  color = "from-primary to-primary/70",
}: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={cn(
        "group border-border/30 bg-card relative overflow-hidden rounded-xl border p-6",
        resolvedTheme === "dark"
          ? "shadow-xl shadow-black/5"
          : "shadow-lg shadow-black/[0.03]"
      )}
    >
      <div
        className={cn(
          "absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-3xl",
          color
        )}
      />

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            color
          )}
        >
          {icon}
        </div>

        <div className="flex flex-col">
          <h3 className="flex items-baseline text-3xl font-bold tracking-tight">
            {value}
            {/* <NumberTicker
              value={value}
              decimalPlaces={decimalPlaces}
              className="tabular-nums"
            /> */}
            <span className="ml-1 text-sm font-medium opacity-70">+</span>
          </h3>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function About() {
  const aboutRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 });

  return (
    <section
      className="relative w-full overflow-hidden py-16 md:py-24"
      id="about"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header Section with Badge */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 flex justify-center"
          >
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium"
            >
              <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
              About
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            About This Project
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground mt-4 text-xl"
          >
            Bringing next-gen student cards
          </motion.p>
        </div>

        {/* About Content Section */}
        <div ref={aboutRef} className="relative mx-auto mb-20">
          <div className="grid gap-16 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="relative space-y-6"
            >
              <div className="from-primary/80 to-primary/60 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg">
                <Zap className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Project Mission
              </h2>

              <p className="text-muted-foreground text-base leading-relaxed">
                To empower schools with innovative digital solutions that
                streamline student card management, enhance operational
                efficiency, and deliver lasting value in an evolving educational
                landscape.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative space-y-6"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/80 to-blue-500/60 text-white shadow-lg">
                <LineChart className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Project Vision
              </h2>

              <p className="text-muted-foreground text-base leading-relaxed">
                To be the leading provider of transformative student card
                management solutions, recognized for our innovation,
                reliability, and commitment to educational excellence.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Timeline Section */}
        <div ref={timelineRef} className="relative mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={
              timelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl"
          >
            Development Journey
          </motion.h2>

          <div className="border-border/60 relative ml-4 border-l pl-8 md:ml-0 md:border-none md:pl-0">
            {[
              {
                year: "Sept 2024",
                title: "Founded",
                description:
                  "The first initial idea just popped up and the development of the very first MVP started but tailored to one school(ESSA Nyarugunga).",
              },
              {
                year: "Nov 2024",
                title: "First Try",
                description:
                  "The first MVP was tested in production and successfully 986 student cards were created effortlessly. CodeNamed: ECM",
              },
              {
                year: "Feb 2025",
                title: "Innovation Kick-in",
                description:
                  "This time I was wondering whether it would be possible to make a nationwide system that will offer seamless student cards management.",
              },
              {
                year: "Mar 2025",
                title: "Scaffolding V2",
                description:
                  "Started writing some docs on how to implement this project, tested a few different technologies to include in, and prepared the development procees",
              },
              {
                year: "Apr 2025",
                title: "V2 First impression",
                description:
                  "I tried working on this project 1 month after it's preparation and to be honest, it was tiresome I gave up immediately as I started, the project seamed too good to be true",
              },
              {
                year: "Jun 2025",
                title: "Project recreation",
                description:
                  "Ditched everything and started preparing the idea from scratch again, targeted all possible approaches to bring this massive idea to life",
              },
              {
                year: "Aug 2025",
                title: "V2 MVP implementation",
                description:
                  "Immediately after my national exam, I started working on this project off the idea and concept I prepared in the past months",
              },
              {
                year: "Sept 2025 (Coming soon)",
                title: "Testing V2 in production",
                description:
                  "We are still registering schools which are considering to use our platform so that for this next academic year we would assess how well the project works in production",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.1 * index,
                  ease: "easeOut",
                }}
                className="relative mb-10 md:grid md:grid-cols-5 md:gap-8"
              >
                <div className="md:col-span-1">
                  <div className="border-border bg-card absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold md:static md:h-auto md:w-auto md:rounded-none md:border-none md:bg-transparent md:text-xl">
                    {item.year}
                  </div>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-lg font-bold md:text-xl">{item.title}</h3>
                  <p className="text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
