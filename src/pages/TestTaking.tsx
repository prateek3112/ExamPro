
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startTestAttemptApi, submitTestAttemptApi } from '@/services/api';
import { Question, Answer } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const TestTaking = () => {
  const { testId } = useParams<{ testId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const startTest = async () => {
      if (!testId || !user) return;
      
      try {
        setIsLoading(true);
        const { attempt, questions } = await startTestAttemptApi(testId, user.id);
        setAttemptId(attempt.id);
        setQuestions(questions);
        
        // Initialize answers
        const initialAnswers: Record<string, number | null> = {};
        questions.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
        
        // Set timer
        const test = await startTestAttemptApi(testId, user.id);
        setTimeLeft(test.attempt.totalQuestions > 0 ? test.attempt.totalQuestions * 60 : 1800); // Default 30 mins if no questions
      } catch (error) {
        console.error('Failed to start test:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start the test. Please try again.",
        });
        navigate(`/tests/${testId}`);
      } finally {
        setIsLoading(false);
      }
    };

    startTest();
  }, [testId, user, toast, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, selectedOption: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    
    try {
      setIsSubmitting(true);
      
      const formattedAnswers: Answer[] = Object.entries(answers).map(([questionId, selectedOption]) => {
        const question = questions.find(q => q.id === questionId);
        const isCorrect = selectedOption === question?.correctOption;
        
        return {
          questionId,
          selectedOption: selectedOption ?? -1,
          isCorrect: selectedOption !== null ? isCorrect : false,
        };
      });
      
      const result = await submitTestAttemptApi(attemptId, formattedAnswers);
      
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully!",
      });
      
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const isAllAnswered = Object.values(answers).every(answer => answer !== null);
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading test...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-exam-blue bg-opacity-10 rounded-md text-exam-blue font-medium">
              Time Left: {formatTime(timeLeft)}
            </div>
            <Button 
              variant="outline" 
              onClick={handleSubmit} 
              disabled={isSubmitting || Object.values(answers).every(a => a === null)}
            >
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
      
      <div className="container mx-auto py-8 px-4 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-6">
            {currentQuestion ? (
              <div>
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
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <p>No questions available</p>
            )}
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={answers[questions[index].id] !== null ? "default" : "outline"}
                  className={`w-full ${currentQuestionIndex === index ? 'ring-2 ring-exam-blue' : ''}`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <div className="mt-8">
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={isSubmitting || Object.values(answers).every(a => a === null)}
              >
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
    </div>
  );
};

export default TestTaking;
