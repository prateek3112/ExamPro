// If this file exists, we'll add the User interface without modifying other types

// Add the following User interface if it doesn't already exist:
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: string;
    imageUrl?: string;
    examType: string;
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
