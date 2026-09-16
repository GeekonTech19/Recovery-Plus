import { useState } from "react";

import type { GoalTrackingType } from "../../types/Goal";
import type { CreateGoalInput } from "../../services/goalService";

type Props = {
  onClose: () => void;
  onSave: (goal: CreateGoalInput) => Promise<void>;
};

const trackingOptions: {
  value: GoalTrackingType;
  label: string;
  icon: string;
}[] = [
  {
    value: "checkin",
    label: "Complete a daily check-in",
    icon: "📋",
  },
  {
    value: "alcoholFree",
    label: "Stay alcohol-free",
    icon: "🍺",
  },
  {
    value: "noSmoking",
    label: "Stay smoke-free",
    icon: "🚭",
  },
  {
    value: "noDrugs",
    label: "Stay drug-free",
    icon: "💊",
  },
  {
    value: "exercised",
    label: "Exercise",
    icon: "��",
  },
  {
    value: "drankWater",
    label: "Drink enough water",
    icon: "💧",
  },
  {
    value: "sleptWell",
    label: "Sleep well",
    icon: "😴",
  },
];

function GoalModal({ onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Recovery");
  const [target, setTarget] = useState(30);
  const [dueDate, setDueDate] = useState("");
  const [trackingType, setTrackingType] =
    useState<GoalTrackingType>("checkin");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert("Goal title required");
      return;
    }

    if (target < 1) {
      alert("Target must be at least 1");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        title: trimmedTitle,
        description: description.trim(),
        category,
        target,
        dueDate: dueDate || undefined,
        trackingType,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Build a new milestone
            </p>

            <h2 className="mt-1 text-2xl font-bold text-blue-900 sm:text-3xl">
              🎯 Create Goal
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Title */}
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Goal title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Complete 30 recovery days"
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
          disabled={saving}
        />

        {/* Description */}
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does achieving this goal mean to you?"
          rows={3}
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
          disabled={saving}
        />

        {/* Category */}
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
          disabled={saving}
        >
          <option value="Recovery">🛡️ Recovery</option>
          <option value="Health">💚 Health</option>
          <option value="Wellness">💙 Wellness</option>
          <option value="Lifestyle">🌱 Lifestyle</option>
        </select>

        {/* Tracking */}
        <label className="mb-2 block text-sm font-bold text-slate-700">
          What should automatically advance this goal?
        </label>

        <select
          value={trackingType}
          onChange={(e) =>
            setTrackingType(
              e.target.value as GoalTrackingType
            )
          }
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
          disabled={saving}
        >
          {trackingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>

        {/* Target + Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Target
            </label>

            <input
              type="number"
              min="1"
              value={target}
              onChange={(e) =>
                setTarget(Number(e.target.value))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              disabled={saving}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-2xl bg-blue-900 px-5 py-3 font-bold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalModal;
