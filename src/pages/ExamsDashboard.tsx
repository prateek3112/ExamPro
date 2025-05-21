
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getExams } from '@/services/supabaseApi';
import { Exam } from '@/types';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Book, BookOpen, Search } from 'lucide-react';

// Fallback exams if API fails
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
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "SSC JE",
    description: "Junior Engineer examination for technical positions",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
    examType: "SSC JE",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    title: "SSC GD",
    description: "General Duty Constable examination for paramilitary forces",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1974&auto=format&fit=crop",
    examType: "SSC GD",
  }
];

const examTypeIcons: Record<string, JSX.Element> = {
  'SSC CGL': <BookOpen className="w-5 h-5 text-blue-500" />,
  'SSC CHSL': <BookOpen className="w-5 h-5 text-green-500" />,
  'SSC MTS': <Book className="w-5 h-5 text-purple-500" />,
  'SSC JE': <Book className="w-5 h-5 text-orange-500" />,
  'SSC GD': <Book className="w-5 h-5 text-red-500" />,
  'SSC CPO': <Book className="w-5 h-5 text-indigo-500" />,
  'default': <Book className="w-5 h-5 text-gray-500" />
};

const ExamsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { data: exams, isLoading } = useQuery({
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
  
  const displayExams = exams || fallbackExams;
  
  // Get unique exam types for filtering
  const examTypes = Array.from(new Set(displayExams.map(exam => exam.examType))).filter(Boolean);
  
  // Filter exams by search query and category
  const filteredExams = displayExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? exam.examType === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">SSC Exams Dashboard</h1>
          <p className="text-gray-600 mb-6">Explore all available Staff Selection Commission examinations</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger 
                  value="all"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Exams
                </TabsTrigger>
                {examTypes.map(type => (
                  <TabsTrigger 
                    key={type} 
                    value={type}
                    onClick={() => setSelectedCategory(type)}
                  >
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center p-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading exams...</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No exams found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Link key={exam.id} to={`/exams/${exam.id}`} className="group">
                <Card className="h-full transition-all duration-200 group-hover:shadow-md overflow-hidden">
                  {exam.imageUrl && (
                    <div 
                      className="h-32 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${exam.imageUrl})` }}
                    />
                  )}
                  <CardContent className={`p-5 ${!exam.imageUrl ? 'pt-5' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {examTypeIcons[exam.examType] || examTypeIcons['default']}
                      <Badge variant="outline" className="bg-gray-50">
                        {exam.examType}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{exam.title}</h2>
                    <CardDescription className="line-clamp-2">
                      {exam.description}
                    </CardDescription>
                    <div className="flex justify-end mt-4">
                      <span className="text-sm text-blue-600 font-medium group-hover:underline">View Tests</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExamsDashboard;
