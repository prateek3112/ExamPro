
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTestApi } from '@/services/api';
import { Test } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layouts/MainLayout';

const TestDetail = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center p-8">Loading...</div>
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
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold">{test.title}</h1>
          <p className="text-gray-600">{test.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="text-xl font-semibold">{test.duration} minutes</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Questions</div>
              <div className="text-xl font-semibold">{test.totalQuestions} questions</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Instructions:</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>The test will be timed and will automatically submit once the time is up.</li>
              <li>You can navigate between questions during the test.</li>
              <li>You can review your answers before submitting the test.</li>
              <li>Each question has only one correct answer.</li>
              <li>Once submitted, you cannot retake the test immediately.</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Button 
              size="lg" 
              className="w-full" 
              onClick={() => setIsDialogOpen(true)}
            >
              Start Test
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to begin?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start "{test.title}" with a time limit of {test.duration} minutes. 
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
