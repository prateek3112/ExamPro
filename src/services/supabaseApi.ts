import { supabase } from "@/integrations/supabase/client";
import { User, Exam, Test, Question, TestAttempt, Answer, QuestionSection, ExamSection, PreparationResource } from '../types';

// Helper function to handle API errors consistently
const handleApiError = (error: any, operation: string, details: string = '') => {
  console.error(`Error ${operation}:`, error);
  
  // Create a more informative error message
  const message = `Failed to ${operation}: ${error.message || 'Database connection issue'}`;
  if (details) {
    console.error(details);
  }
  
  throw new Error(message);
};

// Exams API
export const getExams = async () => {
  try {
    console.log("Fetching all exams");
    const { data, error } = await supabase
      .from('exams')
      .select('*');
    
    if (error) {
      handleApiError(error, "fetch exams");
    }
    
    if (!data || data.length === 0) {
      console.log("No exams found");
      return [];
    }
    
    console.log("Exams retrieved successfully:", data);
    return data.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description || '',
      createdAt: exam.created_at,
      createdBy: exam.created_by || '',
      imageUrl: exam.image_url,
      examType: exam.exam_type || ''
    })) as Exam[];
  } catch (error) {
    console.error("Exception in getExams:", error);
    throw error;
  }
};

export const getExam = async (id: string) => {
  try {
    console.log("Fetching exam with ID:", id);
    
    // Validate ID format
    if (!id || id === "undefined" || id === "null") {
      console.error("Invalid exam ID:", id);
      throw new Error(`Invalid exam ID: ${id}`);
    }
    
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      handleApiError(error, "fetch exam", `ID: ${id}`);
    }
    
    if (!data) {
      console.error("No exam found with ID:", id);
      throw new Error(`Exam not found with ID: ${id}`);
    }
    
    console.log("Exam retrieved successfully:", data);
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      createdAt: data.created_at,
      createdBy: data.created_by || '',
      imageUrl: data.image_url,
      examType: data.exam_type || ''
    } as Exam;
  } catch (error) {
    console.error("Exception in getExam:", error);
    throw error;
  }
};

export const createExam = async (exam: Omit<Exam, 'id' | 'createdAt' | 'createdBy'>, userId: string) => {
  try {
    // Convert from camelCase to snake_case for insertion
    const examData = {
      title: exam.title,
      description: exam.description,
      exam_type: exam.examType,
      image_url: exam.imageUrl,
      created_by: userId
    };

    const { data, error } = await supabase
      .from('exams')
      .insert(examData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating exam:", error);
      throw new Error(`Failed to create exam: ${error.message}`);
    }
    
    // Map from snake_case to camelCase
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      createdAt: data.created_at,
      createdBy: data.created_by || '',
      examType: data.exam_type || '',
      imageUrl: data.image_url
    } as Exam;
  } catch (error) {
    console.error("Exception in createExam:", error);
    throw error;
  }
};

