import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Network, Tag, AlertTriangle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/complaints');
        setComplaints(response.data);
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading || complaints.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // --- Aggregate Data ---
  
  // 1. Complaints by Department
  const deptCount = complaints.reduce((acc, curr) => { acc[curr.Department] = (acc[curr.Department] || 0) + 1; return acc; }, {});
  const deptData = Object.keys(deptCount).map(k => ({ name: k, amount: deptCount[k] }));

  // 2. Complaints by Category
  const catCount = complaints.reduce((acc, curr) => { acc[curr.Category] = (acc[curr.Category] || 0) + 1; return acc; }, {});
  const categoryData = Object.keys(catCount).map(k => ({ name: k, amount: catCount[k] })).sort((a,b) => b.amount - a.amount);

  // 3. Urgency Distribution
  const urgCount = complaints.reduce((acc, curr) => { acc[curr.Urgency] = (acc[curr.Urgency] || 0) + 1; return acc; }, {});
  const urgencyData = Object.keys(urgCount).map(key => ({ name: key, value: urgCount[key] }));

  // 4. Status Distribution
  const statCount = complaints.reduce((acc, curr) => { acc[curr.Status] = (acc[curr.Status] || 0) + 1; return acc; }, {});
  const statusData = Object.keys(statCount).map(key => ({ name: key, value: statCount[key] }));

  // 5. Complaints Over Time
  const dateCount = complaints.reduce((acc, curr) => {
    const date = new Date(curr.Date_Submitted).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const timelineData = Object.keys(dateCount).map(key => ({ date: key, count: dateCount[key] })).slice(-30); // last 30 entries

  // --- Smart Insights Calculations ---
  const mostAffectedDept = Object.keys(deptCount).reduce((a, b) => deptCount[a] > deptCount[b] ? a : b);
  const highestCategory = Object.keys(catCount).reduce((a, b) => catCount[a] > catCount[b] ? a : b);
  const highPriorityTotal = urgCount['High'] || 0;
  
  // Find Peak Day
  const daysOfWeek = [0,0,0,0,0,0,0]; // Sun..Sat
  complaints.forEach(c => { daysOfWeek[new Date(c.Date_Submitted).getDay()] += 1; });
  const maxDayIdx = daysOfWeek.indexOf(Math.max(...daysOfWeek));
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const URGENCY_COLORS = { 'High': '#ef4444', 'Medium': '#f97316', 'Low': '#10b981' };
  const STATUS_COLORS = { 'Pending': '#94a3b8', 'In Progress': '#3b82f6', 'Resolved': '#10b981' };

  return (
    <div className="py-8 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Advanced Analytics</h2>
        <p className="text-slate-600 dark:text-slate-400">Deep insights driven by AI categorization.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Issues', value: complaints.length, icon: TrendingUp, color: 'text-indigo-500' },
          { title: 'Urgent Cases', value: highPriorityTotal, icon: AlertTriangle, color: 'text-red-500' },
          { title: 'Top Category', value: highestCategory, icon: Tag, color: 'text-purple-500' },
          { title: 'Critical Dept', value: mostAffectedDept, icon: Network, color: 'text-orange-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-l-4" style={{ borderColor: i === 1 ? '#ef4444' : i === 2 ? '#a855f7' : i === 3 ? '#f97316' : '#6366f1' }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{stat.title}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white truncate" title={stat.value}>{stat.value}</h4>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-40`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Smart Insights Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl"></div>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          AI Generating Insights...
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wide font-semibold">Volume Warning</p>
            <p className="text-lg">The <strong>{mostAffectedDept}</strong> department is receiving {((deptCount[mostAffectedDept]/complaints.length)*100).toFixed(0)}% of all complaints globally.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wide font-semibold">Core Issue</p>
            <p className="text-lg"><strong>{highestCategory}</strong> is the primary frustration vector, making up {catCount[highestCategory]} recent reports.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wide font-semibold">Peak Activity</p>
            <p className="text-lg">Complaints generally spike heavily on <strong>{daysMap[maxDayIdx]}s</strong>.</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Masonry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Timeline Chart (Spans 3 cols on Large) */}
        <motion.div className="glass-card p-6 lg:col-span-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complaint Frequency Over Time</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="date" tick={{fill: '#64748b', fontSize: 12}} tickMargin={10} minTickGap={30} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} dot={false} activeDot={{r: 8, fill: '#6366f1', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Categories Bar */}
        <motion.div className="glass-card p-6 lg:col-span-2">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Categories</h3>
           <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData.slice(0, 5)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600}} width={100} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
                  <Bar dataKey="amount" fill="#a855f7" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Urgency Pie */}
        <motion.div className="glass-card p-6 relative">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Urgency Ratio</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={urgencyData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {urgencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={URGENCY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} itemStyle={{color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{complaints.length}</span>
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total</span>
            </div>
          </div>
        </motion.div>

        {/* Departments Bar */}
        <motion.div className="glass-card p-6 lg:col-span-2">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complaints by Department</h3>
           <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
                  <Bar dataKey="amount" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Status Breakdown Pie */}
        <motion.div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Resolution Rate</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <CheckCircle2 className="w-10 h-10 text-emerald-500 opacity-20" />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
