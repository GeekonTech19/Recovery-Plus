import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import { saveCheckIn } from "../services/checkInService";
import { calculateCheckInScore } from "../services/recoveryEngine";

const DailyCheckIn = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Recovery
  const [alcoholFree, setAlcoholFree] = useState(false);
  const [noSmoking, setNoSmoking] = useState(false);
  const [noDrugs, setNoDrugs] = useState(false);

  // Healthy Habits
  const [exercised, setExercised] = useState(false);
  const [drankWater, setDrankWater] = useState(false);
  const [sleptWell, setSleptWell] = useState(false);

  // Wellness
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(5);
  const [journal, setJournal] = useState("");
  const [challenge, setChallenge] = useState("");
  const [wins, setWins] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!mood) {
      alert("Please select your mood before saving today's check-in.");
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const checkInForScore = {
        id: Date.now().toString(),
        date: new Date().toISOString(),

        alcoholFree,
        noSmoking,
        noDrugs,

        exercised,
        drankWater,
        sleptWell,

        mood,
        stress,
        journal,
        challenge,
        wins,
      };

      const result = calculateCheckInScore(checkInForScore);

      const savedCheckIn = await saveCheckIn({
        alcoholFree,
        noSmoking,
        noDrugs,
        exercised,
        drankWater,
        sleptWell,
        mood,
        stress,
        journal,
        challenge,
        wins,
      });

      console.log("Check-in saved to backend:", savedCheckIn);
      console.log("Recovery score:", result);

      alert(
        `✅ Check-in Saved!

Recovery Score: ${result.score}/100

Level: ${result.level}

${result.message}

Your goals have been updated automatically.

Taking you to your Goals...`
      );

      navigate("/goals");
    } catch (error) {
      console.error("Failed to save check-in:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save your check-in.";

      alert(`❌ Check-in was not saved.\n\n${message}`);
    } finally {
      setSaving(false);
    }
  };

  const recoveryItems = [
    {
      emoji: "🍺",
      title: "Alcohol Free",
      description: "Stayed alcohol-free",
      checked: alcoholFree,
      setChecked: setAlcoholFree,
    },
    {
      emoji: "🚭",
      title: "No Smoking",
      description: "Stayed smoke-free",
      checked: noSmoking,
      setChecked: setNoSmoking,
    },
    {
      emoji: "💊",
      title: "No Drugs",
      description: "Stayed drug-free",
      checked: noDrugs,
      setChecked: setNoDrugs,
    },
  ];

  const healthyHabitItems = [
    {
      emoji: "🏃",
      title: "Exercise",
      description: "I moved my body today",
      checked: exercised,
      setChecked: setExercised,
    },
    {
      emoji: "💧",
      title: "Water",
      description: "I stayed hydrated",
      checked: drankWater,
      setChecked: setDrankWater,
    },
    {
      emoji: "😴",
      title: "Good Sleep",
      description: "I slept well",
      checked: sleptWell,
      setChecked: setSleptWell,
    },
  ];

  return (
    <AppLayout title="Daily Check-in">
      <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 lg:py-6">
        {/* Header */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-5 text-white shadow-lg sm:p-7">
          <p className="mb-2 text-sm font-medium text-blue-200">
            {today}
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Daily Check-in
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Take a moment to check in with yourself. Every honest check-in is
            another step forward.
          </p>
        </div>

        {/* Recovery */}
        <section className="mb-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-blue-900">
              🛡️ Recovery
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Celebrate the choices that support your recovery.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {recoveryItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => item.setChecked(!item.checked)}
                className={`relative flex min-h-[105px] items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  item.checked
                    ? "border-emerald-400 bg-emerald-50 shadow-md"
                    : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {item.emoji}
                </span>

                <span>
                  <span className="block font-bold text-slate-800">
                    {item.title}
                  </span>

                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </span>
                </span>

                <span
                  className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    item.checked
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-300 bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Healthy Habits */}
        <section className="mb-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-blue-900">
              🌱 Healthy Habits
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Small healthy choices add up to meaningful progress.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {healthyHabitItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => item.setChecked(!item.checked)}
                className={`relative flex min-h-[105px] items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  item.checked
                    ? "border-emerald-400 bg-emerald-50 shadow-md"
                    : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {item.emoji}
                </span>

                <span>
                  <span className="block font-bold text-slate-800">
                    {item.title}
                  </span>

                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </span>
                </span>

                <span
                  className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    item.checked
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-300 bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Wellness */}
        <section className="mb-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-blue-900">
              💙 How Are You Feeling?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Check in with your mood and stress level today.
            </p>
          </div>

          {/* Mood */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-bold text-slate-700">
              Your mood
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                { value: "Great", emoji: "😄" },
                { value: "Good", emoji: "🙂" },
                { value: "Okay", emoji: "😐" },
                { value: "Low", emoji: "😔" },
                { value: "Difficult", emoji: "😣" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMood(item.value)}
                  className={`rounded-2xl border-2 px-3 py-3 transition-all duration-200 ${
                    mood === item.value
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <span className="block text-2xl">{item.emoji}</span>

                  <span className="mt-1 block text-xs font-semibold text-slate-700">
                    {item.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Stress / Recovery Level */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="stress"
                className="text-sm font-bold text-slate-700"
              >
                Recovery level
              </label>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">
                {stress}/10
              </span>
            </div>

            <input
              id="stress"
              type="range"
              min="0"
              max="10"
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-700"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>�� Low stress</span>
              <span>High stress 😣</span>
            </div>
          </div>
        </section>

        {/* Reflection */}
        <section className="mb-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-blue-900">
              📝 Daily Reflection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your words can help you understand your progress.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="journal"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                📖 How was your day?
              </label>

              <textarea
                id="journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                rows={4}
                placeholder="Write anything you'd like to remember about today..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="challenge"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                🧩 What challenged you today?
              </label>

              <textarea
                id="challenge"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                rows={3}
                placeholder="What was difficult, and how did you handle it?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="wins"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                🏆 What was your win today?
              </label>

              <textarea
                id="wins"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                rows={3}
                placeholder="Even a small victory counts..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 p-5 text-white shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Ready to complete your check-in?
              </h2>

              <p className="mt-1 text-sm text-emerald-50">
                Your recovery progress and goals will update automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-white px-6 py-3 font-bold text-emerald-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "✅ Save Check-in"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DailyCheckIn;
