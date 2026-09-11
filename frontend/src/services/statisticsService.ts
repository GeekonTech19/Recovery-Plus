export function getAverageTriggerLevel(entries: any[]): number {
    if (entries.length === 0) return 0;
  
    const total = entries.reduce(
      (sum, entry) => sum + (entry.triggerLevel || 0),
      0
    );
  
    return Number((total / entries.length).toFixed(1));
  }
  
  export function getMostCommonMood(entries: any[]): string {
    if (entries.length === 0) return "N/A";
  
    const moods: Record<string, number> = {};
  
    entries.forEach((entry) => {
      moods[entry.mood] = (moods[entry.mood] || 0) + 1;
    });
  
    return Object.entries(moods).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  }
  
  export function getTotalEntries(entries: any[]): number {
    return entries.length;
  }
  
  export function getAverageStress(entries: any[]): number {
    if (entries.length === 0) return 0;
  
    const total = entries.reduce(
      (sum, entry) =>
        sum + (entry.stress || entry.triggerLevel || 0),
      0
    );
  
    return Number((total / entries.length).toFixed(1));
  }
  
  export function getSuccessRate(entries: any[]): number {
    if (entries.length === 0) return 0;
  
    let completed = 0;
  
    entries.forEach((entry) => {
      if (entry.alcoholFree) completed++;
      if (entry.noSmoking) completed++;
      if (entry.noDrugs) completed++;
      if (entry.exercised) completed++;
      if (entry.drankWater) completed++;
      if (entry.sleptWell) completed++;
    });
  
    const totalPossible = entries.length * 6;
  
    return Math.round(
      (completed / totalPossible) * 100
    );
  }
  
  export function getRecoveryDays(entries: any[]): number {
    return entries.length;
  }
  
  export function getRecentActivity(entries: any[]) {
    return [...entries]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 5);
  }