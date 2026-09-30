import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "@/provider/provider";
import { Toaster } from "@/components/ui/toaster";
import CookiesWrapper from "@/components/CookiesWrapper";
import { CookiesProvider } from "react-cookie"; // <-- Add this
import { companyDetails } from "@/lib/company";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${companyDetails.name} | Invoice Management`,
  description: `Invoice and order management for ${companyDetails.name}`,
  keywords: "invoice, billing, payments, vendors, orders, management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <CookiesWrapper>
          <AppProvider>
              {children}
              <Toaster />
          </AppProvider>
          </CookiesWrapper>
      </body>
    </html>
  );
}