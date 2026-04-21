import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';

export default function App() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </main>
  );
}
