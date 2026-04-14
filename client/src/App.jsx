import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import ProblemsListPage from './pages/ProblemsListPage.jsx';
import Navbar from './components/Navbar.jsx';
import PublicProfilePage from './pages/PublicProfilePage.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<ProblemsListPage />} />
        <Route path="/problems/:slug" element={<ProblemPage />} />
        <Route path="/u/:username" element={<PublicProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;
