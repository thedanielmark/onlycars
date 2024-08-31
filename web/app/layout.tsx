/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
// import { XMTPProvider } from "@xmtp/react-sdk";

export const metadata: Metadata = {
  title: "OnlyCars",
  description: "Make your EV chargers pay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-black text-white">
        <AuthProvider>
          {/* <XMTPProvider>{children}</XMTPProvider> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
