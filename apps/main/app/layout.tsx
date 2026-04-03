import type { Metadata } from "next";
import { fontVariables } from "@peterblog/design-system";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Peter Mu \u2014 Lab",
    template: "%s | Peter Mu",
  },
  description:
    "A place for experiments in technology, reading, and intentional living.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com"
  ),
  openGraph: {
    title: "Peter Mu \u2014 Lab",
    description:
      "A place for experiments in technology, reading, and intentional living.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com",
    siteName: "Peter Mu Lab",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Peter Mu \u2014 Lab",
    description:
      "A place for experiments in technology, reading, and intentional living.",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={fontVariables}>
      <body className="flex min-h-screen flex-col font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
