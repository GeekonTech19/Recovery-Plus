import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import GoalCard from "../components/goals/GoalCard";
import GoalModal from "../components/goals/GoalModal";
import { getGoals, createGoal } from "../services/goalService";
import type { Goal } from "../types/Goal";

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setGoals((await getGoals()) as unknown as Goal[]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load goals"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(data: Parameters<typeof createGoal>[0]) {
    try {
      const goal = await createGoal(data);

      setGoals((g) => [
        goal as unknown as Goal,
        ...g,
      ]);

      setShow(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to save goal"
      );

      throw e;
    }
  }

  if (loading) {
    return (
      <AppLayout title="Goals">
        <div className="flex min-h-[400px] items-center justify-center text-slate-500">
          Loading your goals...
        </div>
      </AppLayout>
    );
  }

  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  const totalProgress = active.reduce(
    (sum, goal) => sum + goal.progress,
    0
  );

  const totalTarget = active.reduce(
    (sum, goal) => sum + goal.target,
    0
  );

  const overallProgress =
    totalTarget > 0
      ? Math.min(
          100,
          Math.round((totalProgress / totalTarget) * 100)
        )
      : 0;

  return (
    <AppLayout title="Goals">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 lg:py-6">

        {/* Header */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-200">
                Your recovery journey
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                🎯 My Goals
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
                Set meaningful goals and let your daily check-ins track your
                progress automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShow(true)}
              className="rounded-2xl bg-white px-5 py-3 font-bold text-blue-900 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Add Goal
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        {goals.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Active Goals
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-900">
                {active.length}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-md">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {completed.length}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Overall Progress
                </p>

                <span className="font-bold text-blue-900">
                  {overallProgress}%
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Goals */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Active Goals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep moving forward, one check-in at a time.
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
              {active.length}
            </span>
          </div>

          {active.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {active.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                🎯
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                No active goals yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Create your first goal and Recovery+ will automatically track
                it through your daily check-ins.
              </p>

              <button
                type="button"
                onClick={() => setShow(true)}
                className="mt-5 rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </section>

        {/* Completed Goals */}
        {completed.length > 0 && (
          <section className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                🏆 Completed Goals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Every completed goal is part of your recovery story.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {completed.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>

                        <h3 className="font-bold text-slate-800">
                          {goal.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {goal.description ||
                          "Goal completed through your recovery check-ins."}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                      ✓ {goal.progress}/{goal.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {show && (
        <GoalModal
          onClose={() => setShow(false)}
          onSave={save}
        />
      )}
    </AppLayout>
  );
}
