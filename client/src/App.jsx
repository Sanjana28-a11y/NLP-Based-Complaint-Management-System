import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import ComplaintForm from './pages/ComplaintForm';
import Dashboard from './pages/Dashboard';
import MyComplaints from './pages/MyComplaints';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('appRole') || 'student');

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('appRole', newRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} role={role} switchRole={switchRole} />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/submit" element={role === 'student' ? <ComplaintForm /> : <Navigate to="/admin" />} />
          <Route path="/my-complaints" element={role === 'student' ? <MyComplaints /> : <Navigate to="/admin" />} />
          <Route path="/admin" element={role === 'admin' ? <AdminPanel /> : <Navigate to="/submit" />} />
          <Route path="/dashboard" element={role === 'admin' ? <Dashboard /> : <Navigate to="/my-complaints" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
