import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';

// Main App component that sets up routing and authentication provider
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/events" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-event" element={<CreateEvent />} />
          {/* Dynamic route for individual event details */}
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;