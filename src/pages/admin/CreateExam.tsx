
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/layouts/AdminLayout';
import { createExam } from '@/services/supabaseApi';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateExam = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [examType, setExamType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !examType) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create an exam."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the exam
      await createExam({
        title,
        description,
        imageUrl,
        examType
      }, user.id);
      
      toast({
        title: "Exam Created",
        description: "Your new exam has been created successfully."
      });
      
      navigate('/admin/exams');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create exam. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Exam</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., SSC CGL 2023"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type *</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSC CGL">SSC CGL</SelectItem>
                    <SelectItem value="SSC CHSL">SSC CHSL</SelectItem>
                    <SelectItem value="SSC MTS">SSC MTS</SelectItem>
                    <SelectItem value="SSC JE">SSC JE</SelectItem>
                    <SelectItem value="SSC GD">SSC GD</SelectItem>
                    <SelectItem value="SSC CPO">SSC CPO</SelectItem>
                    <SelectItem value="SSC Stenographer">SSC Stenographer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of the exam"
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500">Optional: Add an image URL for the exam</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/exams')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Exam'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateExam;
