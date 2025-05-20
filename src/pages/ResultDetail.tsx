
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTestAttemptApi } from '@/services/api';
import { Question, TestAttempt, Test, Exam } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layouts/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';

const ResultDetail = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const loadResultData = async () => {
      if (!resultId) return;
      
      try {
        setIsLoading(true);
        const { attempt, test, exam, questions } = await getTestAttemptApi(resultId);
        setAttempt(attempt);
        setTest(test);
        setExam(exam);
        setQuestions(questions);
      } catch (error) {
        console.error('Failed to load result data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResultData();
  }, [resultId]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center p-8">Loading result...</div>
      </MainLayout>
    );
  }

  if (!attempt || !test || !exam) {
    return (
      <MainLayout>
        <div className="text-center p-8">Result not found</div>
      </MainLayout>
    );
  }

  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = attempt.answers.filter(a => !a.isCorrect).length;
  const unansweredQuestions = attempt.totalQuestions - attempt.answers.length;
  const score = attempt.score;
  const scorePercentage = (score / attempt.totalQuestions) * 100;
  
  const chartData = [
    { name: 'Correct', value: correctAnswers, color: '#4ade80' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#f87171' },
    { name: 'Unanswered', value: unansweredQuestions, color: '#d1d5db' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/my-attempts">&larr; Back to My Attempts</Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-2">{test.title} - Results</h1>
          <div className="text-gray-600">
            {exam.title} • Completed on {new Date(attempt.completedAt || '').toLocaleString()}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-gray-500">Total Score</div>
                  <div className="text-4xl font-bold flex items-baseline">
                    {scorePercentage.toFixed(1)}%
                    <span className="text-base text-gray-500 ml-2">
                      ({score}/{attempt.totalQuestions})
                    </span>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Needs Improvement</span>
                    <span>Excellent</span>
                  </div>
                  <Progress value={scorePercentage} className="h-3" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Correct</div>
                  <div className="text-xl font-semibold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-gray-500">
                    {((correctAnswers / attempt.totalQuestions) * 100).toFixed(1)}% of total
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Incorrect</div>
                  <div className="text-xl font-semibold text-red-600">{incorrectAnswers}</div>
                  <div className="text-sm text-gray-500">
                    {((incorrectAnswers / attempt.totalQuestions) * 100).toFixed(1)}% of total
                  </div>
                </div>
                
                {unansweredQuestions > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Unanswered</div>
                    <div className="text-xl font-semibold text-gray-600">{unansweredQuestions}</div>
                    <div className="text-sm text-gray-500">
                      {((unansweredQuestions / attempt.totalQuestions) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Answer Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} questions`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-4">
                {chartData.map((entry, index) => (
                  <div key={index} className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto" style={{ backgroundColor: entry.color }}></div>
                    <div className="text-sm mt-1">{entry.name}</div>
                    <div className="font-semibold">{entry.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">Question Review</h2>
          <div className="space-y-4">
            {questions.map((question, idx) => {
              const answer = attempt.answers.find(a => a.questionId === question.id);
              const isExpanded = expandedQuestion === question.id;
              
              return (
                <Card key={question.id} className="overflow-hidden">
                  <div 
                    className={`p-4 cursor-pointer flex justify-between items-center ${
                      answer?.isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        answer?.isCorrect 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {answer?.isCorrect ? <Check size={16} /> : <X size={16} />}
                      </div>
                      <div>
                        <span className="font-medium">Question {idx + 1}</span>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {question.text}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 border-t">
                      <p className="font-medium mb-4">{question.text}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <div 
                            key={optIdx} 
                            className={`p-3 rounded-md ${
                              question.correctOption === optIdx
                                ? 'bg-green-100 border border-green-200'
                                : answer?.selectedOption === optIdx
                                  ? 'bg-red-100 border border-red-200'
                                  : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {question.correctOption === optIdx && (
                              <span className="text-green-600 ml-2 text-sm">(Correct)</span>
                            )}
                            {answer?.selectedOption === optIdx && question.correctOption !== optIdx && (
                              <span className="text-red-600 ml-2 text-sm">(Your Answer)</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-md">
                          <div className="text-sm font-semibold text-blue-700 mb-1">Explanation</div>
                          <div className="text-sm text-blue-900">{question.explanation}</div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
        
        <div className="flex justify-center pt-4">
          <Button asChild>
            <Link to={`/exams/${test.examId}`}>Explore More Tests</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResultDetail;
