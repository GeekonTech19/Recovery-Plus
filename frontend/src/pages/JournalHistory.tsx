import AppLayout from "../layouts/AppLayout";

import JournalCard from "../components/JournalCard";

import { getJournalEntries } from "../services/JournalService";

function JournalHistory() {
  const entries = getJournalEntries();

  return (
    <AppLayout title="📚 Journal History">

      {entries.length === 0 ? (

        <div className="rounded-2xl bg-white p-8 text-center shadow">

          <h2 className="text-2xl font-semibold text-slate-700">
            No journal entries yet.
          </h2>

          <p className="mt-2 text-slate-500">
            Start by writing your first journal entry.
          </p>

        </div>

      ) : (

        entries.map((entry) => (
          <JournalCard
            key={entry.id}
            entry={entry}
          />
        ))

      )}

    </AppLayout>
  );
}

export default JournalHistory;