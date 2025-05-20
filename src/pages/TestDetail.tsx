
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTestApi, getExamApi } from '@/services/api';
import { Test, Exam, QuestionSection } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, ListOrdered } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const TestDetail = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [sections, setSections] = useState<QuestionSection[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTestData = async () => {
      if (!testId) return;
      
      try {
        setIsLoading(true);
        const testData = await getTestApi(testId);
        setTest(testData);
        
        // Get the exam data for additional context
        const examData = await getExamApi(testData.examId);
        setExam(examData);

        // Fetch sections based on the exam ID
        // This would normally come from the API, but we're using mock data
        if (examData.id === '1') { // SSC CGL
          setSections([
            { id: 's1', title: 'General Intelligence & Reasoning', description: 'Questions on analogies, similarities, differences, spatial visualization, problem solving, analysis, decision making, etc.', questionCount: 25 },
            { id: 's2', title: 'General Awareness', description: 'Questions on current events, sports, history, geography, economic scene, general politics, Indian Constitution, etc.', questionCount: 25 },
            { id: 's3', title: 'Quantitative Aptitude', description: 'Questions on arithmetic, algebra, geometry, trigonometry, statistics, etc.', questionCount: 25 },
            { id: 's4', title: 'English Comprehension', description: 'Questions on understanding of English language, vocabulary, grammar, etc.', questionCount: 25 }
          ]);
        } else if (examData.id === '2') { // JEE Main
          setSections([
            { id: 's5', title: 'Physics', description: 'Questions on mechanics, thermodynamics, optics, electromagnetism, modern physics, etc.', questionCount: 30 },
            { id: 's6', title: 'Chemistry', description: 'Questions on physical, organic, and inorganic chemistry, etc.', questionCount: 30 },
            { id: 's7', title: 'Mathematics', description: 'Questions on algebra, calculus, coordinate geometry, etc.', questionCount: 30 }
          ]);
        } else if (examData.id === '3') { // UPSC CSE
          setSections([
            { id: 's8', title: 'General Studies Paper I', description: 'Questions on Indian history, geography, society, environment, etc.', questionCount: 35 },
            { id: 's9', title: 'General Studies Paper II', description: 'Questions on governance, constitution, polity, social justice, international relations, etc.', questionCount: 35 },
            { id: 's10', title: 'General Studies Paper III', description: 'Questions on technology, economic development, biodiversity, security, disaster management, etc.', questionCount: 35 },
            { id: 's11', title: 'General Studies Paper IV', description: 'Questions on ethics, integrity, aptitude, etc.', questionCount: 35 }
          ]);
        }

        // By default select all sections
        const allSectionIds = sections.map(section => section.id);
        setSelectedSections(allSectionIds);
      } catch (error) {
        console.error('Failed to load test data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestData();
  }, [testId]);

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedSections(sections.map(s => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
  };

  const startTest = () => {
    if (testId) {
      // Pass selected sections to test taking page
      navigate(`/tests/${testId}/take`, { state: { selectedSections } });
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} minutes` : ''}`;
    }
    return `${minutes} minutes`;
  };

  const getSelectedQuestionCount = () => {
    return sections
      .filter(section => selectedSections.includes(section.id))
      .reduce((total, section) => total + section.questionCount, 0);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-exam-blue"></div>
        </div>
      </MainLayout>
    );
  }

  if (!test) {
    return (
      <MainLayout>
        <div className="text-center p-8">Test not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to={`/exams/${test.examId}`}>&larr; Back to exam</Link>
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div>
              {exam && (
                <div className="mb-2">
                  <span className="text-sm font-medium bg-exam-blue/10 text-exam-blue py-1 px-2 rounded-md">
                    {exam.examType || exam.title}
                  </span>
                </div>
              )}
              <h1 className="text-3xl font-bold">{test.title}</h1>
              <p className="text-gray-600 mt-2">{test.description}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 py-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-exam-blue" />
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-xl font-semibold">{formatTime(test.duration)}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <ListOrdered className="h-5 w-5 text-exam-blue" />
                <div>
                  <div className="text-sm text-gray-500">Total Questions</div>
                  <div className="text-xl font-semibold">{test.totalQuestions}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-exam-blue" />
                <div>
                  <div className="text-sm text-gray-500">Exam</div>
                  <div className="text-xl font-semibold">{exam?.title || "N/A"}</div>
                </div>
              </div>
            </div>

            {sections.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Select Sections</h2>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>Select All</Button>
                    <Button variant="outline" size="sm" onClick={handleDeselectAll}>Deselect All</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {sections.map(section => (
                    <div key={section.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50">
                      <Checkbox 
                        id={section.id} 
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)} 
                      />
                      <div className="space-y-1">
                        <label 
                          htmlFor={section.id} 
                          className="font-medium cursor-pointer"
                        >
                          {section.title}
                        </label>
                        {section.description && (
                          <p className="text-sm text-gray-500">{section.description}</p>
                        )}
                        <div className="text-sm text-exam-blue">
                          {section.questionCount} questions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t mt-4">
                  <div className="text-sm">
                    Selected: <span className="font-medium">{selectedSections.length} of {sections.length} sections</span>
                  </div>
                  <div className="text-sm">
                    Questions: <span className="font-medium">{getSelectedQuestionCount()} of {test.totalQuestions}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Instructions:</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>The test will be timed for {formatTime(test.duration)} and will automatically submit once the time is up.</li>
                <li>You can navigate between questions and sections during the test.</li>
                <li>You can review your answers before submitting the test.</li>
                <li>Each question has only one correct answer.</li>
                <li>Your progress will be saved automatically as you answer questions.</li>
                <li>If you leave the test, you can return and continue where you left off.</li>
                {selectedSections.length < sections.length && <li className="text-exam-blue">You are only attempting {selectedSections.length} out of {sections.length} sections.</li>}
              </ul>
            </div>
            
            <div className="pt-6">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
                disabled={selectedSections.length === 0}
              >
                Start Test
              </Button>
              {selectedSections.length === 0 && (
                <p className="text-red-500 text-sm text-center mt-2">
                  Please select at least one section to begin the test
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to begin?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start "{test.title}" with {getSelectedQuestionCount()} questions from {selectedSections.length} sections. 
              The timer will start immediately and the test will automatically submit once the time is up.
              {selectedSections.length < sections.length && (
                <p className="text-exam-blue font-medium mt-2">
                  Note: You have selected only {selectedSections.length} out of {sections.length} sections.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startTest}>Begin Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default TestDetail;
