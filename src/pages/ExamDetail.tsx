
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExam, getTestsByExam } from '@/services/supabaseApi';
import { Exam, Test } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';

const ExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadExamData = async () => {
      if (!examId) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching exam with ID:", examId);
        const examData = await getExam(examId);
        console.log("Exam data retrieved:", examData);
        
        const testsData = await getTestsByExam(examId);
        console.log("Tests data retrieved:", testsData);
        
        setExam(examData);
        setTests(testsData);
      } catch (error) {
        console.error('Failed to load exam data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exam details. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadExamData();
  }, [examId, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center p-8">Loading...</div>
      </MainLayout>
    );
  }

  if (!exam) {
    return (
      <MainLayout>
        <div className="text-center p-8">Exam not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/">&larr; Back to exams</Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
          <p className="text-gray-600 mb-4">{exam.description}</p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">Available Tests</h2>
          
          {tests.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              No tests available for this exam yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{test.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">{test.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <div>Duration: {test.duration} mins</div>
                      <div>Questions: {test.totalQuestions}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/tests/${test.id}`}>Start Test</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default ExamDetail;
