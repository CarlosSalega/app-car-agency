import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import ScrollLockFix from "@/components/scroll-lock-fix";
import { Toaster } from "@/components/ui/sonner";
import { siteMetadata } from "@/data/metadata";

import "./globals.css";

export const metadata = {
  ...siteMetadata,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Toaster richColors />
        <ScrollLockFix />
        <Analytics />
      </body>
    </html>
  );
}
