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

// Fallback data for mock exams
const mockExams: Record<string, Exam> = {
  "00000000-0000-0000-0000-000000000001": {
    id: "00000000-0000-0000-0000-000000000001",
    title: "SSC CGL",
    description: "Combined Graduate Level Examination for various Group B and C posts",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop",
    examType: "SSC CGL",
  },
  "00000000-0000-0000-0000-000000000002": {
    id: "00000000-0000-0000-0000-000000000002",
    title: "SSC CHSL",
    description: "Combined Higher Secondary Level for Data Entry Operators and LDC posts",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1972&auto=format&fit=crop",
    examType: "SSC CHSL",
  },
  "00000000-0000-0000-0000-000000000003": {
    id: "00000000-0000-0000-0000-000000000003",
    title: "SSC MTS",
    description: "Multi Tasking Staff examination for Group C non-technical posts",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1970&auto=format&fit=crop",
    examType: "SSC MTS",
  }
};

// Fallback tests data
const mockTests: Record<string, Test[]> = {
  "00000000-0000-0000-0000-000000000001": [
    {
      id: "t-00001",
      title: "SSC CGL 2023 Tier 1 Mock",
      description: "Full-length mock test simulating the SSC CGL Tier 1 examination pattern",
      examId: "00000000-0000-0000-0000-000000000001",
      duration: 60,
      totalQuestions: 100,
      createdAt: new Date().toISOString(),
      createdBy: "system",
      testType: "full_length"
    },
    {
      id: "t-00002",
      title: "SSC CGL Quantitative Aptitude",
      description: "Practice test focusing only on the Quantitative Aptitude section",
      examId: "00000000-0000-0000-0000-000000000001",
      duration: 25,
      totalQuestions: 25,
      createdAt: new Date().toISOString(),
      createdBy: "system",
      testType: "sectional"
    }
  ],
  "00000000-0000-0000-0000-000000000002": [
    {
      id: "t-00003",
      title: "SSC CHSL 2023 Full Mock",
      description: "Complete mock test based on latest SSC CHSL pattern",
      examId: "00000000-0000-0000-0000-000000000002",
      duration: 60,
      totalQuestions: 100,
      createdAt: new Date().toISOString(),
      createdBy: "system",
      testType: "full_length"
    },
    {
      id: "t-00004",
      title: "SSC CHSL English Practice",
      description: "Test your knowledge of grammar and vocabulary",
      examId: "00000000-0000-0000-0000-000000000002",
      duration: 15,
      totalQuestions: 25,
      createdAt: new Date().toISOString(),
      createdBy: "system",
      testType: "sectional"
    }
  ],
  "00000000-0000-0000-0000-000000000003": [
    {
      id: "t-00005",
      title: "SSC MTS General Awareness",
      description: "Sectional practice test for General Awareness section of SSC MTS",
      examId: "00000000-0000-0000-0000-000000000003",
      duration: 15,
      totalQuestions: 25,
      createdAt: new Date().toISOString(),
      createdBy: "system",
      testType: "sectional"
    }
  ]
};

