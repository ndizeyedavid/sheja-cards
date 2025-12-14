import { IconInnerShadowTop } from "@tabler/icons-react";
import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const data = {
  instaLink: "#",
  githubLink: "#",
  services: {
    signup: "/auth/signup",
    dashboard: "/dashboard",
  },
  about: {
    history: "/company-history",
    team: "/meet-the-team",
    handbook: "/employee-handbook",
    careers: "/careers",
  },
  help: {
    about: "/#about",
    features: "/#features",
    screenshot: "/#screenshots",
    faqs: "/#faqs",
  },
  contact: {
    email: "sonia@gmail.com",
    phone: "+250 794 715 042",
    address: "Rwanda, Kigali city",
  },
  company: {
    name: "Sheja Cards",
    description:
      "A modern student card management platform that helps schools run effortlessly, responsive, and built to simplify everything from enrollment to analytics.",
    logo: "/logo.webp",
  },
};

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Github, label: "GitHub", href: data.githubLink },
];

const aboutLinks = [
  { text: "Company History", href: data.about.history },
  { text: "Meet the Team", href: data.about.team },
  { text: "Employee Handbook", href: data.about.handbook },
  { text: "Careers", href: data.about.careers },
];

const serviceLinks = [
  { text: "Get Started", href: data.services.signup },
  { text: "Dashboard", href: data.services.dashboard },
];

const helpfulLinks = [
  { text: "About", href: data.help.faqs },
  { text: "Features", href: data.help.features },
  { text: "Screenshots", href: data.help.screenshot },
  { text: "FAQs", href: data.help.faqs },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer() {
  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <IconInnerShadowTop className="size-8" />
              {/* <img
                src={data.company.logo || "/placeholder.svg"}
                alt="logo"
                className="h-8 w-8 rounded-full"
              /> */}
              <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    prefetch={false}
                    href={href}
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>ff
          </div>

          <div className="grid  grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left invisible">
              <p className="text-lg font-medium">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Jump right in</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={"text-secondary-foreground/70 transition"}
                    >
                      <span className="text-secondary-foreground/70 transition">
                        {text}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      href="#"
                    >
                      <Icon className="text-primary size-5 shrink-0" />
                      {isAddress ? (
                        <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70 flex-1 transition">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
