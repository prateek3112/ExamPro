
import { Exam, Question, QuestionSection, Test, TestAttempt, User, Answer } from '@/types';

// Mock data for tests
const mockTests: Record<string, Test> = {
  't-00001': {
    id: 't-00001',
    title: 'JEE Maths Test',
    description: 'Test your knowledge of mathematical concepts for JEE',
    examId: '00000000-0000-0000-0000-000000000001',
    duration: 60,
    totalQuestions: 20,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  't-00002': {
    id: 't-00002',
    title: 'JEE Physics Test',
    description: 'Test your knowledge of physics principles and problem solving',
    examId: '00000000-0000-0000-0000-000000000001',
    duration: 45,
    totalQuestions: 15,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  't-00003': {
    id: 't-00003',
    title: 'SSC English Test',
    description: 'Test your knowledge of grammar and vocabulary',
    examId: '00000000-0000-0000-0000-000000000002',
    duration: 60,
    totalQuestions: 25,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  't-00004': {
    id: 't-00004',
    title: 'SSC General Knowledge Test',
    description: 'Test your knowledge of current affairs and general knowledge',
    examId: '00000000-0000-0000-0000-000000000002',
    duration: 50,
    totalQuestions: 20,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  't-00005': {
    id: 't-00005',
    title: 'NEET Biology Test',
    description: 'Analyze your understanding of biological concepts and systems',
    examId: '00000000-0000-0000-0000-000000000003',
    duration: 90,
    totalQuestions: 10,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  }
};

// Mock data for exams
const mockExams: Record<string, Exam> = {
  '00000000-0000-0000-0000-000000000001': {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'JEE Exam',
    description: 'Joint Entrance Examination for engineering college admissions',
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
    examType: 'JEE'
  },
  '00000000-0000-0000-0000-000000000002': {
    id: '00000000-0000-0000-0000-000000000002',
    title: 'SSC Exam',
    description: 'Staff Selection Commission examination for government positions',
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop',
    examType: 'SSC'
  },
  '00000000-0000-0000-0000-000000000003': {
    id: '00000000-0000-0000-0000-000000000003',
    title: 'NEET Exam',
    description: 'National Eligibility cum Entrance Test for medical admissions',
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2074&auto=format&fit=crop',
    examType: 'NEET'
  }
};

// Mock questions for tests
const mockQuestions: Record<string, Question[]> = {
  't-00001': Array.from({ length: 20 }, (_, i) => ({
    id: `q-00001-${i+1}`,
    testId: 't-00001',
    text: `JEE Mathematics Question ${i+1}`,
    options: [`Option A for question ${i+1}`, `Option B for question ${i+1}`, `Option C for question ${i+1}`, `Option D for question ${i+1}`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: 's1'
  })),
  't-00002': Array.from({ length: 15 }, (_, i) => ({
    id: `q-00002-${i+1}`,
    testId: 't-00002',
    text: `JEE Physics Question ${i+1}`,
    options: [`Option A for question ${i+1}`, `Option B for question ${i+1}`, `Option C for question ${i+1}`, `Option D for question ${i+1}`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: 's2'
  })),
  't-00003': Array.from({ length: 25 }, (_, i) => ({
    id: `q-00003-${i+1}`,
    testId: 't-00003',
    text: `SSC English Question ${i+1}`,
    options: [`Option A for question ${i+1}`, `Option B for question ${i+1}`, `Option C for question ${i+1}`, `Option D for question ${i+1}`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: 's4'
  })),
  't-00004': Array.from({ length: 20 }, (_, i) => ({
    id: `q-00004-${i+1}`,
    testId: 't-00004',
    text: `SSC General Knowledge Question ${i+1}`,
    options: [`Option A for question ${i+1}`, `Option B for question ${i+1}`, `Option C for question ${i+1}`, `Option D for question ${i+1}`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: 's5'
  })),
  't-00005': Array.from({ length: 10 }, (_, i) => ({
    id: `q-00005-${i+1}`,
    testId: 't-00005',
    text: `NEET Biology Question ${i+1}`,
    options: [`Option A for question ${i+1}`, `Option B for question ${i+1}`, `Option C for question ${i+1}`, `Option D for question ${i+1}`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: 's3'
  }))
};

// Mock test attempts
const mockTestAttempts: Record<string, TestAttempt> = {
  'attempt-001': {
    id: 'attempt-001',
    testId: 't-00001',
    userId: 'user123',
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    score: 16,
    totalQuestions: 20,
    answers: Array.from({ length: 20 }, (_, i) => ({
      questionId: `q-00001-${i+1}`,
      selectedOption: Math.floor(Math.random() * 4),
      isCorrect: Math.random() > 0.2,
    }))
  },
  'attempt-002': {
    id: 'attempt-002',
    testId: 't-00002',
    userId: 'user123',
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
    score: 10,
    totalQuestions: 15,
    answers: Array.from({ length: 15 }, (_, i) => ({
      questionId: `q-00002-${i+1}`,
      selectedOption: Math.floor(Math.random() * 4),
      isCorrect: Math.random() > 0.3,
    }))
  },
  'attempt-003': {
    id: 'attempt-003',
    testId: 't-00003',
    userId: 'user123',
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(),
    score: 22,
    totalQuestions: 25,
    answers: Array.from({ length: 25 }, (_, i) => ({
      questionId: `q-00003-${i+1}`,
      selectedOption: Math.floor(Math.random() * 4),
      isCorrect: Math.random() > 0.15,
    }))
  }
};

// Mock authentication functions
export const loginApi = async (email: string, password: string) => {
  console.log('Mock login with:', email);
  
  // Simulate authentication check
  if (email.includes('error')) {
    throw new Error('Invalid email or password');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Return mock user data
  return {
    user: {
      id: 'user123',
      name: email.split('@')[0],
      email,
    },
    token: 'mock-auth-token-123',
  };
};

export const registerApi = async (name: string, email: string, password: string) => {
  console.log('Mock register with:', name, email);
  
  // Simulate validation
  if (email.includes('exists')) {
    throw new Error('User with this email already exists');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Return mock user data
  return {
    user: {
      id: 'user123',
      name,
      email,
    },
    token: 'mock-auth-token-123',
  };
};

// Test attempts API functions
export const getTestAttemptsApi = async (userId: string) => {
  console.log('Fetching test attempts for user:', userId);
  
  // Return mock attempts for the user
  return Object.values(mockTestAttempts).filter(attempt => attempt.userId === userId);
};

export const getTestAttemptApi = async (attemptId: string) => {
  console.log('Fetching test attempt with ID:', attemptId);
  
  // Check if attempt exists in mock data
  const attempt = mockTestAttempts[attemptId];
  
  if (!attempt) {
    throw new Error('Test attempt not found');
  }
  
  // Get associated test and exam data
  const test = mockTests[attempt.testId];
  
  if (!test) {
    throw new Error('Test not found for this attempt');
  }
  
  const exam = mockExams[test.examId];
  
  if (!exam) {
    throw new Error('Exam not found for this attempt');
  }
  
  // Get questions for the test
  const questions = mockQuestions[attempt.testId] || [];
  
  return {
    attempt,
    test,
    exam,
    questions,
  };
};

export const startTestAttemptApi = async (testId: string, userId: string, selectedSections?: string[]) => {
  console.log('Starting test attempt:', testId, 'for user:', userId);
  console.log('Selected sections:', selectedSections);

  // Check if test exists
  const test = await getTestApi(testId);
  
  // Get questions for the test
  const questions = await getQuestionsByTestApi(testId);
  
  // Filter questions by section if selected
  const filteredQuestions = selectedSections?.length
    ? questions.filter(q => selectedSections.includes(q.sectionId || ''))
    : questions;
  
  // Create sections from question data
  const sectionMap = new Map<string, QuestionSection>();
  
  filteredQuestions.forEach(q => {
    if (q.sectionId && !sectionMap.has(q.sectionId)) {
      sectionMap.set(q.sectionId, {
        id: q.sectionId,
        title: `Section ${sectionMap.size + 1}`,
        description: `Questions for section ${sectionMap.size + 1}`,
        questionCount: 0
      });
    }
    
    if (q.sectionId) {
      const section = sectionMap.get(q.sectionId);
      if (section) {
        sectionMap.set(q.sectionId, {
          ...section,
          questionCount: section.questionCount + 1
        });
      }
    }
  });
  
  // Create a new attempt
  const attempt: TestAttempt = {
    id: `attempt-${Date.now()}`,
    testId,
    userId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    score: 0,
    totalQuestions: filteredQuestions.length,
    answers: [],
    selectedSections: selectedSections || []
  };
  
  return {
    attempt,
    questions: filteredQuestions,
    sections: Array.from(sectionMap.values()),
    test
  };
};

export const submitTestAttemptApi = async (attemptId: string, answers: Answer[]) => {
  console.log('Submitting test attempt:', attemptId, 'with answers:', answers.length);
  
  // Calculate the score
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  
  // Create updated attempt
  const updatedAttempt: TestAttempt = {
    id: attemptId,
    testId: mockTestAttempts[attemptId]?.testId || 't-00001', // Fallback to default
    userId: mockTestAttempts[attemptId]?.userId || 'user123',
    startedAt: mockTestAttempts[attemptId]?.startedAt || new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
    score: correctAnswers,
    totalQuestions: answers.length,
    answers,
  };
  
  // In a real app this would save to the database
  // For mock data, we can just log it
  console.log('Test submission complete. Score:', correctAnswers, '/', answers.length);
  
  return updatedAttempt;
};

// API functions
export const getExamsApi = async () => {
  console.log('Fetching all exams');
  return Object.values(mockExams);
};

export const getTestApi = async (testId: string): Promise<Test> => {
  console.log('Fetching test with ID:', testId);

  // Check if test exists in mock data
  if (testId.startsWith('t-') && mockTests[testId]) {
    console.log('Using mock data for test');
    return mockTests[testId];
  }

  // For tests not found in mock data
  throw new Error('Test not found');
};

export const getQuestionsByTestApi = async (testId: string): Promise<Question[]> => {
  console.log('Fetching questions for test ID:', testId);

  // Check if questions exist in mock data
  if (testId.startsWith('t-') && mockQuestions[testId]) {
    console.log('Using mock questions data');
    return mockQuestions[testId];
  }

  // For tests not found in mock data
  return [];
};

export const getExamApi = async (examId: string): Promise<Exam> => {
  console.log('Fetching exam with ID:', examId);

  // Check if exam exists in mock data
  if (mockExams[examId]) {
    console.log('Using mock data for exam');
    return mockExams[examId];
  }

  // For exams not found in mock data
  throw new Error('Exam not found');
};
