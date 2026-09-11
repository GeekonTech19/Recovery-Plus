import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

type AppLayoutProps = {
  title?: string;
  children: ReactNode;
};

function AppLayout({ title, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
     <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        {title && (
          <h1 className="mb-6 text-3xl font-bold text-blue-900">
            {title}
          </h1>
        )}

        {children}
      </main>
    </div>
  );
}

export default AppLayout;