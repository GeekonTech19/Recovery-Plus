import type { JournalEntry } from "../types/JournalEntry";

type JournalCardProps = {
  entry: JournalEntry;
};

function JournalCard({ entry }: JournalCardProps) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl">
          {entry.mood}
        </h2>

        <span className="text-sm text-slate-500">
          {new Date(entry.date).toLocaleDateString()}
        </span>

      </div>

      <div className="mt-4">
        <p className="font-semibold text-slate-700">
          Trigger Level
        </p>

        <p className="text-blue-900 font-bold">
          {entry.triggerLevel}/10
        </p>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold text-blue-900">
          Journal
        </h3>

        <p className="mt-2 whitespace-pre-wrap text-slate-700">
          {entry.journal}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold text-emerald-600">
          Gratitude
        </h3>

        <p className="mt-2 whitespace-pre-wrap text-slate-700">
          {entry.gratitude}
        </p>
      </div>

    </div>
  );
}

export default JournalCard;