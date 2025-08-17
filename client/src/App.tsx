import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/features/landing/LandingPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { HomePage } from '@/features/home/HomePage';
import { CoursesPage } from '@/features/courses/CoursesPage';
import { CourseDetailPage } from '@/features/course-detail/CourseDetailPage';
import { AssignmentDetailPage } from '@/features/assignment-detail/AssignmentDetailPage';
import { QuizEditorPage } from '@/features/quiz-editor/QuizEditorPage';
import { TakeQuizPage } from '@/features/quiz-take/TakeQuizPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/assignments/:assignmentId" element={<AssignmentDetailPage />} />
            <Route path="/assignments/:assignmentId/edit" element={<QuizEditorPage />} />
            <Route path="/assignments/:assignmentId/take" element={<TakeQuizPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;