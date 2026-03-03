import React, { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
}) => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:relative lg:block lg:flex-1 bg-brand-light">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
          <div className="relative mb-12 flex h-80 w-80 items-center justify-center rounded-full bg-white shadow-xl border border-white/50">
            <img src="logo.png" alt="Hirely" className="w-36 h-36" />
          </div>
          <h3 className="text-3xl font-extrabold text-content-heading mb-4 px-10">
            Find your dream job with Hirely
          </h3>
          <p className="max-w-md text-content-body leading-relaxed text-lg font-medium opacity-80">
            Discover exclusive opportunities, track your progress, and take the
            next step in your career journey.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-40 relative">
        <div className="mx-auto w-full max-w-sm lg:ml-0">
          <header className="mb-8 text-left">
            <h1 className="text-2xl font-medium text-content-heading tracking-tight">
              {title}
            </h1>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
