import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { BarChart3, TrendingUp, Users, Clock, AlertCircle, CheckCircle2, Award, ArrowUpRight, PlayCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const InsightProgress = ({ label, value, color, delay }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</span>
       <span className="text-xl font-black text-gray-900 leading-none">{value}%</span>
    </div>
    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${value}%` }}
         transition={{ duration: 1.5, delay, ease: "easeOut" }}
         className={`h-full ${color} shadow-lg relative`}
       >
          <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-1/2 pointer-events-none" />
       </motion.div>
    </div>
  </div>
);

export const PerformanceAnalytics = () => {
  const { appointments } = useAppContext();

  const metrics = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const rejected = appointments.filter(a => a.status === 'rejected').length;
    const slaBreached = appointments.filter(a => a.isSlaBreached).length;

    return {
      completionRate: Math.round((completed / total) * 100) || 0,
      acceptanceRate: Math.round(((total - rejected) / total) * 100) || 0,
      slaCompliance: 100 - (Math.round((slaBreached / total) * 100) || 0),
      avgTat: '18.4 hrs'
    };
  }, [appointments]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase px-1">Performance Protocol</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg italic">Tracking efficiency metrics, SLA compliance, and customer satisfaction.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 hover:border-brand-100 transition-all shadow-sm group">
              <BarChart3 className="w-4 h-4 group-hover:scale-110" /> Historical View
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 shadow-xl shadow-brand-100 transition-all active:scale-95 group">
              <Award className="w-4 h-4 group-hover:scale-110" /> Excellence Scorecard
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         <Card className="xl:col-span-2 p-10 border-none shadow-2xl shadow-gray-200/40 rounded-[3rem] space-y-10 relative overflow-hidden bg-white/40 backdrop-blur-md">
            <div className="flex items-center justify-between relative z-10 px-2">
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Core KPI Index</h3>
               <TrendingUp className="w-6 h-6 text-brand-600" />
            </div>
            
            <div className="space-y-8 relative z-10 px-2">
               <InsightProgress label="Appointment Completion Rate" value={metrics.completionRate} color="bg-brand-600" delay={0.2} />
               <InsightProgress label="Acceptance Compliance" value={metrics.acceptanceRate} color="bg-green-500" delay={0.4} />
               <InsightProgress label="SLA TAT Compliance" value={metrics.slaCompliance} color="bg-amber-500" delay={0.6} />
               <InsightProgress label="Report Accuracy" value={98.2} color="bg-indigo-600" delay={0.8} />
            </div>
            
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-100/10 -skew-x-12 translate-x-1/2 pointer-events-none" />
         </Card>

         <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-none shadow-xl shadow-gray-200/30 rounded-3xl bg-gradient-to-br from-white to-gray-50 flex flex-col justify-between group">
               <div>
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-100/30 group-hover:scale-110 transition-transform">
                     <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SLA Breaches (24h)</p>
                  <h4 className="text-4xl font-black text-gray-900 mt-2 uppercase">12 DELAYS</h4>
                  <p className="text-xs font-bold text-red-600 mt-2 uppercase tracking-tight">+5% vs last cycle</p>
               </div>
               <button className="mt-8 flex items-center gap-2 text-brand-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                  Resolve Escalations <ArrowUpRight className="w-4 h-4" />
               </button>
            </Card>

            <Card className="p-8 border-none shadow-xl shadow-gray-200/30 rounded-3xl bg-gradient-to-br from-white to-gray-50 flex flex-col justify-between group">
               <div>
                  <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-100/30 group-hover:scale-110 transition-transform">
                     <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Turnaround Time</p>
                  <h4 className="text-4xl font-black text-gray-900 mt-2 uppercase">{metrics.avgTat}</h4>
                  <p className="text-xs font-bold text-green-600 mt-2 uppercase tracking-tight">-1.2h improvement</p>
               </div>
               <button className="mt-8 flex items-center gap-2 text-brand-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                  TAT Optimizer <ArrowUpRight className="w-4 h-4" />
               </button>
            </Card>

            <Card className="md:col-span-2 p-8 bg-gray-900 text-white border-none rounded-3xl relative overflow-hidden group">
               <div className="relative z-10 flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:rotate-12 transition-transform">
                     <Star className="w-10 h-10 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                     <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Customer Experience</p>
                     <h4 className="text-3xl font-black uppercase tracking-tight">4.8 / 5.0 Rating</h4>
                     <p className="text-xs text-brand-400 font-bold mt-2 uppercase tracking-widest">EXCELLENCE STATUS VERIFIED</p>
                  </div>
                  <button className="ml-auto p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                     View Feedback
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </Card>
         </div>
      </div>
    </div>
  );
};
