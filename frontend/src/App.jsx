import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import OrganisationsPage from './pages/OrganisationsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import TeamsPage from './pages/TeamsPage';
import UsersPage from './pages/UsersPage';
import OKRsPage from './pages/OKRsPage';
import KeyResultsPage from './pages/KeyResultsPage';

function App() {
  // TODO: Replace with real auth logic
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/organisations" element={isAuthenticated ? <OrganisationsPage /> : <Navigate to="/login" />} />
          <Route path="/departments" element={isAuthenticated ? <DepartmentsPage /> : <Navigate to="/login" />} />
          <Route path="/teams" element={isAuthenticated ? <TeamsPage /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />} />
          <Route path="/okrs" element={isAuthenticated ? <OKRsPage /> : <Navigate to="/login" />} />
          <Route path="/keyresults" element={isAuthenticated ? <KeyResultsPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
