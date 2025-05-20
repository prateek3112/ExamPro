import { User, Exam, Test, Question, TestAttempt, UserRole, Answer } from '../types';

// Mock data
const users: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Student',
    role: 'student',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
  },
];

const exams: Exam[] = [
  {
    id: '1',
    title: 'Mathematics',
    description: 'Basic mathematics exam covering algebra, geometry, and calculus',
    createdAt: '2023-01-10T00:00:00Z',
    createdBy: '2',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500',
  },
  {
    id: '2',
    title: 'Physics',
    description: 'Comprehensive physics exam covering mechanics, thermodynamics, and electromagnetism',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: '2',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500',
  },
  {
    id: '3',
    title: 'Computer Science',
    description: 'Programming concepts, algorithms, and data structures',
    createdAt: '2023-01-20T00:00:00Z',
    createdBy: '2',
    imageUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=500',
  },
];

const tests: Test[] = [
  {
    id: '1',
    title: 'Algebra Basics',
    description: 'Test your knowledge of basic algebraic concepts',
    examId: '1',
    duration: 30,
    totalQuestions: 10,
    createdAt: '2023-01-12T00:00:00Z',
    createdBy: '2',
  },
  {
    id: '2',
    title: 'Geometry Fundamentals',
    description: 'Test covering basic geometry principles',
    examId: '1',
    duration: 45,
    totalQuestions: 15,
    createdAt: '2023-01-14T00:00:00Z',
    createdBy: '2',
  },
  {
    id: '3',
    title: 'Mechanics',
    description: 'Test covering Newtonian mechanics',
    examId: '2',
    duration: 60,
    totalQuestions: 20,
    createdAt: '2023-01-16T00:00:00Z',
    createdBy: '2',
  },
];

const questions: Record<string, Question[]> = {
  '1': [
    {
      id: '1',
      testId: '1',
      text: 'Solve for x: 2x + 3 = 7',
      options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
      correctOption: 1,
      explanation: 'Subtract 3 from both sides: 2x = 4, then divide by 2: x = 2',
    },
    {
      id: '2',
      testId: '1',
      text: 'Factor the expression: x² + 5x + 6',
      options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+3)(x+2)', '(x-2)(x-3)'],
      correctOption: 2,
      explanation: 'Find two numbers that multiply to give 6 and add up to 5. The numbers are 2 and 3, so the factorization is (x+2)(x+3)',
    },
    {
      id: '3',
      testId: '1',
      text: 'Solve the inequality: 3x - 7 > 2',
      options: ['x > 3', 'x < 3', 'x > 9/3', 'x < 9/3'],
      correctOption: 0,
      explanation: 'Add 7 to both sides: 3x > 9, then divide by 3: x > 3',
    },
    {
      id: '4',
      testId: '1',
      text: 'Simplify: (3x² - x + 4) - (2x² + 3x - 2)',
      options: ['x² - 4x + 6', 'x² + 4x + 6', 'x² - 4x + 2', '5x² - 4x + 6'],
      correctOption: 0,
      explanation: '(3x² - x + 4) - (2x² + 3x - 2) = 3x² - x + 4 - 2x² - 3x + 2 = x² - 4x + 6',
    },
    {
      id: '5',
      testId: '1',
      text: 'If f(x) = 2x - 3, what is f(4)?',
      options: ['2', '5', '6', '8'],
      correctOption: 1,
      explanation: 'f(4) = 2(4) - 3 = 8 - 3 = 5',
    },
  ],
};

const testAttempts: TestAttempt[] = [];

// Simulated API functions with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const loginApi = async (email: string, password: string) => {
  await delay(1000);
  const user = users.find(u => u.email === email);
  if (!user || password !== 'password') {
    throw new Error('Invalid credentials');
  }
  return {
    user,
    token: 'mock-jwt-token',
  };
};

