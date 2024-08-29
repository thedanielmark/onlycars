import { Metadata } from "next";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: `My Devices | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "",
};

const Layout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default Layout;
