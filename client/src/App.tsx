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
import { PlannerPage } from '@/features/planner/PlannerPage';
import { SubmissionDetailPage } from '@/features/submission-detail/SubmissionDetailPage';
import { NotFoundPage } from '@/components/NotFoundPage';
import { JoinCoursePage } from '@/features/join/JoinCoursePage';

import { DocsLayout } from '@/features/docs/DocsLayout';
import { TermsPage } from '@/features/docs/TermsPage';
import { PrivacyPage } from '@/features/docs/PrivacyPage';
import { SecurityPage } from '@/features/docs/SecurityPage';
import { DocsPage } from '@/features/docs/DocsPage';
import { ContactPage } from '@/features/docs/ContactPage';
import { CookiesPage } from '@/features/docs/CookiesPage';
import { StatusPage } from '@/features/docs/StatusPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/docs" element={<DocsLayout />}>
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="manuals" element={<DocsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="cookies" element={<CookiesPage />} />
            <Route path="status" element={<StatusPage />} />
          </Route>

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/join/:inviteToken" element={<JoinCoursePage />} />
            <Route path="/assignments/:assignmentId" element={<AssignmentDetailPage />} />
            <Route path="/assignments/:assignmentId/edit" element={<QuizEditorPage />} />
            <Route path="/assignments/:assignmentId/take" element={<TakeQuizPage />} />
            <Route path="/submissions/:submissionId" element={<SubmissionDetailPage />} />
            <Route path="/planner" element={<PlannerPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;