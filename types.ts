export interface HistoryItem {
  id: string;
  timestamp: number;
  amount: number;
  note: string;
}

export interface Kid {
  id: string;
  name: string;
  points: number;
  color: string; // Tailwind color class snippet, e.g., 'blue', 'pink'
  history: HistoryItem[];
}

export interface RewardSuggestion {
  text: string;
}

export type Tab = 'track' | 'stats' | 'settings';

export const KID_COLORS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];