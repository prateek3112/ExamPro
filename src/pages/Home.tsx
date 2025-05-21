
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
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users } from 'lucide-react';

// Fallback data in case API fails
const fallbackExams: Exam[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "SSC CGL",
    description: "Combined Graduate Level Examination for various Group B and C posts",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop",
    examType: "SSC CGL",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "SSC CHSL",
    description: "Combined Higher Secondary Level for Data Entry Operators and LDC posts",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1972&auto=format&fit=crop",
    examType: "SSC CHSL",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "SSC MTS",
    description: "Multi Tasking Staff examination for Group C non-technical posts",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1970&auto=format&fit=crop",
    examType: "SSC MTS",
  }
];

const testimonials = [
  {
    name: "Priya Singh",
    text: "Thanks to this platform, I cleared SSC CGL 2023 in my first attempt. The mock tests are exactly like the real exam!",
    role: "Selected for Tax Assistant"
  },
  {
    name: "Rahul Kumar",
    text: "The sectional practice helped me focus on my weak areas. I improved my quantitative score by 30% within a month.",
    role: "SSC CHSL Qualifier"
  },
  {
    name: "Anita Sharma",
    text: "The previous year papers with detailed explanations made all the difference in my preparation strategy.",
    role: "Selected for SSC JE"
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
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center py-12 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Prepare for SSC Exams the Smart Way</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Access thousands of questions, full-length mock tests, and sectional practice to ace your SSC exams
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
              <Link to={isAuthenticated ? "/exams" : "/register"}>
                Start Practicing for Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-blue-700/30">
              <Link to="/exams">
                Explore Mock Tests
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured Exams Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">SSC Exams</h2>
            <Button variant="ghost" asChild>
              <Link to="/exams">View All</Link>
            </Button>
          </div>
          
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
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>Multiple Tests</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>100k+ Students</span>
                      </div>
                    </div>
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

        {/* Benefits Section */}
        <section className="py-12 bg-gray-50 rounded-lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The most comprehensive SSC exam preparation platform with real exam-like experience</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600">Full syllabus coverage with topic-wise questions and tests for all SSC exams</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Exam Environment</h3>
              <p className="text-gray-600">Timed tests with real exam pattern and difficulty level to build exam temperament</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Detailed analysis of your performance to help you focus on weak areas</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">What Our Students Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-6">
                  <p className="italic text-gray-600 mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="text-center py-12 bg-blue-50 rounded-lg space-y-6">
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
