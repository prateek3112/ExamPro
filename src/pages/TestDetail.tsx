
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTestApi, getExamApi } from '@/services/api';
import { Test, Exam } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, ListOrdered } from 'lucide-react';

const TestDetail = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTestData = async () => {
      if (!testId) return;
      
      try {
        setIsLoading(true);
        const testData = await getTestApi(testId);
        setTest(testData);
        
        // Get the exam data for additional context
        const examData = await getExamApi(testData.examId);
        setExam(examData);
      } catch (error) {
        console.error('Failed to load test data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestData();
  }, [testId]);

  const startTest = () => {
    if (testId) {
      navigate(`/tests/${testId}/take`);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} minutes` : ''}`;
    }
    return `${minutes} minutes`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-exam-blue"></div>
        </div>
      </MainLayout>
    );
  }

  if (!test) {
    return (
      <MainLayout>
        <div className="text-center p-8">Test not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to={`/exams/${test.examId}`}>&larr; Back to exam</Link>
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div>
              {exam && (
                <div className="mb-2">
                  <span className="text-sm font-medium bg-exam-blue/10 text-exam-blue py-1 px-2 rounded-md">
                    {exam.examType || exam.title}
                  </span>
                </div>
              )}
              <h1 className="text-3xl font-bold">{test.title}</h1>
              <p className="text-gray-600 mt-2">{test.description}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 py-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-exam-blue" />
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-xl font-semibold">{formatTime(test.duration)}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <ListOrdered className="h-5 w-5 text-exam-blue" />
                <div>
                  <div className="text-sm text-gray-500">Total Questions</div>
                  <div className="text-xl font-semibold">{test.totalQuestions}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-exam-blue" />
                <div>
                  <div className="text-sm text-gray-500">Exam</div>
                  <div className="text-xl font-semibold">{exam?.title || "N/A"}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Instructions:</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>The test will be timed for {formatTime(test.duration)} and will automatically submit once the time is up.</li>
                <li>You can navigate between questions and sections during the test.</li>
                <li>You can review your answers before submitting the test.</li>
                <li>Each question has only one correct answer.</li>
                <li>Your progress will be saved automatically as you answer questions.</li>
                <li>If you leave the test, you can return and continue where you left off.</li>
              </ul>
            </div>
            
            <div className="pt-6">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
              >
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to begin?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start "{test.title}" with a time limit of {formatTime(test.duration)}. 
              The timer will start immediately and the test will automatically submit once the time is up.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startTest}>Begin Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default TestDetail;
