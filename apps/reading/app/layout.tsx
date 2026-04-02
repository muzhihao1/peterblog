import type { Metadata } from "next";
import { fontVariables } from "@peterblog/design-system";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Peter Mu \u2014 Reading Journal",
    template: "%s | Reading Journal",
  },
  description: "What I read, highlight, and think about.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://reading.petermu.com"
  ),
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
