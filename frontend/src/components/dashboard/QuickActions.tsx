import { useNavigate } from "react-router-dom";
import DashboardCard from "../DashboardCard";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "✅",
      title: "Daily Check-in",
      description: "Record today's recovery",
      color: "from-emerald-500 to-green-700",
      action: () => navigate("/daily-checkin"),
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Get support and guidance",
      color: "from-blue-600 to-indigo-800",
      action: () => navigate("/ai-assistant"),
    },
    {
      icon: "🎯",
      title: "Goals",
      description: "Track recovery goals",
      color: "from-orange-500 to-amber-700",
      action: () => navigate("/goals"),
    },
    {
      icon: "👥",
      title: "Community",
      description: "Share and connect",
      color: "from-cyan-500 to-blue-700",
      action: () => navigate("/community"),
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "View your badges",
      color: "from-yellow-500 to-orange-700",
      action: () => navigate("/achievements"),
    },
  ];

  return (
    <DashboardCard title="⚡ Continue Your Journey">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={item.action}
            className={`group relative min-h-[120px] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br ${item.color} p-4 text-left text-white shadow-lg outline-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:ring-4 focus-visible:ring-blue-400/70 focus-visible:ring-offset-4 focus-visible:ring-offset-white active:translate-y-0 sm:min-h-[125px] sm:p-5`}
          >
            {/* Decorative floating shape */}
            <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />

            {/* Icon */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl shadow-inner backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-11 sm:w-11 sm:text-2xl">
              {item.icon}
            </div>

            {/* Text */}
            <div className="relative mt-3">
              <h2 className="text-base font-bold tracking-tight sm:text-lg">
                {item.title}
              </h2>

              <p className="mt-1 max-w-[90%] text-xs leading-relaxed text-white/85 sm:text-sm">
                {item.description}
              </p>
            </div>

            {/* Arrow */}
            <div className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-base transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/25 sm:bottom-5 sm:right-5">
              →
            </div>
          </button>
        ))}
      </div>
    </DashboardCard>
  );
}

export default QuickActions;
