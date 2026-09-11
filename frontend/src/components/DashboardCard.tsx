import type { ReactNode } from "react";

type DashboardCardProps = {
  title: ReactNode;
  children: ReactNode;
};

function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-blue-900">
        {title}
      </h2>

      {children}
    </div>
  );
}

export default DashboardCard;