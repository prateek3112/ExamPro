
// User interface with role property added
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

// UserRole type for authentication
export type UserRole = 'user' | 'admin' | 'teacher';

export interface Exam {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: string;
    imageUrl?: string;
    examType: string;
}

export interface ExamSection {
    id: string;
    examId: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface PreparationResource {
    id: string;
    examId: string;
    title: string;
    description?: string;
    resourceType: 'tip' | 'study_plan' | 'syllabus' | 'pdf' | 'video';
    url?: string;
    createdAt: string;
}

export interface Test {
    id: string;
    title: string;
    description: string;
    examId: string;
    duration: number;
    totalQuestions: number;
    createdAt: string;
    createdBy: string;
    testType?: 'full_length' | 'sectional' | 'previous_year';
}

export interface Question {
    id: string;
    testId: string;
    sectionId?: string;
    text: string;
    options: string[];
    correctOption: number;
    explanation?: string;
}

export interface QuestionSection {
    id: string;
    title: string;
    description: string;
    questionCount: number;
    isSelected?: boolean; // Added isSelected property to support UI state
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
    selectedSections?: string[];
}

export interface Answer {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
}
