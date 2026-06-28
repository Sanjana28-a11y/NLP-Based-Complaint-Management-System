import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ShieldAlert, BarChart3, PlusCircle, List, LayoutDashboard, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ darkMode, setDarkMode, role, switchRole }) => {
  const location = useLocation();

  const studentLinks = [
    { name: 'Submit Complaint', path: '/submit', icon: PlusCircle },
    { name: 'My Complaints', path: '/my-complaints', icon: List }
  ];

  const adminLinks = [
    { name: 'Admin Panel', path: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', path: '/dashboard', icon: BarChart3 }
  ];

  const navLinks = role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="w-full z-50 sticky top-0 px-4 py-4 backdrop-blur-lg bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            SmartAnalyzer
          </span>
        </Link>

        {/* Links & Theme Toggle */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors relative ${
                    isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            {/* Role Switcher */}
            <button
              onClick={() => switchRole(role === 'admin' ? 'student' : 'admin')}
              className="px-3 py-1.5 flex items-center gap-2 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {role === 'admin' ? 'Admin Mode' : 'Student Mode'}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
