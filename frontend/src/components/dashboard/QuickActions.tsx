import { useNavigate } from "react-router-dom";
import DashboardCard from "../DashboardCard";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "✅",
      title: "Daily Check-in",
      description: "Record today's recovery",
      color: "from-emerald-600 to-green-700",
      action: () => navigate("/daily-checkin"),
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Get support and guidance",
      color: "from-blue-700 to-blue-900",
      action: () => navigate("/ai-assistant"),
    },
    {
      icon: "🎯",
      title: "Goals",
      description: "Track recovery goals",
      color: "from-orange-500 to-orange-700",
      action: () => navigate("/goals"),
    },
    {
      icon: "👥",
      title: "Community",
      description: "Connect with others",
      color: "from-cyan-500 to-blue-700",
      action: () => navigate("/community"),
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "View your badges",
      color: "from-yellow-500 to-amber-700",
      action: () => navigate("/achievements"),
    },
  ];

  return (
    <DashboardCard title="⚡ Continue Your Journey">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((item) => (
          <button
            key={item.title}
            onClick={item.action}
            className={`rounded-xl bg-gradient-to-r ${item.color}
              p-4 text-left text-white shadow-md
              transition-all duration-300
              hover:-translate-y-1
              hover:scale-[1.01]
              hover:shadow-xl`}
          >
            <div className="text-2xl">
              {item.icon}
            </div>

            <h2 className="mt-2 text-lg font-bold">
              {item.title}
            </h2>

            <p className="mt-1 text-sm text-white/90">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </DashboardCard>
  );
}

export default QuickActions;