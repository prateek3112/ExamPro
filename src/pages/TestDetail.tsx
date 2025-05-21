
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestApi, getQuestionsByTestApi, getExamApi } from '@/services/api';
import { Test, Exam, Question, QuestionSection } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Loader, AlertCircle, Clock, BookOpen } from 'lucide-react';

// Define mock sections data
const mockSections: Record<string, QuestionSection[]> = {
  "00000000-0000-0000-0000-000000000001": [
    { id: "s1", title: "Mathematics", description: "Algebra, Calculus and Coordinate Geometry", questionCount: 20 },
    { id: "s2", title: "Physics", description: "Mechanics, Thermodynamics and Electromagnetism", questionCount: 15 },
    { id: "s3", title: "Chemistry", description: "Organic and Inorganic chemistry", questionCount: 15 }
  ],
  "00000000-0000-0000-0000-000000000002": [
    { id: "s4", title: "Verbal", description: "English Grammar and Comprehension", questionCount: 20 },
    { id: "s5", title: "Quantitative", description: "Numerical Ability and Reasoning", questionCount: 20 },
    { id: "s6", title: "General Knowledge", description: "Current Affairs and General Awareness", questionCount: 10 }
  ],
  "00000000-0000-0000-0000-000000000003": [
    { id: "s7", title: "Biology", description: "Zoology and Botany", questionCount: 20 },
    { id: "s8", title: "Physics", description: "Mechanics and Modern Physics", questionCount: 15 },
    { id: "s9", title: "Chemistry", description: "Organic and Physical Chemistry", questionCount: 15 }
  ]
};

const TestDetail = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<QuestionSection[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!testId) return;
      
      try {
        setIsLoading(true);
        setHasError(false);
        
        console.log("Fetching test with ID:", testId);
        const testData = await getTestApi(testId);
        setTest(testData);
        
        console.log("Fetching exam with ID:", testData.examId);
        const examData = await getExamApi(testData.examId);
        setExam(examData);
        
        console.log("Fetching questions for test:", testId);
        const questionsData = await getQuestionsByTestApi(testId);
        setQuestions(questionsData);
        
        // Extract unique sections from questions
        const uniqueSectionIds = new Set<string>();
        const sectionMap = new Map<string, QuestionSection>();
        
        questionsData.forEach(q => {
          if (q.sectionId) uniqueSectionIds.add(q.sectionId);
        });
        
        // Get section data from our mock data
        if (examData) {
          // Get the correct sections for this exam
          const examSections = mockSections[examData.id] || [];
          console.log("Found sections for exam:", examSections.length);
          
          examSections.forEach(section => {
            sectionMap.set(section.id, {
              ...section,
              isSelected: false
            });
          });
        }
        
        const sectionData = Array.from(sectionMap.values());
        setSections(sectionData);
        
        // Default: select all sections initially
        const allSectionIds = sectionData.map(s => s.id);
        setSelectedSections(allSectionIds);
        
      } catch (error) {
        console.error('Failed to fetch test details:', error);
        setHasError(true);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load test details. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestDetails();
  }, [testId, toast]);

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    setSelectedSections(prev => {
      if (checked) {
        return [...prev, sectionId];
      } else {
        return prev.filter(id => id !== sectionId);
      }
    });
  };

  const handleSelectAllSections = () => {
    const allSectionIds = sections.map(s => s.id);
    setSelectedSections(allSectionIds);
  };

  const handleClearAllSections = () => {
    setSelectedSections([]);
  };

  const handleStartTest = () => {
    if (!testId || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to start a test.",
      });
      return;
    }
    
    if (selectedSections.length === 0) {
      toast({
        variant: "destructive",
        title: "No sections selected",
        description: "Please select at least one section to start the test.",
      });
      return;
    }
    
    // Navigate to test taking page with selected sections info
    toast({
      title: "Test Started",
      description: `Starting test with ${selectedSections.length} selected sections.`,
    });
    navigate(`/tests/${testId}/take`, { state: { selectedSections } });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader className="animate-spin h-10 w-10 text-exam-blue mb-4" />
          <p className="text-xl">Loading test details...</p>
        </div>
      </MainLayout>
    );
  }

  if (hasError || !test || !exam) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error loading test</h2>
          <p className="mb-4">There was a problem loading the test details. Please try again later.</p>
          <Button onClick={() => navigate('/')}>
            Back to Exams
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Group questions by section
  const questionsBySectionCount: Record<string, number> = {};
  questions.forEach(q => {
    if (q.sectionId) {
      questionsBySectionCount[q.sectionId] = (questionsBySectionCount[q.sectionId] || 0) + 1;
    }
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{test.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-exam-blue/10 hover:bg-exam-blue/20 border-exam-blue/20 text-exam-blue">{exam.title}</Badge>
              {exam.examType && (
                <Badge variant="outline" className="bg-exam-blue/10 hover:bg-exam-blue/20 border-exam-blue/20 text-exam-blue">{exam.examType}</Badge>
              )}
              <Badge variant="outline">{questions.length} Questions</Badge>
              <Badge variant="outline">{test.duration} Minutes</Badge>
            </div>
          </div>
          <Button onClick={handleStartTest} disabled={selectedSections.length === 0}>
            Start Test
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-exam-blue" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{test.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-exam-blue" />
                <div>
                  <p className="text-sm text-gray-500">Total Questions</p>
                  <p className="font-medium">{questions.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Sections</CardTitle>
            <CardDescription>Choose which sections you want to include in your test attempt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Button variant="outline" size="sm" onClick={handleSelectAllSections}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAllSections}>
                Clear All
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              {sections.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sections available for this test.</p>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={section.id} 
                      checked={selectedSections.includes(section.id)}
                      onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={section.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {section.title} <span className="text-gray-500">({section.questionCount} questions)</span>
                      </label>
                      {section.description && (
                        <p className="text-sm text-gray-500">{section.description}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleStartTest} 
              disabled={selectedSections.length === 0}
              className="w-full"
            >
              Start Test with Selected Sections ({selectedSections.length} selected)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TestDetail;
