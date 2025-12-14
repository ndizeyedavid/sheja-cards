import { ThemeProvider } from "@/components/theme-provider";
import BetaRibbon from "@/components/ui/beta-ribbon";
import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHEJA Cards",
  description:
    "A Multi-tenant student cards management system tailored to handle and manage student information through student cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* <BetaRibbon /> */}
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
