import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    text: '',
    department: 'Computer Science',
    year: '1st Year'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const studyDepartments = ['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Business', 'Arts', 'Other'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Faculty', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // 1. Get Prediction from Flask ML API
      const mlResponse = await axios.post('http://127.0.0.1:5000/predict', { text: formData.text });
      const { category, urgency } = mlResponse.data;

      // 2. Save to Node.js / MongoDB backend
      const dbPayload = {
        Complaint_Text: formData.text,
        Category: category,
        Urgency: urgency,
        Department: formData.department,
        Year_of_Study: formData.year,
        User_Id: 'student123'
      };
      
      const dbResponse = await axios.post('http://127.0.0.1:5001/complaints', dbPayload);

      setResult({
        category: category,
        urgency: urgency,
        status: dbResponse.data.Status
      });

    } catch (err) {
      console.error(err);
      setError('An error occurred. Make sure both Python and Node servers are running.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Submit a Complaint</h2>
        <p className="text-slate-600 dark:text-slate-400">Our AI will automatically categorize and prioritize your request.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Text Area */}
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200 mb-2">
              Complaint Details
            </label>
            <div className="relative">
              <textarea
                rows={5}
                required
                placeholder="Describe your issue in detail..."
                className="block w-full rounded-2xl border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-white dark:bg-slate-900/50 sm:text-sm sm:leading-6 transition-shadow resize-none"
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
              />
              <div className="absolute bottom-3 right-4 text-xs text-slate-400">
                {formData.text.length} chars
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200 mb-2">
                Studying Department
              </label>
              <select
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-slate-900/50 sm:text-sm sm:leading-6 cursor-pointer"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                {studyDepartments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200 mb-2">
                Year of Study
              </label>
              <select
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-white dark:bg-slate-900/50 sm:text-sm sm:leading-6 cursor-pointer"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.text.trim()}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            {loading ? (
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
            ) : (
              <>
                Analyze & Submit
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 rounded-3xl border-l-4 border-l-indigo-500">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Analysis Complete</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Target Segment</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">{result.category}</p>
                </div>
                <div className={`p-4 rounded-2xl ${getUrgencyColor(result.urgency)}`}>
                  <p className="text-sm opacity-80 mb-1">Assigned Priority</p>
                  <p className="font-bold text-lg">{result.urgency} Urgency</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintForm;
