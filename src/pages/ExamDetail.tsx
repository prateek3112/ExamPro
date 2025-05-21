
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExam, getTestsByExam } from '@/services/supabaseApi';
import { Exam, Test } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// Fallback data for mock exams
const mockExams: Record<string, Exam> = {
  "00000000-0000-0000-0000-000000000001": {
    id: "00000000-0000-0000-0000-000000000001",
    title: "JEE Exam",
    description: "Joint Entrance Examination for engineering college admissions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    examType: "JEE",
  },
  "00000000-0000-0000-0000-000000000002": {
    id: "00000000-0000-0000-0000-000000000002",
    title: "SSC Exam",
    description: "Staff Selection Commission examination for government positions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    examType: "SSC",
  },
  "00000000-0000-0000-0000-000000000003": {
    id: "00000000-0000-0000-0000-000000000003",
    title: "NEET Exam",
    description: "National Eligibility cum Entrance Test for medical admissions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2074&auto=format&fit=crop",
    examType: "NEET",
  }
};

// Fallback tests data
const mockTests: Record<string, Test[]> = {
  "00000000-0000-0000-0000-000000000001": [
    {
      id: "t-00001",
      title: "JEE Maths Test",
      description: "Test your knowledge of mathematical concepts for JEE",
      examId: "00000000-0000-0000-0000-000000000001",
      duration: 60,
      totalQuestions: 20,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    },
    {
      id: "t-00002",
      title: "JEE Physics Test",
      description: "Test your knowledge of physics principles and problem solving",
      examId: "00000000-0000-0000-0000-000000000001",
      duration: 45,
      totalQuestions: 15,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    }
  ],
  "00000000-0000-0000-0000-000000000002": [
    {
      id: "t-00003",
      title: "SSC English Test",
      description: "Test your knowledge of grammar and vocabulary",
      examId: "00000000-0000-0000-0000-000000000002",
      duration: 60,
      totalQuestions: 25,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    },
    {
      id: "t-00004",
      title: "SSC General Knowledge Test",
      description: "Test your knowledge of current affairs and general knowledge",
      examId: "00000000-0000-0000-0000-000000000002",
      duration: 50,
      totalQuestions: 20,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    }
  ],
  "00000000-0000-0000-0000-000000000003": [
    {
      id: "t-00005",
      title: "NEET Biology Test",
      description: "Analyze your understanding of biological concepts and systems",
      examId: "00000000-0000-0000-0000-000000000003",
      duration: 90,
      totalQuestions: 10,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    }
  ]
};

const ExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadExamData = async () => {
      if (!examId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching exam with ID:", examId);
        
        // Check if this is a mock exam ID first
        if (mockExams[examId]) {
          console.log("Using mock data for exam ID:", examId);
          setExam(mockExams[examId]);
          setTests(mockTests[examId] || []);
          setIsLoading(false);
          return;
        }
        
        // Try Supabase API with error handling
        try {
          const examData = await getExam(examId);
          console.log("Exam data retrieved:", examData);
          setExam(examData);
          
          const testsData = await getTestsByExam(examId);
          console.log("Tests data retrieved:", testsData);
          setTests(testsData);
        } catch (apiError) {
          console.error('Failed to load exam from API:', apiError);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Could not connect to database. Using demo data instead."
          });
          
          // If the API fails, try to extract ID from UUID format if possible
          const numericId = examId.split('-')[4] || examId;
          const cleanId = numericId.replace(/[^0-9]/g, '');
          const mockId = `00000000-0000-0000-0000-00000000000${cleanId.slice(-1)}`;
          
          if (mockExams[mockId]) {
            console.log("Falling back to mock data with ID:", mockId);
            setExam(mockExams[mockId]);
            setTests(mockTests[mockId] || []);
          } else {
            // Use the first mock exam as fallback
            const firstMockId = Object.keys(mockExams)[0];
            console.log("Using first available mock exam as fallback");
            setExam(mockExams[firstMockId]);
            setTests(mockTests[firstMockId] || []);
          }
        }
      } catch (error) {
        console.error('Failed to load exam data:', error);
        setError("Failed to load exam details. Please try again later.");
        
        // Ultimate fallback - use the first mock exam
        const firstMockId = Object.keys(mockExams)[0];
        console.log("Using first available mock exam as final fallback");
        setExam(mockExams[firstMockId]);
        setTests(mockTests[firstMockId] || []);
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exam details, using demo data instead."
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
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div>
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !exam) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Exam not found"}
          </h2>
          <p className="mb-6">The requested exam could not be found or loaded.</p>
          <Button asChild>
            <Link to="/">&larr; Back to exams</Link>
          </Button>
        </div>
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
        
        {isLoading ? (
          <div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-24 w-full mb-8" />
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        ) : exam ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                {exam.examType && (
                  <Badge variant="outline" className="bg-exam-blue/10 hover:bg-exam-blue/20 border-exam-blue/20 text-exam-blue">
                    {exam.examType}
                  </Badge>
                )}
              </div>
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
          </>
        ) : (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {error || "Exam not found"}
            </h2>
            <p className="mb-6">The requested exam could not be found or loaded.</p>
            <Button asChild>
              <Link to="/">&larr; Back to exams</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExamDetail;
