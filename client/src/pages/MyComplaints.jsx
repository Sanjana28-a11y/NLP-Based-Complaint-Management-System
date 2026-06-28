import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/complaints/user/student123');
        setComplaints(response.data);
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyComplaints();
  }, []);

  const getUrgencyColor = (urgency) => {
    if (urgency === 'High') return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    if (urgency === 'Medium') return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
    return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Complaints</h2>
        <p className="text-slate-600 dark:text-slate-400">Track and monitor the status of all your submitted issues.</p>
      </motion.div>

      {complaints.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          You haven't submitted any complaints yet.
        </div>
      ) : (
        <div className="space-y-6">
          {complaints.map((comp, idx) => (
            <motion.div 
              key={comp._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-3xl relative overflow-hidden"
            >
              {/* Highlight bar on the left */}
              <div className={`absolute top-0 left-0 w-2 h-full ${
                comp.Status === 'Resolved' ? 'bg-emerald-500' : 
                comp.Status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'
              }`} />

              <div className="flex flex-col md:flex-row justify-between gap-6 pl-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {new Date(comp.Date_Submitted).toLocaleDateString()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {comp.Department}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getUrgencyColor(comp.Urgency)}`}>
                      {comp.Urgency} Urgency
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 line-clamp-2">
                    {comp.Complaint_Text}
                  </h3>

                  {comp.Remarks && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Admin Remarks</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{comp.Remarks}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-center min-w-[150px] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    {comp.Status === 'Resolved' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {comp.Status === 'In Progress' && <Clock className="w-5 h-5 text-blue-500" />}
                    {comp.Status === 'Pending' && <AlertTriangle className="w-5 h-5 text-slate-400" />}
                    <span className="font-semibold text-slate-900 dark:text-white">{comp.Status}</span>
                  </div>
                  
                  {comp.Assigned_To && comp.Assigned_To !== 'Unassigned' && (
                    <p className="text-xs text-slate-500 mt-4 text-right">
                      Assigned to:<br/>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{comp.Assigned_To}</span>
                      {comp.Assigned_Email && (
                        <span className="block mt-1">
                          <a href={`mailto:${comp.Assigned_Email}`} className="text-indigo-500 dark:text-indigo-400 font-semibold hover:underline bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded inline-block">
                            {comp.Assigned_Email}
                          </a>
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
