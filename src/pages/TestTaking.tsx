
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startTestAttemptApi, submitTestAttemptApi } from '@/services/api';
import { Question, Answer, QuestionSection, Test } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, AlertCircle, Loader, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const STORAGE_KEY_PREFIX = 'exam_pro_test_';

const TestTaking = () => {
  const { testId } = useParams<{ testId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<QuestionSection[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [hasError, setHasError] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter questions by section or show all if no sections
  const filteredQuestions = currentSectionId 
    ? questions.filter(q => q.sectionId === currentSectionId)
    : questions;

  // Current section details
  const currentSection = currentSectionId 
    ? sections.find(s => s.id === currentSectionId)
    : null;

  // Initialize test and load any saved progress
  useEffect(() => {
    const startTest = async () => {
      if (!testId || !user) return;
      
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Check for existing test in progress
        const savedData = localStorage.getItem(`${STORAGE_KEY_PREFIX}${testId}_${user.id}`);
        
        if (savedData) {
          try {
            const { 
              attemptId: savedAttemptId, 
              answers: savedAnswers, 
              timeLeft: savedTimeLeft, 
              questions: savedQuestions,
              sections: savedSections,
              currentSectionId: savedSectionId,
              test: savedTest 
            } = JSON.parse(savedData);
            
            if (savedAttemptId && savedAnswers && savedTimeLeft && savedQuestions) {
              setAttemptId(savedAttemptId);
              setAnswers(savedAnswers);
              setTimeLeft(savedTimeLeft);
              setQuestions(savedQuestions);
              if (savedSections) setSections(savedSections);
              if (savedSectionId) setCurrentSectionId(savedSectionId);
              if (savedTest) setTest(savedTest);
              
              toast({
                title: "Test Resumed",
                description: "Your previous progress has been restored.",
              });
              setIsLoading(false);
              return;
            }
          } catch (e) {
            // If there's an error parsing the saved data, continue with starting a new test
            console.error("Error parsing saved test data:", e);
            localStorage.removeItem(`${STORAGE_KEY_PREFIX}${testId}_${user.id}`);
          }
        }
        
        // Start a new test if no valid saved data exists
        const { attempt, questions, sections, test } = await startTestAttemptApi(testId, user.id);
        setAttemptId(attempt.id);
        setQuestions(questions);
        setTest(test);
        
        // Set sections if available
        if (sections && sections.length > 0) {
          setSections(sections);
          setCurrentSectionId(sections[0].id);
        }
        
        // Initialize answers
        const initialAnswers: Record<string, number | null> = {};
        questions.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
        
        // Set timer based on test duration
        const timeInSeconds = test.duration * 60;
        setTimeLeft(timeInSeconds);
        setLastSyncTime(Date.now());
        
        // Save initial test state
        saveTestProgress(attempt.id, initialAnswers, timeInSeconds, questions, sections, sections?.[0]?.id || null, test);
        
      } catch (error) {
        console.error('Failed to start test:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start the test. Please try again.",
        });
        setHasError(true);
        navigate(`/tests/${testId}`);
      } finally {
        setIsLoading(false);
      }
    };

    startTest();
  }, [testId, user, toast, navigate]);

  // Save test progress to localStorage
  const saveTestProgress = (
    currentAttemptId: string, 
    currentAnswers: Record<string, number | null>,
    currentTimeLeft: number,
    currentQuestions: Question[],
    currentSections?: QuestionSection[],
    sectionId?: string | null,
    currentTest?: Test | null
  ) => {
    if (!testId || !user) return;
    
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${testId}_${user.id}`, 
        JSON.stringify({
          attemptId: currentAttemptId,
          answers: currentAnswers,
          timeLeft: currentTimeLeft,
          questions: currentQuestions,
          sections: currentSections || [],
          currentSectionId: sectionId,
          test: currentTest,
          lastSaved: Date.now(),
        })
      );
    } catch (e) {
      console.error("Error saving test progress:", e);
    }
  };

  // Timer and auto-save functionality
  useEffect(() => {
    if (isLoading || !attemptId || timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        
        // Time's up
        if (newTimeLeft <= 0) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        
        // Save progress every minute
        if (newTimeLeft % 60 === 0) {
          saveTestProgress(attemptId, answers, newTimeLeft, questions, sections, currentSectionId, test);
        }
        
        // Adjust time if drift detected (every 5 minutes)
        const now = Date.now();
        if (now - lastSyncTime > 5 * 60 * 1000) {
          setLastSyncTime(now);
          saveTestProgress(attemptId, answers, newTimeLeft, questions, sections, currentSectionId, test);
        }
        
        return newTimeLeft;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, isLoading, attemptId, answers, questions, sections, currentSectionId, lastSyncTime, test]);

  const handleAnswerSelect = (questionId: string, selectedOption: number) => {
    setAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [questionId]: selectedOption,
      };
      
      // Save progress immediately when an answer changes
      if (attemptId) {
        saveTestProgress(attemptId, updatedAnswers, timeLeft, questions, sections, currentSectionId, test);
      }
      
      return updatedAnswers;
    });
  };

  const handleSectionChange = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    setCurrentQuestionIndex(0); // Reset to first question in the section
    
    // Save section change
    if (attemptId) {
      saveTestProgress(attemptId, answers, timeLeft, questions, sections, sectionId, test);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const confirmSubmit = () => {
    const unansweredCount = Object.values(answers).filter(a => a === null).length;
    if (unansweredCount > 0) {
      setShowConfirmDialog(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    
    try {
      setIsSubmitting(true);
      
      const formattedAnswers: Answer[] = Object.entries(answers).map(([questionId, selectedOption]) => {
        const question = questions.find(q => q.id === questionId);
        const isCorrect = selectedOption !== null && question ? selectedOption === question.correctOption : false;
        
        return {
          questionId,
          selectedOption: selectedOption !== null ? selectedOption : -1,
          isCorrect: isCorrect,
        };
      });
      
      await submitTestAttemptApi(attemptId, formattedAnswers);
      
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully!",
      });
      
      // Clear saved test data
      if (testId && user) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${testId}_${user.id}`);
      }
      
      navigate(`/results/${attemptId}`);
    } catch (error) {
      console.error('Failed to submit test:', error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to submit the test. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Calculate section progress
  const getSectionProgress = (sectionId: string) => {
    const sectionQuestions = questions.filter(q => q.sectionId === sectionId);
    if (sectionQuestions.length === 0) return 0;
    
    const answeredCount = sectionQuestions.filter(q => answers[q.id] !== null).length;
    return Math.round((answeredCount / sectionQuestions.length) * 100);
  };

  const isAllAnswered = Object.values(answers).every(answer => answer !== null);
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const unansweredCount = Object.values(answers).filter(a => a === null).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin h-10 w-10 text-exam-blue mb-4" />
        <p className="text-xl">Loading test...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unable to load test</h2>
        <p className="mb-4">There was a problem starting your test. Please try again later.</p>
        <Button onClick={() => navigate(`/tests/${testId}`)}>
          Back to Test Details
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto p-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
          <div className="flex flex-col">
            <div className="text-lg font-semibold">
              {test?.title || "Test"}
            </div>
            <div className="text-sm text-gray-500">
              {currentSection 
                ? `${currentSection.title} - Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}`
                : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
            <div className="p-2 bg-exam-blue bg-opacity-10 rounded-md text-exam-blue font-medium">
              Time Left: {formatTime(timeLeft)}
            </div>
            <Button 
              variant="outline" 
              onClick={confirmSubmit} 
              disabled={isSubmitting || Object.values(answers).every(a => a === null)}
            >
              {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-2">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {answeredCount} of {questions.length} answered
            </div>
            <Progress value={progressPercentage} className="h-2 flex-grow" />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-4 px-4 md:py-8 grid md:grid-cols-3 gap-4 md:gap-8">
        <div className="md:col-span-2 space-y-4">
          {/* Section Tabs */}
          {sections.length > 0 && (
            <Card className="p-4">
              <Tabs 
                defaultValue={currentSectionId || sections[0]?.id} 
                onValueChange={handleSectionChange}
                className="w-full"
              >
                <TabsList className="w-full overflow-x-auto flex justify-start mb-2">
                  {sections.map(section => (
                    <TabsTrigger 
                      key={section.id} 
                      value={section.id}
                      className="flex items-center gap-2"
                    >
                      {section.title}
                      <span className="text-xs">
                        ({getSectionProgress(section.id)}%)
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {sections.map(section => (
                  <TabsContent key={section.id} value={section.id} className="mt-0">
                    <div className="text-sm text-gray-600">
                      {section.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <BookOpen className="h-4 w-4 text-exam-blue" />
                      <span className="text-sm font-medium">{section.questionCount} questions</span>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          )}
          
          {/* Question Card */}
          <Card className="p-4 md:p-6">
            {currentQuestion ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <Badge variant="outline" className="font-normal">
                    Question {currentQuestionIndex + 1}/{filteredQuestions.length}
                  </Badge>
                  {currentSection && (
                    <Badge className="bg-exam-blue">
                      {currentSection.title}
                    </Badge>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
                
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || undefined}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>
                  <Button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === filteredQuestions.length - 1}
                    className="flex items-center"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p>No questions available for this section</p>
            )}
          </Card>
        </div>
        
        {/* Navigation Panel */}
        <div className="space-y-4">
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold mb-4">Test Overview</h3>
            {test && (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Questions:</span>
                  <span className="font-medium">{test.totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time Remaining:</span>
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Questions Answered:</span>
                  <span className="font-medium">{answeredCount} / {questions.length}</span>
                </div>
              </div>
            )}
            
            {sections.length > 0 && (
              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-sm">Section Progress:</h4>
                {sections.map(section => {
                  const progress = getSectionProgress(section.id);
                  return (
                    <div key={section.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{section.title}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
          
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold mb-4">Question Navigation</h3>
            {sections.length > 0 && currentSection && (
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Section:</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={currentSectionId || sections[0]?.id}
                  onChange={(e) => handleSectionChange(e.target.value)}
                >
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>{section.title}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-5 gap-2">
              {filteredQuestions.map((_, index) => {
                const questionId = filteredQuestions[index].id;
                const isAnswered = answers[questionId] !== null;
                
                return (
                  <Button
                    key={index}
                    variant={isAnswered ? "default" : "outline"}
                    className={`w-full h-10 p-0 ${currentQuestionIndex === index ? 'ring-2 ring-exam-blue' : ''}`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-8">
              <Button 
                className="w-full" 
                onClick={confirmSubmit}
                disabled={isSubmitting || Object.values(answers).every(a => a === null)}
              >
                {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
              <div className="text-xs text-gray-500 text-center mt-2">
                {isAllAnswered 
                  ? 'All questions answered' 
                  : `${questions.length - answeredCount} questions unanswered`}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Incomplete Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
              Are you sure you want to submit your test?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit Anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestTaking;
