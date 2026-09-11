import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import AppLayout from "../layouts/AppLayout";
  
  import {
    getAchievementProgress,
  } from "../services/achievementService";
  
  import type {
    AchievementCategory,
    AchievementProgressItem,
    AchievementProgressResponse,
  } from "../types/achievement";
  
  const categories: Array<
    "All" | AchievementCategory
  > = [
    "All",
    "Streaks",
    "Check-ins",
    "Goals",
  ];
  
  function formatDate(
    date: string | null
  ) {
    if (!date) {
      return "";
    }
  
    const value =
      new Date(date);
  
    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "";
    }
  
    return value.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }
  
  function getEncouragement(
    progress: AchievementProgressResponse
  ) {
    if (
      progress.stats
        .totalAchievements === 0
    ) {
      return "Every journey starts with one small step. Your first milestone is waiting.";
    }
  
    if (
      progress.stats
        .totalAchievements ===
      progress.stats.totalAvailable
    ) {
      return "You have unlocked every current milestone. That is something worth celebrating!";
    }
  
    if (
      progress.stats.currentStreak >= 7
    ) {
      return "You are building serious momentum. Keep showing up, one day at a time.";
    }
  
    if (
      progress.stats.currentStreak >= 3
    ) {
      return "Your consistency is starting to show. Keep the momentum going.";
    }
  
    return "Every check-in counts. Keep showing up and let your progress build naturally.";
  }
  
  function AchievementCard({
    achievement,
  }: {
    achievement: AchievementProgressItem;
  }) {
    if (achievement.earned) {
      return (
        <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
              {achievement.icon}
            </div>
  
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-800">
                  {achievement.title}
                </h3>
  
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  ✓ Earned
                </span>
              </div>
  
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {achievement.description}
              </p>
  
              <p className="mt-3 text-xs font-medium text-slate-400">
                Earned{" "}
                {formatDate(
                  achievement.earnedAt
                )}
              </p>
            </div>
          </div>
        </article>
      );
    }
  
    return (
      <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm grayscale">
            {achievement.icon}
          </div>
  
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-800">
                {achievement.title}
              </h3>
  
              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500">
                🔒 Locked
              </span>
            </div>
  
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {achievement.description}
            </p>
  
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {achievement.requirement}
            </p>
  
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  {achievement.current} /{" "}
                  {achievement.target}
                </span>
  
                <span>
                  {achievement.percentage}%
                </span>
              </div>
  
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all duration-700"
                  style={{
                    width: `${achievement.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
  
  function Achievements() {
    const [
      progress,
      setProgress,
    ] =
      useState<AchievementProgressResponse | null>(
        null
      );
  
    const [
      category,
      setCategory,
    ] =
      useState<
        "All" | AchievementCategory
      >("All");
  
    const [
      loading,
      setLoading,
    ] = useState(true);
  
    const [
      error,
      setError,
    ] = useState("");
  
    useEffect(() => {
      async function loadAchievements() {
        try {
          setError("");
  
          const data =
            await getAchievementProgress();
  
          setProgress(data);
        } catch (err) {
          console.error(
            "Failed to load achievements:",
            err
          );
  
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load achievements"
          );
        } finally {
          setLoading(false);
        }
      }
  
      loadAchievements();
    }, []);
  
    const filteredAchievements =
      useMemo(() => {
        if (!progress) {
          return [];
        }
  
        if (
          category === "All"
        ) {
          return progress.achievements;
        }
  
        return progress.achievements.filter(
          (achievement) =>
            achievement.category ===
            category
        );
      }, [
        progress,
        category,
      ]);
  
    if (loading) {
      return (
        <AppLayout>
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="text-5xl">
                🏆
              </div>
  
              <p className="mt-4 text-lg text-slate-500">
                Loading your achievements...
              </p>
            </div>
          </div>
        </AppLayout>
      );
    }
  
    if (
      error ||
      !progress
    ) {
      return (
        <AppLayout>
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">
              🏆
            </div>
  
            <h1 className="mt-4 text-2xl font-bold text-slate-800">
              We couldn't load your achievements
            </h1>
  
            <p className="mt-3 text-slate-500">
              {error ||
                "Please try again in a moment."}
            </p>
          </div>
        </AppLayout>
      );
    }
  
    const firstName =
      progress.user.firstName ||
      "Recovery Warrior";
  
    const next =
      progress.nextAchievement;
  
    return (
      <AppLayout>
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-800 p-7 text-white shadow-lg sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                🏆 Recovery milestones
              </span>
  
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Your Recovery Journey
              </h1>
  
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                {firstName}, every check-in,
                every goal, and every day you
                keep showing up becomes part of
                your story.
              </p>
  
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">
                {getEncouragement(
                  progress
                )}
              </p>
            </div>
  
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Achievements
                </p>
  
                <p className="mt-1 text-4xl font-black">
                  {
                    progress.stats
                      .totalAchievements
                  }
                </p>
  
                <p className="mt-1 text-xs text-blue-100">
                  of{" "}
                  {
                    progress.stats
                      .totalAvailable
                  }{" "}
                  unlocked
                </p>
              </div>
  
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Current streak
                </p>
  
                <p className="mt-1 text-4xl font-black">
                  {
                    progress.stats
                      .currentStreak
                  }
                </p>
  
                <p className="mt-1 text-xs text-blue-100">
                  consecutive days
                </p>
              </div>
  
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Check-ins
                </p>
  
                <p className="mt-1 text-4xl font-black">
                  {
                    progress.stats
                      .totalCheckIns
                  }
                </p>
  
                <p className="mt-1 text-xs text-blue-100">
                  completed
                </p>
              </div>
  
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Goals
                </p>
  
                <p className="mt-1 text-4xl font-black">
                  {
                    progress.stats
                      .completedGoals
                  }
                </p>
  
                <p className="mt-1 text-xs text-blue-100">
                  of{" "}
                  {
                    progress.stats
                      .totalGoals
                  }{" "}
                  completed
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {next && (
          <section className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                {next.icon}
              </div>
  
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
                  Your next milestone
                </p>
  
                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {next.title}
                </h2>
  
                <p className="mt-1 text-sm text-slate-500">
                  {next.requirement}
                </p>
  
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${next.percentage}%`,
                    }}
                  />
                </div>
              </div>
  
              <div className="text-left sm:text-right">
                <p className="text-2xl font-black text-emerald-700">
                  {next.current}/
                  {next.target}
                </p>
  
                <p className="text-xs font-semibold text-slate-500">
                  {next.percentage}%
                  {" "}
                  complete
                </p>
              </div>
            </div>
          </section>
        )}
  
        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Keep going
              </p>
  
              <h2 className="mt-1 text-3xl font-black text-slate-800">
                Your Milestones
              </h2>
  
              <p className="mt-2 text-sm text-slate-500">
                Earn achievements naturally as
                you continue your recovery journey.
              </p>
            </div>
  
            <div className="flex flex-wrap gap-2">
              {categories.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCategory(
                        item
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category ===
                      item
                        ? "bg-blue-900 text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
  
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredAchievements.map(
              (
                achievement
              ) => (
                <AchievementCard
                  key={
                    achievement.badge
                  }
                  achievement={
                    achievement
                  }
                />
              )
            )}
          </div>
        </section>
  
        {!next &&
          progress.stats
            .totalAchievements ===
            progress.stats
              .totalAvailable && (
            <section className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
              <div className="text-5xl">
                🎉
              </div>
  
              <h2 className="mt-3 text-2xl font-black text-slate-800">
                You've unlocked them all!
              </h2>
  
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Keep building your recovery journey.
                New milestones can be added to
                Recovery+ as the experience grows.
              </p>
            </section>
          )}
      </AppLayout>
    );
  }
  
  export default Achievements;