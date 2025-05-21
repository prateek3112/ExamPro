import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTestAttemptsApi, getExamsApi, getTestApi } from '@/services/api';
import { TestAttempt, Exam, Test } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const MyAttempts = () => {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [exams, setExams] = useState<Record<string, Exam>>({});
  const [tests, setTests] = useState<Record<string, Test>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    highestScore: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch all the user's attempts
        const attemptsData = await getTestAttemptsApi(user.id);
        setAttempts(attemptsData);
        
        if (attemptsData.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Calculate statistics
        const totalScore = attemptsData.reduce((sum, attempt) => sum + attempt.score, 0);
        const totalQuestions = attemptsData.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
        const completedAttempts = attemptsData.filter(a => a.completedAt).length;
        const highestScore = Math.max(...attemptsData.map(a => (a.score / a.totalQuestions) * 100));
        
        setStats({
          totalAttempts: attemptsData.length,
          averageScore: totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0,
          completionRate: attemptsData.length > 0 ? (completedAttempts / attemptsData.length) * 100 : 0,
          highestScore,
        });
        
        // Fetch all exams
        const examsData = await getExamsApi();
        const examsMap: Record<string, Exam> = {};
        examsData.forEach(exam => {
          examsMap[exam.id] = exam;
        });
        setExams(examsMap);
        
        // Fetch all tests referenced in attempts
        const testIds = [...new Set(attemptsData.map(a => a.testId))];
        const testsMap: Record<string, Test> = {};
        
        for (const testId of testIds) {
          try {
            const test = await getTestApi(testId);
            testsMap[testId] = test;
          } catch (error) {
            console.error(`Failed to load test ${testId}:`, error);
          }
        }
        
        setTests(testsMap);
      } catch (error) {
        console.error('Failed to load attempts data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">My Test Attempts</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Loading your attempts...</div>
        ) : attempts.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6 pb-8">
              <h3 className="text-xl font-semibold mb-2">No test attempts yet</h3>
              <p className="text-gray-500 mb-6">You haven't taken any tests. Start by exploring available exams.</p>
              <Button asChild>
                <Link to="/">Browse Exams</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          // ... keep existing code (performance stats and attempts display)
          <>
            {/* Performance stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
                  <Progress value={stats.averageScore} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</div>
                  <Progress value={stats.completionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Highest Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.highestScore.toFixed(1)}%</div>
                  <Progress value={stats.highestScore} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {attempts
                .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
                .map(attempt => {
                  const test = tests[attempt.testId];
                  const exam = test ? exams[test.examId] : null;
                  const scorePercentage = (attempt.score / attempt.totalQuestions) * 100;
                  
                  return (
                    <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span>{test?.title || 'Unknown Test'}</span>
                          <span className={`text-base font-medium px-3 py-1 rounded-full ${
                            scorePercentage >= 70 
                              ? 'bg-green-100 text-green-700' 
                              : scorePercentage >= 40 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            Score: {scorePercentage.toFixed(0)}%
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-gray-500 mb-2">
                          {exam?.title || 'Unknown Exam'}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600">
                          <div>Completed on {formatDate(attempt.completedAt || attempt.startedAt)}</div>
                          <div>
                            {attempt.score} out of {attempt.totalQuestions} correct answers
                          </div>
                        </div>
                        <Progress 
                          value={scorePercentage} 
                          className={`h-2 mt-4 ${
                            scorePercentage >= 70 ? 'bg-green-100' : 
                            scorePercentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                          }`} 
                        />
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="default" className="w-full">
                          <Link to={`/results/${attempt.id}`}>View Detailed Results</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MyAttempts;
