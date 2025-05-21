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
      role: 'user' as const,
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
      role: 'user' as const,
    },
    token: 'mock-auth-token-123',
  };
};

// Test attempts API functions
export const getTestAttemptsApi = async (userId: string) => {
  console.log('Fetching test attempts for user:', userId);
  
  // Return mock attempts for the user
  // Simulate mock attempts using fixed data
  const mockAttempts: TestAttempt[] = [
    {
      id: 'attempt-001',
      testId: 't-00001',
      userId: userId,
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
    {
      id: 'attempt-002',
      testId: 't-00002',
      userId: userId,
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
    {
      id: 'attempt-003',
      testId: 't-00003',
      userId: userId,
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
  ];
  
  return mockAttempts;
};

export const getTestAttemptApi = async (attemptId: string) => {
  console.log('Fetching test attempt with ID:', attemptId);
  
  // Create a mock attempt
  const mockAttempt: TestAttempt = {
    id: attemptId,
    testId: 't-00001',
    userId: 'user123',
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    score: 16,
    totalQuestions: 20,
    answers: Array.from({ length: 20 }, (_, i) => ({
      questionId: `q-00001-${i+1}`,
      selectedOption: Math.floor(Math.random() * 4),
      isCorrect: Math.random() > 0.2,
    }))
  };
  
  // Get associated test and exam data
  const test = mockTests[mockAttempt.testId];
  
  if (!test) {
    throw new Error('Test not found for this attempt');
  }
  
  const exam = mockExams[test.examId];
  
  if (!exam) {
    throw new Error('Exam not found for this attempt');
  }
  
  // Get questions for the test - simplified mock version
  const questions: Question[] = Array.from({ length: 20 }, (_, i) => ({
    id: `q-00001-${i+1}`,
    testId: mockAttempt.testId,
    text: `Question ${i+1}`,
    options: [`Option A`, `Option B`, `Option C`, `Option D`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: i < 10 ? 's1' : 's2'
  }));
  
  return {
    attempt: mockAttempt,
    test,
    exam,
    questions,
  };
};

export const startTestAttemptApi = async (testId: string, userId: string, selectedSections?: string[]) => {
  console.log('Starting test attempt:', testId, 'for user:', userId);
  console.log('Selected sections:', selectedSections);

  // Find the test in our mock data or create a fallback
  const test = mockTests[testId] || {
    id: testId,
    title: 'Sample Test',
    description: 'This is a sample test for practice',
    examId: '00000000-0000-0000-0000-000000000001',
    duration: 60,
    totalQuestions: 20,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  };
  
  // Create mock questions for the test
  const questions: Question[] = Array.from({ length: 20 }, (_, i) => ({
    id: `q-${testId}-${i+1}`,
    testId,
    text: `Question ${i+1}`,
    options: [`Option A for Q${i+1}`, `Option B for Q${i+1}`, `Option C for Q${i+1}`, `Option D for Q${i+1}`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: i < 10 ? 's1' : 's2'
  }));
  
  // Create mock sections
  const sections: QuestionSection[] = [
    {
      id: 's1',
      title: 'Section 1',
      description: 'Basic concepts',
      questionCount: 10,
      isSelected: selectedSections?.includes('s1')
    },
    {
      id: 's2',
      title: 'Section 2',
      description: 'Advanced concepts',
      questionCount: 10,
      isSelected: selectedSections?.includes('s2')
    }
  ];
  
  // Filter questions based on selected sections if any
  const filteredQuestions = selectedSections?.length
    ? questions.filter(q => selectedSections.includes(q.sectionId || ''))
    : questions;
  
  // Create a new attempt
  const attempt: TestAttempt = {
    id: `attempt-${Date.now()}`,
    testId,
    userId,
    startedAt: new Date().toISOString(),
    score: 0,
    totalQuestions: filteredQuestions.length,
    answers: [],
    selectedSections: selectedSections
  };
  
  return {
    attempt,
    questions: filteredQuestions,
    sections,
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
    testId: 't-00001', // Default mock test ID
    userId: 'user123',
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
    score: correctAnswers,
    totalQuestions: answers.length,
    answers,
  };
  
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
  if (mockTests[testId]) {
    console.log('Using mock data for test');
    return mockTests[testId];
  }

  // For tests not found in mock data, create a generic one
  return {
    id: testId,
    title: 'Sample Test',
    description: 'This is a sample test',
    examId: '00000000-0000-0000-0000-000000000001',
    duration: 60,
    totalQuestions: 20,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  };
};

export const getQuestionsByTestApi = async (testId: string): Promise<Question[]> => {
  console.log('Fetching questions for test ID:', testId);

  // Create mock questions
  return Array.from({ length: 20 }, (_, i) => ({
    id: `q-${testId}-${i+1}`,
    testId,
    text: `Question ${i+1}`,
    options: [`Option A`, `Option B`, `Option C`, `Option D`],
    correctOption: Math.floor(Math.random() * 4),
    sectionId: i < 10 ? 's1' : 's2'
  }));
};

export const getExamApi = async (examId: string): Promise<Exam> => {
  console.log('Fetching exam with ID:', examId);

  // Check if exam exists in mock data
  if (mockExams[examId]) {
    console.log('Using mock data for exam');
    return mockExams[examId];
  }

  // For exams not found in mock data, create a generic one
  return {
    id: examId,
    title: 'Sample Exam',
    description: 'This is a sample exam',
    createdAt: new Date().toISOString(),
    createdBy: 'system',
    examType: 'Sample'
  };
};
