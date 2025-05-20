
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  imageUrl?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  examId: string;
  duration: number; // in minutes
  totalQuestions: number;
  createdAt: string;
  createdBy: string;
}

export interface QuestionSection {
  id: string;
  title: string;
  description?: string;
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  sectionId?: string; // Reference to section
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
