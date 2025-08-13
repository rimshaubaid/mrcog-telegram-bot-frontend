import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AddQuestion from './pages/AddQuestion.tsx';
import ManageQuestions from './pages/ManageQuestions.tsx';
import QuestionScheduler from './pages/QuestionScheduler.tsx';
import Login from './pages/Login.tsx';
import { useAuth } from './hooks/useAuth';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Still checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/add-question" element={
          <ProtectedRoute>
            <Layout>
              <AddQuestion />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/manage-questions" element={
          <ProtectedRoute>
            <Layout>
              <ManageQuestions />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/scheduler" element={
          <ProtectedRoute>
            <Layout>
              <QuestionScheduler />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