// New function to get exam sections
export const getExamSections = async (examId: string) => {
  try {
    console.log("Fetching exam sections for exam ID:", examId);
    const { data, error } = await supabase
      .from('exam_sections')
      .select('*')
      .eq('exam_id', examId);
    
    if (error) {
      console.error("Error fetching exam sections:", error);
      throw new Error(`Failed to fetch exam sections: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No sections found for exam ID:", examId);
      return [];
    }
    
    console.log("Exam sections retrieved successfully:", data);
    return data.map(section => ({
      id: section.id,
      examId: section.exam_id || '',
      name: section.name,
      description: section.description || '',
      icon: section.icon || ''
    })) as ExamSection[];
  } catch (error) {
    console.error("Exception in getExamSections:", error);
    throw error;
  }
};

// New function to get preparation resources
export const getPreparationResources = async (examId: string) => {
  try {
    console.log("Fetching preparation resources for exam ID:", examId);
    const { data, error } = await supabase
      .from('preparation_resources')
      .select('*')
      .eq('exam_id', examId);
    
    if (error) {
      console.error("Error fetching preparation resources:", error);
      throw new Error(`Failed to fetch preparation resources: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No resources found for exam ID:", examId);
      return [];
    }
    
    console.log("Preparation resources retrieved successfully:", data);
    return data.map(resource => ({
      id: resource.id,
      examId: resource.exam_id || '',
      title: resource.title,
      description: resource.description || '',
      resourceType: resource.resource_type as 'tip' | 'study_plan' | 'syllabus' | 'pdf' | 'video',
      url: resource.url || '',
      createdAt: resource.created_at || new Date().toISOString()
    })) as PreparationResource[];
  } catch (error) {
    console.error("Exception in getPreparationResources:", error);
    throw error;
  }
};

// Tests API
export const getTestsByExam = async (examId: string) => {
  try {
    console.log("Fetching tests for exam ID:", examId);
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('exam_id', examId);
    
    if (error) {
      console.error("Error fetching tests:", error);
      throw new Error(`Failed to fetch tests: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No tests found for exam ID:", examId);
      return [];
    }
    
    console.log("Tests retrieved successfully:", data);
    // Map from snake_case to camelCase
    return data.map(test => ({
      id: test.id,
      title: test.title,
      description: test.description || '',
      examId: test.exam_id,
      duration: test.duration,
      totalQuestions: test.total_questions,
      createdAt: test.created_at,
      createdBy: test.created_by || ''
    })) as Test[];
  } catch (error) {
    console.error("Exception in getTestsByExam:", error);
    throw error;
  }
};

export const getTest = async (id: string) => {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Map from snake_case to camelCase
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    examId: data.exam_id,
    duration: data.duration,
    totalQuestions: data.total_questions,
    createdAt: data.created_at,
    createdBy: data.created_by || ''
  } as Test;
};

export const createTest = async (test: Omit<Test, 'id' | 'createdAt' | 'createdBy'>, userId: string) => {
  const { data, error } = await supabase
    .from('tests')
    .insert({
      title: test.title,
      description: test.description,
      exam_id: test.examId,
      duration: test.duration,
      total_questions: test.totalQuestions,
      created_by: userId
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Map from snake_case to camelCase
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    examId: data.exam_id,
    duration: data.duration,
    totalQuestions: data.total_questions,
    createdAt: data.created_at,
    createdBy: data.created_by || ''
  } as Test;
};

// Sections API
export const getSectionsByExam = async (examId: string) => {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('exam_id', examId);
  
  if (error) throw error;
  
  // Map from snake_case to camelCase
  return data.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description,
    questionCount: section.question_count
  })) as QuestionSection[];
};

// Questions API
export const getQuestionsByTest = async (testId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_id', testId);
  
  if (error) throw error;
  
  // Map from snake_case to camelCase
  return data.map(question => ({
    id: question.id,
    testId: question.test_id,
    sectionId: question.section_id,
    text: question.text,
    options: question.options as string[],
    correctOption: question.correct_option,
    explanation: question.explanation
  })) as Question[];
};

export const createQuestion = async (question: Omit<Question, 'id'>) => {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      test_id: question.testId,
      section_id: question.sectionId,
      text: question.text,
      options: question.options,
      correct_option: question.correctOption,
      explanation: question.explanation
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Map from snake_case to camelCase
  return {
    id: data.id,
    testId: data.test_id,
    sectionId: data.section_id,
    text: data.text,
    options: data.options as string[],
    correctOption: data.correct_option,
    explanation: data.explanation
  } as Question;
};

// Test attempts API
export const startTestAttempt = async (testId: string, userId: string, selectedSections?: string[]) => {
  // Get test details
  const test = await getTest(testId);
  
  // Get all questions for the test
  let questions = await getQuestionsByTest(testId);
  
  // Get sections for the test's exam
  const sections = await getSectionsByExam(test.examId);
  
  // Filter questions by selected sections if applicable
  let filteredQuestions = [...questions];
  if (selectedSections && selectedSections.length > 0) {
    filteredQuestions = questions.filter(q => q.sectionId && selectedSections.includes(q.sectionId));
    console.log("Filtered questions count:", filteredQuestions.length);
  }
  
  // If no questions were filtered (maybe because sectionId is missing), use all questions
  if (filteredQuestions.length === 0) {
    filteredQuestions = [...questions];
    console.log("Using all questions instead:", filteredQuestions.length);
  }
  
  // Filter sections by selected sections if applicable
  let filteredSections = [...sections];
  if (selectedSections && selectedSections.length > 0) {
    filteredSections = sections.filter(s => selectedSections.includes(s.id));
    console.log("Filtered sections:", filteredSections);
  }
  
  // Create a new test attempt
  const { data, error } = await supabase
    .from('test_attempts')
    .insert({
      test_id: testId,
      user_id: userId,
      total_questions: filteredQuestions.length,
      selected_sections: selectedSections
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Map to our client-side types
  const attempt: TestAttempt = {
    id: data.id,
    testId: data.test_id,
    userId: data.user_id,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    score: data.score,
    totalQuestions: data.total_questions,
    answers: [],
    selectedSections: data.selected_sections as string[] | undefined
  };
  
  return {
    attempt,
    questions: filteredQuestions,
    sections: filteredSections,
    test
  };
};

export const submitTestAttempt = async (attemptId: string, answers: Answer[]) => {
  // First, update each answer in the answers table
  for (const answer of answers) {
    const { error } = await supabase
      .from('answers')
      .insert({
        attempt_id: attemptId,
        question_id: answer.questionId,
        selected_option: answer.selectedOption,
        is_correct: answer.isCorrect
      });
    
    if (error) throw error;
  }
  
  // Calculate the score
  const score = answers.filter(a => a.isCorrect).length;
  
  // Update the test attempt with the score and completion time
  const { data, error } = await supabase
    .from('test_attempts')
    .update({
      completed_at: new Date().toISOString(),
      score
    })
    .eq('id', attemptId)
    .select()
    .single();
  
  if (error) throw error;
  
  // Map to our client-side types
  return {
    id: data.id,
    testId: data.test_id,
    userId: data.user_id,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    score: data.score,
    totalQuestions: data.total_questions,
    answers,
    selectedSections: data.selected_sections as string[] | undefined
  } as TestAttempt;
};

export const getTestAttempts = async (userId: string) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Map to our client-side types
  return data.map(attempt => ({
    id: attempt.id,
    testId: attempt.test_id,
    userId: attempt.user_id,
    startedAt: attempt.started_at,
    completedAt: attempt.completed_at,
    score: attempt.score,
    totalQuestions: attempt.total_questions,
    answers: [],
    selectedSections: attempt.selected_sections as string[] | undefined
  })) as TestAttempt[];
};

export const getTestAttempt = async (attemptId: string) => {
  // Get the test attempt
  const { data: attemptData, error: attemptError } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('id', attemptId)
    .single();
  
  if (attemptError) throw attemptError;
  
  // Get the associated test
  const test = await getTest(attemptData.test_id);
  
  // Get the associated exam
  const exam = await getExam(test.examId);
  
  // Get all answers for this attempt
  const { data: answersData, error: answersError } = await supabase
    .from('answers')
    .select('*')
    .eq('attempt_id', attemptId);
  
  if (answersError) throw answersError;
  
  // Get all questions for the test
  const questions = await getQuestionsByTest(test.id);
  
  // Fix: Proper type checking for selected_sections
  const selectedSectionsArray = Array.isArray(attemptData.selected_sections) 
    ? attemptData.selected_sections as string[]
    : [];
  
  // Filter questions by selected sections if applicable
  const filteredQuestions = selectedSectionsArray.length > 0
    ? questions.filter(q => q.sectionId && selectedSectionsArray.includes(q.sectionId))
    : questions;
  
  // Map answers to our client-side types
  const answers = answersData.map(answer => ({
    questionId: answer.question_id,
    selectedOption: answer.selected_option,
    isCorrect: answer.is_correct
  })) as Answer[];
  
  // Map attempt to our client-side types
  const attempt: TestAttempt = {
    id: attemptData.id,
    testId: attemptData.test_id,
    userId: attemptData.user_id,
    startedAt: attemptData.started_at,
    completedAt: attemptData.completed_at,
    score: attemptData.score,
    totalQuestions: attemptData.total_questions,
    answers,
    selectedSections: selectedSectionsArray
  };
  
  return {
    attempt,
    test,
    exam,
    questions: filteredQuestions,
  };
};
