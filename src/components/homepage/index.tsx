import { type ReactNode } from "react";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

interface LayoutProps {
  children: ReactNode;
  headerColor: string;
}

const HomeLayout = ({ children, headerColor }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header bgColor={headerColor} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
