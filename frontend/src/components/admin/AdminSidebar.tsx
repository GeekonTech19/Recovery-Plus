import { NavLink } from "react-router-dom";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SidebarLink = {
  label: string;
  path: string;
  icon: string;
};

const links: SidebarLink[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "📊",
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: "👥",
  },
  {
    label: "Activity",
    path: "/admin/activity",
    icon: "📋",
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: "📈",
  },
  {
    label: "Community",
    path: "/admin/community",
    icon: "💬",
  },
  {
    label: "Achievements",
    path: "/admin/achievements",
    icon: "🏆",
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}

      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{
            background: "rgba(0,0,0,0.35)",
            zIndex: 1030,
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`admin-sidebar ${
          isOpen ? "admin-sidebar-open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="p-4 border-bottom">

          <div className="d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-2">

              <div
                className="rounded-3 d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "#173f35",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                R+
              </div>

              <div>
                <div className="fw-bold">
                  Recovery+
                </div>

                <small className="text-muted">
                  Admin Portal
                </small>
              </div>

            </div>


            {/* Mobile close button */}

            <button
              type="button"
              className="btn btn-sm btn-light d-lg-none"
              onClick={onClose}
              aria-label="Close admin menu"
            >
              ✕
            </button>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="p-3">

          <div className="text-uppercase small fw-semibold text-muted px-2 mb-2">
            Administration
          </div>

          {links.map((link) => (

            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive
                    ? "admin-nav-link-active"
                    : ""
                }`
              }
            >

              <span
                style={{
                  width: "24px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {link.icon}
              </span>

              <span>
                {link.label}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* BOTTOM NAVIGATION */}

        <div className="mt-auto p-3 border-top">

          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="admin-nav-link"
          >

            <span
              style={{
                width: "24px",
                textAlign: "center",
              }}
            >
              ↩️
            </span>

            <span>
              Back to Recovery+
            </span>

          </NavLink>

        </div>

      </aside>
    </>
  );
}