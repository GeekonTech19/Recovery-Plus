import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-96 rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-bold text-blue-900">
          {title}
        </h1>

        <p className="mt-4 text-gray-600">
          {description}
        </p>

        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;