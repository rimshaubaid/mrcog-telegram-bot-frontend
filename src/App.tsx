import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AddQuestion from './pages/AddQuestion.tsx';
import ManageQuestions from './pages/ManageQuestions.tsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-question" element={<AddQuestion />} />
          <Route path="/manage-questions" element={<ManageQuestions />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
