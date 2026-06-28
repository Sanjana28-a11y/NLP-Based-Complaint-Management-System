import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle2, Zap, Search, Filter } from 'lucide-react';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDep, setFilterDep] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [editForm, setEditForm] = useState({ status: '', assignedTo: '', assignedEmail: '', remarks: '' });

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5001/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5001/complaints/${selectedComplaint._id}`, editForm);
      setSelectedComplaint(null);
      fetchComplaints(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  // Logic: Priority Sorting (High > Medium > Low)
  const urgencyWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const filteredAndSorted = complaints
    .filter(c => c.Complaint_Text.toLowerCase().includes(searchTerm.toLowerCase()) || c.User_Id.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => filterDep === 'All' ? true : c.Department === filterDep)
    .sort((a, b) => {
      // Unresolved High always top
      if (a.Status !== 'Resolved' && b.Status === 'Resolved') return -1;
      if (a.Status === 'Resolved' && b.Status !== 'Resolved') return 1;
      
      return urgencyWeight[b.Urgency] - urgencyWeight[a.Urgency];
    });

  // Smart Reminders logic
  const now = new Date();
  const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
  
  const highPriorityQueue = complaints.filter(c => c.Urgency === 'High' && c.Status !== 'Resolved');
  const oldPending = complaints.filter(c => c.Status === 'Pending' && new Date(c.Date_Submitted) < threeDaysAgo);

  return (
    <div className="py-8">
      
      {/* Smart Reminder / Alert Panel */}
      {(highPriorityQueue.length > 0 || oldPending.length > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-3xl bg-red-100 border-2 border-red-500 dark:bg-red-900/30 dark:border-red-500 shadow-lg shadow-red-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          
          <h3 className="text-red-800 dark:text-red-300 text-xl font-bold flex items-center gap-3 mb-4 relative z-10">
            <Zap className="w-6 h-6 animate-pulse" /> Action Required - Escalated Issues
          </h3>
          
          <div className="flex gap-6 relative z-10">
            {highPriorityQueue.length > 0 && (
              <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl">
                <span className="text-3xl font-black text-red-600 dark:text-red-400">{highPriorityQueue.length}</span>
                <span className="text-sm font-semibold text-red-900 dark:text-red-200">Unresolved HIGH<br/>priority cases</span>
              </div>
            )}
            {oldPending.length > 0 && (
              <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl">
                <span className="text-3xl font-black text-orange-600 dark:text-orange-400">{oldPending.length}</span>
                <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">Cases pending<br/>for &gt; 3 days</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Admin Toolbar */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Management Console
        </h2>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search issues or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
            />
          </div>
          <select
            value={filterDep}
            onChange={(e) => setFilterDep(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer outline-none"
          >
            <option value="All">All Departments</option>
            <option value="IT">IT</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Academic">Academic</option>
            <option value="Health">Health</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Issue Detail</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status & Assignment</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {filteredAndSorted.map((c) => {
                const isHigh = c.Urgency === 'High' && c.Status !== 'Resolved';
                return (
                  <tr key={c._id} className={`transition-colors relative ${isHigh ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>
                    
                    {isHigh && <td className="absolute left-0 w-1 h-full bg-red-500 animate-pulse"></td>}
                    
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1">{new Date(c.Date_Submitted).toLocaleDateString()} • {c.User_Id}</span>
                        <span className="text-sm text-slate-900 dark:text-slate-200 line-clamp-2" title={c.Complaint_Text}>{c.Complaint_Text}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {c.Department}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border
                        ${c.Urgency === 'High' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800' : ''}
                        ${c.Urgency === 'Medium' ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800' : ''}
                        ${c.Urgency === 'Low' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800' : ''}
                      `}>
                        {isHigh && <AlertCircle className="w-3.5 h-3.5 mr-1" />}
                        {c.Urgency}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm font-semibold flex items-center gap-1.5 ${
                          c.Status === 'Resolved' ? 'text-emerald-500' : c.Status === 'In Progress' ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {c.Status === 'Resolved' && <CheckCircle2 className="w-4 h-4"/>}
                          {c.Status === 'In Progress' && <Clock className="w-4 h-4"/>}
                          {c.Status === 'Pending' && <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                          {c.Status}
                        </span>
                        <span className="text-xs text-slate-500 truncate w-32">
                          {c.Assigned_To !== 'Unassigned' ? `Assigned: ${c.Assigned_To}` : 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedComplaint(c);
                          setEditForm({ status: c.Status, assignedTo: c.Assigned_To !== 'Unassigned' ? c.Assigned_To : '', assignedEmail: c.Assigned_Email || '', remarks: c.Remarks || '' });
                        }}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal Override */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Resolve Complaint</h3>
                <p className="text-sm text-slate-500 mt-1">ID: {selectedComplaint._id}</p>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Update Status</label>
                  <select 
                    value={editForm.status}
                    onChange={e => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-indigo-500 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Assign To (Staff/Group)</label>
                  <input 
                    type="text"
                    value={editForm.assignedTo}
                    onChange={e => setEditForm({...editForm, assignedTo: e.target.value})}
                    placeholder="e.g. John Doe - Tech Team"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 mb-4"
                  />

                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Staff Contact Email</label>
                  <input 
                    type="email"
                    value={editForm.assignedEmail}
                    onChange={e => setEditForm({...editForm, assignedEmail: e.target.value})}
                    placeholder="e.g. j.doe@university.edu"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Internal Remarks</label>
                  <textarea 
                    rows={3}
                    value={editForm.remarks}
                    onChange={e => setEditForm({...editForm, remarks: e.target.value})}
                    placeholder="Notes for the student..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 font-semibold">
                  <button 
                    type="button" 
                    onClick={() => setSelectedComplaint(null)}
                    className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
