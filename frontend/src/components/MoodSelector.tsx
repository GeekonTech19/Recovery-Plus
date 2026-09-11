type MoodSelectorProps = {
  value: string;
  onChange: (mood: string) => void;
};

const moods = [
  "😄",
  "🙂",
  "😐",
  "😔",
  "😢",
];

function MoodSelector({
  value,
  onChange,
}: MoodSelectorProps) {
  return (
    <div className="mb-6">
      <label className="mb-3 block text-sm font-semibold text-slate-700">
        How are you feeling today?
      </label>

      <div className="flex justify-between">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            className={`rounded-xl border p-3 text-3xl transition ${
              value === mood
                ? "border-emerald-500 bg-emerald-100"
                : "border-slate-300 hover:bg-slate-100"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;