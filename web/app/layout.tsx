"use client";

import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/layouts/AppLayout";
import { AuthProvider } from "@/providers/AuthProvider";
import {
  Web3AuthInnerContext,
  Web3AuthProvider,
} from "@web3auth/modal-react-hooks";
import { web3AuthContextConfig } from "@/providers/web3AuthProviderProps";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {/* <AuthProvider> */}
        <Web3AuthProvider config={web3AuthContextConfig}>
          <WalletServicesProvider context={Web3AuthInnerContext}>
            <AppLayout>{children}</AppLayout>
          </WalletServicesProvider>
        </Web3AuthProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
