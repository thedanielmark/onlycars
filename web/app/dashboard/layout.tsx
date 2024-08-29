"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
