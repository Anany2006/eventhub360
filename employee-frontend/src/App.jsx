import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEmployee from './pages/CreateEmployee';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Live Protected Dashboard Area */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Catch-all Wildcard Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />

          <Route path="/create-employee" element={<CreateEmployee />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;