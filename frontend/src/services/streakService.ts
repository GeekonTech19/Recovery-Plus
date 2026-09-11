import { getJournalEntries } from "./JournalService";

function normalizeDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getCurrentStreak(): number {
  const entries = getJournalEntries();

  if (entries.length === 0) {
    return 0;
  }

  const dates = entries
    .map((entry) => normalizeDate(new Date(entry.date)))
    .filter((date, index, array) => array.indexOf(date) === index)
    .sort()
    .reverse();

  let streak = 0;

  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const date of dates) {
    const currentDate = normalizeDate(current);

    if (date === currentDate) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}