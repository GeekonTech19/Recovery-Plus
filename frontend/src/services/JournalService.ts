import type { JournalEntry } from "../types/JournalEntry";
import { getData, saveData } from "./storageService";

const STORAGE_KEY = "recovery_journal_entries";

export function getJournalEntries(): JournalEntry[] {
  return getData<JournalEntry[]>(STORAGE_KEY) ?? [];
}

export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();

  entries.unshift(entry);

  saveData(STORAGE_KEY, entries);
}