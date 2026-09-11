import type { DashboardSummary } from "../../types/dashboard";

interface GreetingProps {
  dashboard: DashboardSummary;
}

function Greeting({
  dashboard,
}: GreetingProps) {
  const userName =
    `${dashboard.user.firstName} ${dashboard.user.lastName}`.trim() ||
    "Recovery Warrior";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 18
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  const quotes = [
    "Every small victory matters.",
    "Progress, not perfection.",
    "One day at a time.",
    "Your future is built today.",
    "Keep showing up for yourself.",
    "Recovery is built through consistent choices.",
    "Small steps every day create lasting change.",
  ];

  const quote =
    quotes[new Date().getDate() % quotes.length];

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold">
            {greeting}
          </h1>

          <p className="mt-2 text-xl text-blue-100">
            Welcome back, {userName}
          </p>

          <p className="mt-1 text-sm text-blue-300">
            {today}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur">
        <p className="italic text-blue-100">
          "{quote}"
        </p>
      </div>
    </div>
  );
}

export default Greeting;