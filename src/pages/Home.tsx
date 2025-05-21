
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExams } from '@/services/supabaseApi';
import { Exam } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams
  });

  if (error) {
    console.error('Failed to load exams:', error);
  }

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
                  {exams?.map((exam) => (
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
                      <CardContent>
                        <p className="text-gray-500">{exam.description}</p>
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
