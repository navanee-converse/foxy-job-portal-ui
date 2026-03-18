import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { type ReactNode } from "react";

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