export const registerApi = async (name: string, email: string, password: string) => {
  await delay(1000);
  if (users.some(u => u.email === email)) {
    throw new Error('Email already in use');
  }
  const newUser: User = {
    id: (users.length + 1).toString(),
    email,
    name,
    role: 'student',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return {
    user: newUser,
    token: 'mock-jwt-token',
  };
};

// Exams API
export const getExamsApi = async () => {
  await delay(300);
  return exams;
};

export const getExamApi = async (id: string) => {
  await delay(300);
  const exam = exams.find(e => e.id === id);
  if (!exam) {
    throw new Error('Exam not found');
  }
  return exam;
};

export const createExamApi = async (exam: Omit<Exam, 'id' | 'createdAt' | 'createdBy'>, userId: string) => {
  await delay(1000);
  const newExam: Exam = {
    ...exam,
    id: (exams.length + 1).toString(),
    createdAt: new Date().toISOString(),
    createdBy: userId,
  };
  exams.push(newExam);
  return newExam;
};

// Tests API
export const getTestsByExamApi = async (examId: string) => {
  await delay(300);
  return tests.filter(t => t.examId === examId);
};

export const getTestApi = async (id: string) => {
  await delay(300);
  const test = tests.find(t => t.id === id);
  if (!test) {
    throw new Error('Test not found');
  }
  return test;
};

export const createTestApi = async (test: Omit<Test, 'id' | 'createdAt' | 'createdBy'>, userId: string) => {
  await delay(1000);
  const newTest: Test = {
    ...test,
    id: (tests.length + 1).toString(),
    createdAt: new Date().toISOString(),
    createdBy: userId,
  };
  tests.push(newTest);
  return newTest;
};

// Questions API
export const getQuestionsByTestApi = async (testId: string) => {
  await delay(300);
  return questions[testId] || [];
};

export const createQuestionApi = async (question: Omit<Question, 'id'>) => {
  await delay(1000);
  const testQuestions = questions[question.testId] || [];
  const newQuestion: Question = {
    ...question,
    id: (testQuestions.length + 1).toString(),
  };
  
  if (!questions[question.testId]) {
    questions[question.testId] = [];
  }
  
  questions[question.testId].push(newQuestion);
  return newQuestion;
};

// Test attempts API
export const startTestAttemptApi = async (testId: string, userId: string) => {
  await delay(500);
  const test = tests.find(t => t.id === testId);
  if (!test) {
    throw new Error('Test not found');
  }
  
  const testQuestions = questions[testId] || [];
  
  const newAttempt: TestAttempt = {
    id: (testAttempts.length + 1).toString(),
    testId,
    userId,
    startedAt: new Date().toISOString(),
    score: 0,
    totalQuestions: testQuestions.length,
    answers: [],
  };
  
  testAttempts.push(newAttempt);
  return {
    attempt: newAttempt,
    questions: testQuestions,
  };
};

export const submitTestAttemptApi = async (attemptId: string, answers: Answer[]) => {
  await delay(1000);
  const attemptIndex = testAttempts.findIndex(a => a.id === attemptId);
  if (attemptIndex === -1) {
    throw new Error('Test attempt not found');
  }
  
  const attempt = testAttempts[attemptIndex];
  
  // Calculate score
  const score = answers.filter(a => a.isCorrect).length;
  
  const updatedAttempt: TestAttempt = {
    ...attempt,
    completedAt: new Date().toISOString(),
    score,
    answers,
  };
  
  testAttempts[attemptIndex] = updatedAttempt;
  return updatedAttempt;
};

export const getTestAttemptsApi = async (userId: string) => {
  await delay(500);
  return testAttempts.filter(a => a.userId === userId);
};

export const getTestAttemptApi = async (attemptId: string) => {
  await delay(500);
  const attempt = testAttempts.find(a => a.id === attemptId);
  if (!attempt) {
    throw new Error('Test attempt not found');
  }
  
  const test = tests.find(t => t.id === attempt.testId);
  if (!test) {
    throw new Error('Test not found');
  }
  
  const exam = exams.find(e => e.id === test.examId);
  if (!exam) {
    throw new Error('Exam not found');
  }
  
  const testQuestions = questions[attempt.testId] || [];
  
  return {
    attempt,
    test,
    exam,
    questions: testQuestions,
  };
};
