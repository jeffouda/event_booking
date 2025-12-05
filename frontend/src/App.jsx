import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect root URL to events */}
          <Route path="/" element={<Navigate to="/events" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;