
import { Link } from 'react-router-dom';
import { getExams } from '@/services/supabaseApi';
import { Exam } from '@/types';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

const ExamsList = () => {
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams
  });

  if (error) {
    console.error('Failed to load exams:', error);
  }

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
        ) : exams?.length === 0 ? (
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
            {exams?.map((exam) => (
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
