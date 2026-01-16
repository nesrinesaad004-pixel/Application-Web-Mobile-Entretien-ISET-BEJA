export interface StudentInfo {
  nom: string;
  prenom: string;
  groupe: string;
  niveau: string;
  specialite: string;
  professorEmail: string;
}

export interface GameState {
  currentLevel: number;
  studentInfo: StudentInfo | null;
  level1Choices: string[];
  level2Domain: string | null;
  level2Values: string[];
  level3Order: string[];
  level4Avatar: string | null;
  level4PitchOrder: string[];
  level5Answers: Record<string, string>;
  level5Score: number;
  completedLevels: number[];
  startTime: number | null;
  endTime: number | null;
  // 🔥 Ajout obligatoire :
  levelScores: Record<number, number>; // ex: {1:20, 2:0, 3:20, 4:15, 5:12}
}

export interface QualityCard {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface ValueOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface MailBlock {
  id: string;
  content: string;
  order: number;
}