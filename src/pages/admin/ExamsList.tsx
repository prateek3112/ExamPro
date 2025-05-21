
import { Link } from 'react-router-dom';
import { getExams } from '@/services/supabaseApi';
import { Exam } from '@/types';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

// Fallback data for when the API fails
const fallbackExams: Exam[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Mathematics Exam",
    description: "Test your knowledge of algebra, geometry, and calculus",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    examType: "General",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Science Exam",
    description: "Physics, chemistry and biology concepts for high school students",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    examType: "General",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "English Literature",
    description: "Analyze literary works and demonstrate understanding of prose and poetry",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2074&auto=format&fit=crop",
    examType: "General",
  }
];

const ExamsList = () => {
  const { toast } = useToast();
  
  const { data: examsData, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
    retry: 1,
    onError: (err) => {
      console.error('Failed to load exams:', err);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to the database. Using sample data instead."
      });
    }
  });

  // Use fallback data if API call fails
  const exams = error || !examsData || examsData.length === 0 ? fallbackExams : examsData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Exams</h1>
            <p className="text-gray-500 mt-2">Manage your exams</p>
          </div>
          <Button asChild>
            <Link to="/admin/exams/create">Create New Exam</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading exams...</div>
        ) : exams.length === 0 ? (
          <Card className="text-center">
            <CardContent className="py-8">
              <p className="text-gray-500 mb-4">No exams have been created yet.</p>
              <Button asChild>
                <Link to="/admin/exams/create">Create Your First Exam</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {exam.imageUrl && (
                  <div 
                    className="h-40 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${exam.imageUrl})` }}
                  />
                )}
                <CardHeader>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>Created on {formatDate(exam.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 line-clamp-2">{exam.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" asChild>
                    <Link to={`/admin/exams/${exam.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/admin/exams/${exam.id}/tests`}>Manage Tests</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ExamsList;