// Mock sections data
const mockSections: Record<string, ExamSection[]> = {
  "00000000-0000-0000-0000-000000000001": [
    { id: "s1", examId: "00000000-0000-0000-0000-000000000001", name: "Quantitative Aptitude", description: "Mathematics and numerical ability questions", icon: "math" },
    { id: "s2", examId: "00000000-0000-0000-0000-000000000001", name: "English Language", description: "Grammar, vocabulary, and reading comprehension", icon: "file-text" },
    { id: "s3", examId: "00000000-0000-0000-0000-000000000001", name: "General Intelligence & Reasoning", description: "Logical reasoning and problem-solving questions", icon: "brain" },
    { id: "s4", examId: "00000000-0000-0000-0000-000000000001", name: "General Awareness", description: "Current affairs, history, science, and general knowledge", icon: "globe" }
  ],
  "00000000-0000-0000-0000-000000000002": [
    { id: "s5", examId: "00000000-0000-0000-0000-000000000002", name: "Quantitative Aptitude", description: "Mathematics and numerical ability questions", icon: "math" },
    { id: "s6", examId: "00000000-0000-0000-0000-000000000002", name: "English Language", description: "Grammar, vocabulary, and reading comprehension", icon: "file-text" },
    { id: "s7", examId: "00000000-0000-0000-0000-000000000002", name: "General Intelligence & Reasoning", description: "Logical reasoning and problem-solving questions", icon: "brain" },
    { id: "s8", examId: "00000000-0000-0000-0000-000000000002", name: "General Awareness", description: "Current affairs, history, science, and general knowledge", icon: "globe" }
  ],
  "00000000-0000-0000-0000-000000000003": [
    { id: "s9", examId: "00000000-0000-0000-0000-000000000003", name: "Quantitative Aptitude", description: "Mathematics and numerical ability questions", icon: "math" },
    { id: "s10", examId: "00000000-0000-0000-0000-000000000003", name: "English Language", description: "Grammar, vocabulary, and reading comprehension", icon: "file-text" },
    { id: "s11", examId: "00000000-0000-0000-0000-000000000003", name: "General Intelligence & Reasoning", description: "Logical reasoning and problem-solving questions", icon: "brain" },
    { id: "s12", examId: "00000000-0000-0000-0000-000000000003", name: "General Awareness", description: "Current affairs, history, science, and general knowledge", icon: "globe" }
  ]
};

