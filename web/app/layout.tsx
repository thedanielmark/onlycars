import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/layouts/AppLayout";
import { AuthProvider } from "@/providers/AuthProvider";

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
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
