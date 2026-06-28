import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Activity, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-indigo-500" />,
      title: "AI-Powered Analysis",
      description: "Our NLP model instantly categorizes and prioritizes your complaints with high accuracy."
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-500" />,
      title: "Real-Time Tracking",
      description: "Monitor the resolution status of your complaints in real time through an intuitive dashboard."
    },
    {
      icon: <Database className="w-8 h-8 text-rose-500" />,
      title: "Data-Driven Insights",
      description: "Administrators gain actionable insights via comprehensive charts and analytics."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh]">
      {/* Hero Section */}
      <motion.div 
        className="text-center max-w-4xl px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-semibold tracking-wide shadow-sm">
          Welcome to the Future of Resolution
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Smart Complaint <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Analyzer
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Submit your concerns and let our advanced Artificial Intelligence instantly categorize and assess priority, streamlining the path to a swift resolution.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/submit" className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300">
            View Analytics
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div 
        className="grid md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="glass-card p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-indigo-100 to-transparent dark:from-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm inline-block mb-6 relative z-10">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Landing;
