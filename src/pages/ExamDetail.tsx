
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExam, getTestsByExam, getExamSections, getPreparationResources } from '@/services/supabaseApi';
import { Exam, Test, ExamSection, PreparationResource } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layouts/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileText, Book, Puzzle, FileQuestion, Clock, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Resource type to icon mapping
const resourceTypeIcons: Record<string, any> = {
  'tip': FileText,
  'study_plan': Book,
  'syllabus': FileText,
  'pdf': FileText,
  'video': FileText
};

// Test type to icon mapping
const testTypeIcons: Record<string, any> = {
  'full_length': Book,
  'sectional': Puzzle,
  'previous_year': FileQuestion
};

const ExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { toast } = useToast();
  
  // State for data
  const [exam, setExam] = useState<Exam | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [sections, setSections] = useState<ExamSection[]>([]);
  const [resources, setResources] = useState<PreparationResource[]>([]);
  
  // Loading states
  const [isExamLoading, setIsExamLoading] = useState(true);
  const [isTestsLoading, setIsTestsLoading] = useState(true);
  const [isSectionsLoading, setIsSectionsLoading] = useState(true);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);
  
  // Error states
  const [examError, setExamError] = useState<Error | null>(null);

  // Fetch exam data
  useEffect(() => {
    if (!examId) return;
    
    setIsExamLoading(true);
    setExamError(null);
    
    getExam(examId)
      .then((data) => {
        console.log('Exam loaded successfully:', data);
        setExam(data);
      })
      .catch((error) => {
        console.error('Failed to load exam:', error);
        setExamError(error as Error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not connect to database. Please try again later."
        });
      })
      .finally(() => {
        setIsExamLoading(false);
      });
  }, [examId, toast]);

  // Fetch tests data
  useEffect(() => {
    if (!examId) return;
    
    setIsTestsLoading(true);
    
    getTestsByExam(examId)
      .then((data) => {
        console.log('Tests loaded successfully:', data);
        setTests(data);
      })
      .catch((error) => {
        console.error('Failed to load tests:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tests. Please try again later."
        });
      })
      .finally(() => {
        setIsTestsLoading(false);
      });
  }, [examId, toast]);

  // Fetch sections data
  useEffect(() => {
    if (!examId) return;
    
    setIsSectionsLoading(true);
    
    getExamSections(examId)
      .then((data) => {
        console.log('Sections loaded successfully:', data);
        setSections(data);
      })
      .catch((error) => {
        console.error('Failed to load sections:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exam sections. Please try again later."
        });
      })
      .finally(() => {
        setIsSectionsLoading(false);
      });
  }, [examId, toast]);

  // Fetch resources data
  useEffect(() => {
    if (!examId) return;
    
    setIsResourcesLoading(true);
    
    getPreparationResources(examId)
      .then((data) => {
        console.log('Resources loaded successfully:', data);
        setResources(data);
      })
      .catch((error) => {
        console.error('Failed to load resources:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load preparation resources. Please try again later."
        });
      })
      .finally(() => {
        setIsResourcesLoading(false);
      });
  }, [examId, toast]);

  // Filter tests by type
  const fullLengthTests = tests.filter(test => test.testType === 'full_length' || !test.testType);
  const sectionalTests = tests.filter(test => test.testType === 'sectional');
  const previousYearTests = tests.filter(test => test.testType === 'previous_year');

  if (isExamLoading) {
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

  if (examError || !exam) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {examError ? `Error: ${examError.message}` : "Exam not found"}
          </h2>
          <p className="mb-6">The requested exam could not be found or loaded. Please try again later.</p>
          <Button asChild>
            <Link to="/">&larr; Back to exams</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/">&larr; Back to exams</Link>
          </Button>
        </div>
        
        {/* Exam Header */}
        <div className="relative">
          {exam.imageUrl && (
            <div 
              className="h-48 rounded-t-lg bg-cover bg-center w-full"
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${exam.imageUrl})` }}
            >
              <div className="absolute inset-0 flex items-center justify-start p-8">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">{exam.title}</h1>
                  <Badge variant="outline" className="bg-white/20 text-white">
                    {exam.examType || 'SSC Exam'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            {!exam.imageUrl && (
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
                <Badge variant="outline" className="bg-exam-blue/10 hover:bg-exam-blue/20 border-exam-blue/20 text-exam-blue">
                  {exam.examType || 'SSC Exam'}
                </Badge>
              </div>
            )}
            
            <p className="text-gray-600 mb-6">{exam.description}</p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-4 overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mock-tests">Mock Tests</TabsTrigger>
                <TabsTrigger value="sectional">Sectional Practice</TabsTrigger>
                <TabsTrigger value="previous-year">Previous Year Papers</TabsTrigger>
                <TabsTrigger value="resources">Preparation Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Exam Pattern</h2>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">Tier 1: Computer Based Test</p>
                        <p className="text-sm text-gray-600">
                          100 Questions | 60 Minutes | 200 Marks
                        </p>
                      </div>
                      {exam.examType === "SSC CGL" && (
                        <>
                          <div className="p-3 border rounded-lg">
                            <p className="font-medium">Tier 2: Computer Based Test</p>
                            <p className="text-sm text-gray-600">
                              Paper 1: 100 Questions | 120 Minutes | 200 Marks<br />
                              Paper 2: 100 Questions | 120 Minutes | 200 Marks
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <p className="font-medium">Tier 3: Descriptive Paper</p>
                            <p className="text-sm text-gray-600">
                              Essay, Letter, Application | 60 Minutes | 100 Marks
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Subjects</h2>
                    <div className="space-y-4">
                      {isSectionsLoading ? (
                        <p>Loading subjects...</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {sections.map((section) => (
                            <div key={section.id} className="flex items-center p-3 border rounded-lg">
                              <div className="mr-3">
                                {section.icon === "math" && <FileText className="w-5 h-5 text-blue-500" />}
                                {section.icon === "file-text" && <FileText className="w-5 h-5 text-red-500" />}
                                {section.icon === "brain" && <FileText className="w-5 h-5 text-green-500" />}
                                {section.icon === "globe" && <FileText className="w-5 h-5 text-purple-500" />}
                                {!section.icon && <FileText className="w-5 h-5 text-gray-500" />}
                              </div>
                              <div>
                                <p className="font-medium">{section.name}</p>
                                <p className="text-xs text-gray-500">{section.description || 'No description available'}</p>
                              </div>
                            </div>
                          ))}
                          {sections.length === 0 && (
                            <div className="text-center py-6 bg-gray-50 rounded">
                              <p>No subjects available for this exam yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Educational Qualification</h3>
                          <p className="text-sm text-gray-600">
                            {exam.examType === "SSC CGL" ? "Bachelor's Degree from a recognized University" : 
                             exam.examType === "SSC CHSL" ? "12th Standard or equivalent from a recognized Board or University" :
                             exam.examType === "SSC MTS" ? "10th Standard Pass from a recognized Board" :
                             "Varies based on post applied for"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">Age Limit</h3>
                          <p className="text-sm text-gray-600">
                            {exam.examType === "SSC CGL" ? "18-32 years (varies based on post)" : 
                             exam.examType === "SSC CHSL" ? "18-27 years" :
                             exam.examType === "SSC MTS" ? "18-25 years" :
                             "Varies based on post applied for"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="mock-tests" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Full Length Mock Tests</h2>
                  {fullLengthTests.length > 0 && (
                    <Button variant="outline" size="sm">View All</Button>
                  )}
                </div>
                
                {isTestsLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                  </div>
                ) : fullLengthTests.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fullLengthTests.map((test) => (
                      <Card key={test.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>{test.title}</CardTitle>
                          <CardDescription>{test.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{test.duration} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4" />
                              <span>{test.totalQuestions} questions</span>
                            </div>
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
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded">
                    <p>No full-length mock tests available yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sectional" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Sectional Practice Tests</h2>
                
                {isSectionsLoading ? (
                  <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-8 w-48 mb-4" />
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <Skeleton className="h-48 w-full" />
                          <Skeleton className="h-48 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sections.length > 0 ? (
                  sections.map((section) => (
                    <div key={section.id} className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        {section.icon === "math" && <FileText className="w-5 h-5 text-blue-500" />}
                        {section.icon === "file-text" && <FileText className="w-5 h-5 text-red-500" />}
                        {section.icon === "brain" && <FileText className="w-5 h-5 text-green-500" />}
                        {section.icon === "globe" && <FileText className="w-5 h-5 text-purple-500" />}
                        {!section.icon && <FileText className="w-5 h-5 text-gray-500" />}
                        <h3 className="text-lg font-medium">{section.name}</h3>
                      </div>
                      
                      {sectionalTests.filter(test => 
                        test.title.toLowerCase().includes(section.name.toLowerCase())
                      ).length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {sectionalTests
                            .filter(test => test.title.toLowerCase().includes(section.name.toLowerCase()))
                            .map((test) => (
                              <Card key={test.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                  <CardTitle>{test.title}</CardTitle>
                                  <CardDescription>{test.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      <span>{test.duration} mins</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileQuestion className="w-4 h-4" />
                                      <span>{test.totalQuestions} questions</span>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter>
                                  <Button asChild className="w-full">
                                    <Link to={`/tests/${test.id}`}>Start Test</Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))
                          }
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded">
                          <p>No practice tests available for this section yet.</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded">
                    <p>No sections available for this exam yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="previous-year" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Previous Year Papers</h2>
                
                {isTestsLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                  </div>
                ) : previousYearTests.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {previousYearTests.map((test) => (
                      <Card key={test.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>{test.title}</CardTitle>
                          <CardDescription>{test.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{test.duration} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4" />
                              <span>{test.totalQuestions} questions</span>
                            </div>
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
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded">
                    <p>No previous year papers available yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Preparation Resources</h2>
                
                {isResourcesLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-28 w-full" />
                    ))}
                  </div>
                ) : resources.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {resources.map((resource) => {
                      const Icon = resourceTypeIcons[resource.resourceType] || FileText;
                      return (
                        <Card key={resource.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6 flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded">
                              <Icon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{resource.title}</h3>
                              {resource.description && (
                                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                              )}
                              <Button asChild size="sm" variant={resource.url ? "default" : "outline"}>
                                <Link 
                                  to={resource.url || "#"}
                                  target={resource.url && resource.url.startsWith("http") ? "_blank" : "_self"}
                                >
                                  {resource.resourceType === 'pdf' ? 'Download PDF' : 
                                   resource.resourceType === 'video' ? 'Watch Video' :
                                   resource.resourceType === 'study_plan' ? 'View Study Plan' :
                                   'View Resource'}
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded">
                    <p>No preparation resources available yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamDetail;
