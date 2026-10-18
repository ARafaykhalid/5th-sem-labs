import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const generalSans = localFont({
  src: "./fonts/GeneralSans.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});

const blackRolmer = localFont({
  src: "./fonts/BlackRolmer.woff2",
  variable: "--font-black-rolmer",
  weight: "400",
  display: "swap",
});

const meta = localFont({
  src: "./fonts/Meta.woff2",
  variable: "--font-meta-face",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Password Lab · Abdul Rafay Khalid",
  description:
    "Compare unsalted SHA-1, salted SHA-1, and Argon2id with hashes computed locally in your browser. A case study from the 2012 LinkedIn password breach.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${generalSans.variable} ${blackRolmer.variable} ${meta.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
