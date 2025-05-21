
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExams } from '@/services/supabaseApi';
import { Exam } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

// Fallback data in case API fails
const fallbackExams: Exam[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "JEE Exam",
    description: "Joint Entrance Examination for engineering college admissions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    examType: "JEE",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "SSC Exam",
    description: "Staff Selection Commission examination for government positions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    examType: "SSC",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "NEET Exam",
    description: "National Eligibility cum Entrance Test for medical admissions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2074&auto=format&fit=crop",
    examType: "NEET",
  }
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error('Failed to load exams:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Unable to connect to the database. Using sample data instead."
        });
      },
    }
  });

  // Use fallback data if there's an error or no exams returned
  const displayExams = error || !exams || exams.length === 0 ? fallbackExams : exams;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center py-8 bg-gradient-to-r from-exam-blue to-exam-teal rounded-lg text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to ExamPro</h1>
          <p className="text-xl max-w-2xl mx-auto">
            The ultimate online test-taking platform to assess and improve your knowledge
          </p>
        </div>

        {isAuthenticated ? (
          <>
            <section>
              <h2 className="text-2xl font-bold mb-6">Available Exams</h2>
              {isLoading ? (
                <div className="text-center p-8">Loading exams...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayExams.map((exam) => (
                    <Card key={exam.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {exam.imageUrl && (
                        <div 
                          className="h-40 bg-cover bg-center" 
                          style={{ backgroundImage: `url(${exam.imageUrl})` }}
                        />
                      )}
                      <CardHeader>
                        <CardTitle>{exam.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-gray-500">{exam.description}</p>
                        {exam.examType && (
                          <div className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-exam-blue/10 text-exam-blue">
                            {exam.examType}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link to={`/exams/${exam.id}`}>View Tests</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="text-center py-12 space-y-6">
            <h2 className="text-2xl font-bold">Get Started Today</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create an account to access all exams and track your progress. Already have an account? Log in to continue your learning journey.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/register">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
