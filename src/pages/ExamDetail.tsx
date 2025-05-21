import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExam, getTestsByExam } from '@/services/supabaseApi';
import { Exam, Test } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback data for mock exam IDs
const mockExams: Record<string, Exam> = {
  "1": {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Mathematics Exam",
    description: "Test your knowledge of algebra, geometry, and calculus",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    examType: "General",
  },
  "2": {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Science Exam",
    description: "Physics, chemistry and biology concepts for high school students",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    examType: "General",
  },
  "3": {
    id: "00000000-0000-0000-0000-000000000003",
    title: "English Literature",
    description: "Analyze literary works and demonstrate understanding of prose and poetry",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2074&auto=format&fit=crop",
    examType: "General",
  }
};

// Fallback tests data
const mockTests: Record<string, Test[]> = {
  "1": [
    {
      id: "t-00001",
      title: "Algebra Test",
      description: "Test your knowledge of algebraic equations and expressions",
      examId: "00000000-0000-0000-0000-000000000001",
      duration: 60,
      totalQuestions: 20,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    },
    {
      id: "t-00002",
      title: "Geometry Test",
      description: "Test your knowledge of geometric principles and theorems",
      examId: "00000000-0000-0000-0000-000000000001",
      duration: 45,
      totalQuestions: 15,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    }
  ],
  "2": [
    {
      id: "t-00003",
      title: "Physics Test",
      description: "Test your knowledge of basic physics principles",
      examId: "00000000-0000-0000-0000-000000000002",
      duration: 60,
      totalQuestions: 25,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    },
    {
      id: "t-00004",
      title: "Chemistry Test",
      description: "Test your knowledge of chemical reactions and elements",
      examId: "00000000-0000-0000-0000-000000000002",
      duration: 50,
      totalQuestions: 20,
      createdAt: new Date().toISOString(),
      createdBy: "system"
    }
  ],
  "3": [
    {
      id: "t-00005",
      title: "Literature Analysis",
      description: "Analyze and interpret literature passages",
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
        
        // Handle mock IDs (either UUID format with 00000000 prefix or numeric ID)
        if (examId.startsWith('00000000') || ["1", "2", "3"].includes(examId)) {
          // Extract the numeric part from the UUID or use the ID directly
          const numericId = examId.startsWith('00000000') 
            ? examId.split('-').pop() || examId
            : examId;
          
          console.log("Using mock data for exam ID:", numericId);
          
          // Get mock data
          const mockExam = mockExams[numericId];
          const mockTestsForExam = mockTests[numericId] || [];
          
          if (mockExam) {
            setExam(mockExam);
            setTests(mockTestsForExam);
            return;
          } else {
            // If no matching mock exam, try to load from API as fallback
            console.log("No matching mock exam, trying API...");
          }
        }
        
        // Try Supabase API
        try {
          const examData = await getExam(examId);
          console.log("Exam data retrieved:", examData);
          setExam(examData);
          
          const testsData = await getTestsByExam(examId);
          console.log("Tests data retrieved:", testsData);
          setTests(testsData);
        } catch (apiError) {
          console.error('Failed to load exam from API:', apiError);
          
          // If API fails and we don't have mock data already, show an error
          if (!exam) {
            throw new Error("Could not load exam data from API");
          }
        }
      } catch (error) {
        console.error('Failed to load exam data:', error);
        setError("Failed to load exam details. Please try again later.");
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
