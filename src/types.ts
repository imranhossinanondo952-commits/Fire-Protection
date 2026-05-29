export interface Helpline {
  id: string;
  name: string;
  banglaName?: string;
  phone: string;
  address: string;
  banglaAddress?: string;
  category: 'fire' | 'police' | 'medical' | 'general';
  isBookmarked?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  titleBangla?: string;
  type: 'emergency' | 'security' | 'financial' | 'general';
  date: string;
  body: string;
  bodyBangla?: string;
}

export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Education'
  | 'Medical'
  | 'Business'
  | 'Others';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: TransactionCategory;
  amount: number;
  dateTime: string;
  notes: string;
}

export interface GoalStep {
  name: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'monthly' | 'house_building' | 'business' | 'investment';
  targetAmount: number;
  currentAmount: number;
  steps: GoalStep[];
  notes: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  time: string;
  category: 'safety' | 'work' | 'personal' | 'financial';
  isCompleted: boolean;
  alertEnabled: boolean;
  calendarSync: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  timestamp: string;
}
