import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem(
    "recovery_plus_user"
  );

  let isAdmin = false;

  try {
    if (storedUser) {
      const user = JSON.parse(storedUser);

      isAdmin =
        user?.role === "ADMIN" ||
        user?.role === "SUPER_ADMIN";
    }
  } catch {
    isAdmin = false;
  }

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "AI Assistant",
      path: "/ai-assistant",
      icon: "🤖",
    },
    {
      name: "Daily Check-in",
      path: "/daily-checkin",
      icon: "✅",
    },
    {
      name: "Goals",
      path: "/goals",
      icon: "🎯",
    },
    {
      name: "Achievements",
      path: "/achievements",
      icon: "🏆",
    },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 p-5">
        <div>
          <h1 className="text-2xl font-bold">
            Recovery+
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-4 py-2 transition ${
                location.pathname === link.path
                  ? "bg-white text-blue-900"
                  : "hover:bg-blue-800"
              }`}
            >
              {link.icon} {link.name}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className={`rounded-lg px-4 py-2 transition ${
                location.pathname.startsWith("/admin")
                  ? "bg-white text-blue-900"
                  : "hover:bg-blue-800"
              }`}
            >
              ⚙️ Admin
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium transition hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;