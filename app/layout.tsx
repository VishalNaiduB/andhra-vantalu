import type { Metadata } from "next";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andhra Vantalu — Authentic Andhra Pradesh Recipes",
  description:
    "Discover authentic Andhra Pradesh recipes — from Pesarattu to Gongura Mutton. Breakfast, lunch, dinner, snacks, and sweets from Coastal Andhra, Rayalaseema, Godavari, and North Andhra.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream-100 pb-20 antialiased">
        <PageHeader />
        <main className="mx-auto max-w-5xl px-4 py-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
