import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";

import "./globals.css";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Ascension Analytics",
  description: "Analytics dashboard for the Ascension portfolio experience."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
