import { User, Exam, Test, Question, TestAttempt, UserRole, Answer, QuestionSection } from '../types';

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
    title: 'SSC CGL',
    description: 'Staff Selection Commission Combined Graduate Level examination for various government posts',
    createdAt: '2023-01-10T00:00:00Z',
    createdBy: '2',
    examType: 'Government',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=500',
  },
  {
    id: '2',
    title: 'JEE Main',
    description: 'Joint Entrance Examination for admission to engineering colleges across India',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: '2',
    examType: 'Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500',
  },
  {
    id: '3',
    title: 'UPSC CSE',
    description: 'Civil Services Examination for recruitment to various Civil Services of the Government of India',
    createdAt: '2023-01-20T00:00:00Z',
    createdBy: '2',
    examType: 'Civil Services',
    imageUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=500',
  },
];

// Define sections with question counts
const sections: Record<string, QuestionSection[]> = {
  '1': [
    { id: 's1', title: 'General Intelligence & Reasoning', description: 'Questions on analogies, similarities, differences, spatial visualization, problem solving, analysis, decision making, etc.', questionCount: 25 },
    { id: 's2', title: 'General Awareness', description: 'Questions on current events, sports, history, geography, economic scene, general politics, Indian Constitution, etc.', questionCount: 25 },
    { id: 's3', title: 'Quantitative Aptitude', description: 'Questions on arithmetic, algebra, geometry, trigonometry, statistics, etc.', questionCount: 25 },
    { id: 's4', title: 'English Comprehension', description: 'Questions on understanding of English language, vocabulary, grammar, etc.', questionCount: 25 }
  ],
  '2': [
    { id: 's5', title: 'Physics', description: 'Questions on mechanics, thermodynamics, optics, electromagnetism, modern physics, etc.', questionCount: 30 },
    { id: 's6', title: 'Chemistry', description: 'Questions on physical, organic, and inorganic chemistry, etc.', questionCount: 30 },
    { id: 's7', title: 'Mathematics', description: 'Questions on algebra, calculus, coordinate geometry, etc.', questionCount: 30 }
  ],
  '3': [
    { id: 's8', title: 'General Studies Paper I', description: 'Questions on Indian history, geography, society, environment, etc.', questionCount: 35 },
    { id: 's9', title: 'General Studies Paper II', description: 'Questions on governance, constitution, polity, social justice, international relations, etc.', questionCount: 35 },
    { id: 's10', title: 'General Studies Paper III', description: 'Questions on technology, economic development, biodiversity, security, disaster management, etc.', questionCount: 35 },
    { id: 's11', title: 'General Studies Paper IV', description: 'Questions on ethics, integrity, aptitude, etc.', questionCount: 35 }
  ]
};

const tests: Test[] = [
  {
    id: '1',
    title: 'SSC CGL Tier I Mock Test',
    description: 'Practice test for SSC CGL Tier I examination covering all four sections',
    examId: '1',
    duration: 60,
    totalQuestions: 100,
    createdAt: '2023-01-12T00:00:00Z',
    createdBy: '2',
  },
  {
    id: '2',
    title: 'JEE Main Mock Test',
    description: 'Practice test for JEE Main covering Physics, Chemistry, and Mathematics',
    examId: '2',
    duration: 180,
    totalQuestions: 90,
    createdAt: '2023-01-14T00:00:00Z',
    createdBy: '2',
  },
  {
    id: '3',
    title: 'UPSC CSE Prelims Mock Test',
    description: 'Practice test for UPSC CSE Prelims covering all sections',
    examId: '3',
    duration: 120,
    totalQuestions: 140,
    createdAt: '2023-01-16T00:00:00Z',
    createdBy: '2',
  },
];

// Generate 100 sample questions for SSC CGL test (25 per section)
const generateSscQuestions = () => {
  const questions: Question[] = [];
  
  // Reasoning questions (s1)
  for (let i = 1; i <= 25; i++) {
    questions.push({
      id: `q${i}`,
      testId: '1',
      text: `Reasoning Question ${i}: If A is related to B in the same way as C is related to D, then how is E related to F?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOption: i % 4,
      sectionId: 's1'
    });
  }
  
  // General Awareness questions (s2)
  for (let i = 26; i <= 50; i++) {
    questions.push({
      id: `q${i}`,
      testId: '1',
      text: `General Awareness Question ${i-25}: Who is the current Prime Minister of India?`,
      options: ['Narendra Modi', 'Rahul Gandhi', 'Amit Shah', 'Rajnath Singh'],
      correctOption: 0,
      sectionId: 's2'
    });
  }
  
  // Quantitative Aptitude questions (s3)
  for (let i = 51; i <= 75; i++) {
    questions.push({
      id: `q${i}`,
      testId: '1',
      text: `Quantitative Aptitude Question ${i-50}: If the simple interest on a sum for 2 years at 5% per annum is ₹50, what is the principal amount?`,
      options: ['₹400', '₹500', '₹600', '₹700'],
      correctOption: 1,
      sectionId: 's3'
    });
  }
  
  // English Comprehension questions (s4)
  for (let i = 76; i <= 100; i++) {
    questions.push({
      id: `q${i}`,
      testId: '1',
      text: `English Comprehension Question ${i-75}: Choose the word which is most opposite in meaning to the given word: FRUGAL`,
      options: ['Economical', 'Extravagant', 'Miserly', 'Thrifty'],
      correctOption: 1,
      sectionId: 's4'
    });
  }
  
  return questions;
};

// Initialize questions for the first test
const questions: Record<string, Question[]> = {
  '1': generateSscQuestions(),
  // Other tests' questions would be defined here
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
export const startTestAttemptApi = async (testId: string, userId: string, selectedSections?: string[]) => {
  await delay(500);
  const test = tests.find(t => t.id === testId);
  if (!test) {
    throw new Error('Test not found');
  }
  
  const testQuestions = questions[testId] || [];
  const testSections = sections[test.examId] || [];
  
  // Filter questions by selected sections if applicable
  const filteredQuestions = selectedSections && selectedSections.length > 0
    ? testQuestions.filter(q => q.sectionId && selectedSections.includes(q.sectionId))
    : testQuestions;
  
  // Filter sections by selected sections if applicable
  const filteredSections = selectedSections && selectedSections.length > 0
    ? testSections.filter(s => selectedSections.includes(s.id))
    : testSections;
  
  const newAttempt: TestAttempt = {
    id: (testAttempts.length + 1).toString(),
    testId,
    userId,
    startedAt: new Date().toISOString(),
    score: 0,
    totalQuestions: filteredQuestions.length,
    answers: [],
    selectedSections
  };
  
  testAttempts.push(newAttempt);
  
  return {
    attempt: newAttempt,
    questions: filteredQuestions,
    sections: filteredSections,
    test: test
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
  
  // Filter questions by selected sections if applicable
  const filteredQuestions = attempt.selectedSections && attempt.selectedSections.length > 0
    ? testQuestions.filter(q => q.sectionId && attempt.selectedSections?.includes(q.sectionId))
    : testQuestions;
  
  return {
    attempt,
    test,
    exam,
    questions: filteredQuestions,
  };
};
