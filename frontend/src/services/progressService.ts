import { getJournalEntries } from "./JournalService";

export function getTotalEntries(): number {
  return getJournalEntries().length;
}

export function getAverageTriggerLevel(): number {
  const entries = getJournalEntries();

  if (entries.length === 0) {
    return 0;
  }

  const total = entries.reduce(
    (sum, entry) => sum + entry.triggerLevel,
    0
  );

  return Number((total / entries.length).toFixed(1));
}

export function getMostCommonMood(): string {
  const entries = getJournalEntries();

  if (entries.length === 0) {
    return "No Data";
  }

  const moodCount: Record<string, number> = {};

  entries.forEach((entry) => {
    moodCount[entry.mood] =
      (moodCount[entry.mood] || 0) + 1;
  });

  let mostCommon = "";
  let highestCount = 0;

  for (const mood in moodCount) {
    if (moodCount[mood] > highestCount) {
      highestCount = moodCount[mood];
      mostCommon = mood;
    }
  }

  return mostCommon;
}