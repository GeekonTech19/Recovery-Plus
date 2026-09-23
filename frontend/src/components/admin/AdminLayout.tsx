import { type ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = localStorage.getItem(
    "recovery_plus_user"
  );

  let role:
    | "USER"
    | "ADMIN"
    | "SUPER_ADMIN" = "ADMIN";

  try {
    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (
        user?.role === "USER" ||
        user?.role === "ADMIN" ||
        user?.role === "SUPER_ADMIN"
      ) {
        role = user.role;
      }
    }
  } catch {
    role = "ADMIN";
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminTopbar
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}