
import { Exam, Question, QuestionSection, Test } from '@/types';

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

// API functions
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
