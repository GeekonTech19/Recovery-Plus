import { useState } from "react";

import type {
  GoalTrackingType,
} from "../../types/Goal";

import type {
  CreateGoalInput,
} from "../../services/goalService";

type Props = {
  onClose: () => void;
  onSave: (
    goal: CreateGoalInput
  ) => Promise<void>;
};

const trackingOptions: {
  value: GoalTrackingType;
  label: string;
}[] = [
  {
    value: "checkin",
    label: "Complete a daily check-in",
  },
  {
    value: "alcoholFree",
    label: "Stay alcohol-free",
  },
  {
    value: "noSmoking",
    label: "Stay smoke-free",
  },
  {
    value: "noDrugs",
    label: "Stay drug-free",
  },
  {
    value: "exercised",
    label: "Exercise",
  },
  {
    value: "drankWater",
    label: "Drink enough water",
  },
  {
    value: "sleptWell",
    label: "Sleep well",
  },
];

function GoalModal({
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("Recovery");

  const [target, setTarget] =
    useState(30);

  const [dueDate, setDueDate] =
    useState("");

  const [trackingType, setTrackingType] =
    useState<GoalTrackingType>(
      "checkin"
    );

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit() {
    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      alert("Goal title required");
      return;
    }

    if (target < 1) {
      alert(
        "Target must be at least 1"
      );
      return;
    }

    try {
      setSaving(true);

      await onSave({
        title: trimmedTitle,
        description:
          description.trim(),
        category,
        target,
        dueDate:
          dueDate || undefined,
        trackingType,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-3xl font-bold text-blue-900">
          🎯 Create Goal
        </h2>

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Goal Title"
          className="mb-4 w-full rounded-xl border p-3"
          disabled={saving}
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          rows={3}
          className="mb-4 w-full rounded-xl border p-3"
          disabled={saving}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="mb-4 w-full rounded-xl border p-3"
          disabled={saving}
        >
          <option value="Recovery">
            Recovery
          </option>
          <option value="Health">
            Health
          </option>
          <option value="Wellness">
            Wellness
          </option>
          <option value="Lifestyle">
            Lifestyle
          </option>
        </select>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          What should automatically advance this goal?
        </label>

        <select
          value={trackingType}
          onChange={(e) =>
            setTrackingType(
              e.target
                .value as GoalTrackingType
            )
          }
          className="mb-4 w-full rounded-xl border p-3"
          disabled={saving}
        >
          {trackingOptions.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Target
        </label>

        <input
          type="number"
          min="1"
          value={target}
          onChange={(e) =>
            setTarget(
              Number(e.target.value)
            )
          }
          className="mb-4 w-full rounded-xl border p-3"
          disabled={saving}
        />

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Due Date
        </label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          className="mb-6 w-full rounded-xl border p-3"
          disabled={saving}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl bg-slate-200 px-5 py-3"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalModal;