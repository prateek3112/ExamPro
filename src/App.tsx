
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExamDetail from "./pages/ExamDetail";
import TestDetail from "./pages/TestDetail";
import TestTaking from "./pages/TestTaking";
import ResultDetail from "./pages/ResultDetail";
import MyAttempts from "./pages/MyAttempts";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ExamsList from "./pages/admin/ExamsList";
import CreateExam from "./pages/admin/CreateExam";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes - Protected for authenticated users */}
            <Route 
              path="/exams/:examId" 
              element={
                <ProtectedRoute>
                  <ExamDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tests/:testId" 
              element={
                <ProtectedRoute>
                  <TestDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tests/:testId/take" 
              element={
                <ProtectedRoute>
                  <TestTaking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results/:resultId" 
              element={
                <ProtectedRoute>
                  <ResultDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-attempts" 
              element={
                <ProtectedRoute>
                  <MyAttempts />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Protected for admin users only */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/exams" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ExamsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/exams/create" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateExam />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback - 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