// Mock preparation resources
const mockResources: Record<string, PreparationResource[]> = {
  "00000000-0000-0000-0000-000000000001": [
    { id: "r1", examId: "00000000-0000-0000-0000-000000000001", title: "Complete SSC CGL Syllabus", description: "Detailed syllabus for all tiers of SSC CGL examination", resourceType: "syllabus", url: "https://example.com/cgl-syllabus.pdf", createdAt: new Date().toISOString() },
    { id: "r2", examId: "00000000-0000-0000-0000-000000000001", title: "3-Month Study Plan", description: "Comprehensive study plan to cover all subjects in 3 months", resourceType: "study_plan", url: "https://example.com/cgl-study-plan", createdAt: new Date().toISOString() }
  ],
  "00000000-0000-0000-0000-000000000002": [
    { id: "r3", examId: "00000000-0000-0000-0000-000000000002", title: "CHSL Complete Guide", description: "Everything you need to know about SSC CHSL examination", resourceType: "pdf", url: "https://example.com/chsl-guide.pdf", createdAt: new Date().toISOString() }
  ],
  "00000000-0000-0000-0000-000000000003": [
    { id: "r4", examId: "00000000-0000-0000-0000-000000000003", title: "SSC MTS Strategy", description: "Top strategies to crack SSC MTS in first attempt", resourceType: "tip", url: "#", createdAt: new Date().toISOString() }
  ]
};

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

  const { 
    data: exam, 
    isLoading: isExamLoading, 
    error: examError 
  } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => examId ? getExam(examId) : Promise.reject('No exam ID provided'),
    retry: 1,
    gcTime: 0
  });

  // Handle exam loading error with useEffect instead of callbacks
  useEffect(() => {
    if (examError) {
      console.error('Failed to load exam:', examError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to database. Using demo data instead."
      });
    } else if (exam) {
      console.log('Exam loaded successfully:', exam);
    }
  }, [exam, examError, toast]);

  const {
    data: tests,
    isLoading: isTestsLoading,
    error: testsError
  } = useQuery({
    queryKey: ['tests', examId],
    queryFn: () => examId ? getTestsByExam(examId) : Promise.reject('No exam ID provided'),
    enabled: !!examId,
    retry: 1,
    gcTime: 0
  });

  // Log tests error
  useEffect(() => {
    if (testsError) {
      console.log('Using mock tests data');
    }
  }, [testsError]);

  const {
    data: sections,
    isLoading: isSectionsLoading,
    error: sectionsError
  } = useQuery({
    queryKey: ['sections', examId],
    queryFn: () => examId ? getExamSections(examId) : Promise.reject('No exam ID provided'),
    enabled: !!examId,
    retry: 1,
    gcTime: 0
  });

  // Log sections error
  useEffect(() => {
    if (sectionsError) {
      console.log('Using mock sections data');
    }
  }, [sectionsError]);

  const {
    data: resources,
    isLoading: isResourcesLoading,
    error: resourcesError
  } = useQuery({
    queryKey: ['resources', examId],
    queryFn: () => examId ? getPreparationResources(examId) : Promise.reject('No exam ID provided'),
    enabled: !!examId,
    retry: 1,
    gcTime: 0
  });

  // Log resources error
  useEffect(() => {
    if (resourcesError) {
      console.log('Using mock resources data');
    }
  }, [resourcesError]);

  // Use fallback data if needed
  const displayExam = exam || (examId && mockExams[examId]) || null;
  const displayTests = tests || (examId && mockTests[examId]) || [];
  const displaySections = sections || (examId && mockSections[examId]) || [];
  const displayResources = resources || (examId && mockResources[examId]) || [];

  // Filter tests by type
  const fullLengthTests = displayTests.filter(test => test.testType === 'full_length' || !test.testType);
  const sectionalTests = displayTests.filter(test => test.testType === 'sectional');
  const previousYearTests = displayTests.filter(test => test.testType === 'previous_year');

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

  if (examError || !displayExam) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {examError ? String(examError) : "Exam not found"}
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
      <div className="space-y-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/">&larr; Back to exams</Link>
          </Button>
        </div>
        
        {/* Exam Header */}
        <div className="relative">
          {displayExam.imageUrl && (
            <div 
              className="h-48 rounded-t-lg bg-cover bg-center w-full"
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${displayExam.imageUrl})` }}
            >
              <div className="absolute inset-0 flex items-center justify-start p-8">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">{displayExam.title}</h1>
                  <Badge variant="outline" className="bg-white/20 text-white">
                    {displayExam.examType}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            {!displayExam.imageUrl && (
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">{displayExam.title}</h1>
                <Badge variant="outline" className="bg-exam-blue/10 hover:bg-exam-blue/20 border-exam-blue/20 text-exam-blue">
                  {displayExam.examType}
                </Badge>
              </div>
            )}
            
            <p className="text-gray-600 mb-6">{displayExam.description}</p>
            
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
                      {displayExam.examType === "SSC CGL" && (
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
                          {displaySections.map((section) => (
                            <div key={section.id} className="flex items-center p-3 border rounded-lg">
                              <div className="mr-3">
                                {section.icon === "math" && <FileText className="w-5 h-5 text-blue-500" />}
                                {section.icon === "file-text" && <FileText className="w-5 h-5 text-red-500" />}
                                {section.icon === "brain" && <FileText className="w-5 h-5 text-green-500" />}
                                {section.icon === "globe" && <FileText className="w-5 h-5 text-purple-500" />}
                              </div>
                              <div>
                                <p className="font-medium">{section.name}</p>
                                <p className="text-xs text-gray-500">{section.description}</p>
                              </div>
                            </div>
                          ))}
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
                            {displayExam.examType === "SSC CGL" ? "Bachelor's Degree from a recognized University" : 
                             displayExam.examType === "SSC CHSL" ? "12th Standard or equivalent from a recognized Board or University" :
                             displayExam.examType === "SSC MTS" ? "10th Standard Pass from a recognized Board" :
                             "Varies based on post applied for"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">Age Limit</h3>
                          <p className="text-sm text-gray-600">
                            {displayExam.examType === "SSC CGL" ? "18-32 years (varies based on post)" : 
                             displayExam.examType === "SSC CHSL" ? "18-27 years" :
                             displayExam.examType === "SSC MTS" ? "18-25 years" :
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
                
                {displaySections.map((section) => (
                  <div key={section.id} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      {section.icon === "math" && <FileText className="w-5 h-5 text-blue-500" />}
                      {section.icon === "file-text" && <FileText className="w-5 h-5 text-red-500" />}
                      {section.icon === "brain" && <FileText className="w-5 h-5 text-green-500" />}
                      {section.icon === "globe" && <FileText className="w-5 h-5 text-purple-500" />}
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
                ))}
              </TabsContent>
              
              <TabsContent value="previous-year" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Previous Year Papers</h2>
                
                {previousYearTests.length > 0 ? (
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
                ) : displayResources.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {displayResources.map((resource) => {
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
