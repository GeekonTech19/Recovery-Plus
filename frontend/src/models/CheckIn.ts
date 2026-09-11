export interface CheckIn {
    id: string;
    date: string;
  
    alcoholFree: boolean;
    noSmoking: boolean;
    noDrugs: boolean;
  
    exercised: boolean;
    drankWater: boolean;
    sleptWell: boolean;
  
    mood: string;
    stress: number;
  
    journal: string;
    challenge: string;
    wins: string;
  }