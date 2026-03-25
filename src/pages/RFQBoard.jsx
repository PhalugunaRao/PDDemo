import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Briefcase, Building, Clock, Users, ChevronRight, ArrowUpRight, CheckCircle2, DollarSign, Search, ListFilter, LayoutPanelLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const RFQItem = ({ rfq, onQuote }) => (
  <Card className="glass-card p-8 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all border-none relative overflow-hidden group">
    <div className="flex flex-col h-full relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center font-black border-2 border-white shadow-lg shadow-brand-100/20 group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{rfq.id}</p>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{rfq.title}</h3>
           </div>
        </div>
        <Badge status={rfq.status === 'open' ? 'new' : rfq.status === 'quote_submitted' ? 'confirmed' : 'completed'} className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px] shadow-sm">
           {rfq.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <Users className="w-3 h-3" /> Projected Volume
            </p>
            <p className="font-black text-gray-900 uppercase text-xs">{rfq.volume}</p>
         </div>
         <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100/50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <Clock className="w-3 h-3 text-red-500" /> Deadline
            </p>
            <p className="font-black text-gray-900 uppercase text-xs">{format(parseISO(rfq.deadine), 'MMM dd')}</p>
         </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100/50 flex items-center justify-between">
         <div className="flex -space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
            <div className="w-8 h-8 rounded-full bg-brand-200 border-2 border-white flex items-center justify-center text-[8px] font-black text-brand-700">+12 Quotes</div>
         </div>
         {rfq.status === 'open' ? (
           <button 
             onClick={onQuote}
             className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 shadow-xl shadow-brand-100 transition-all active:scale-95 group/btn"
           >
             Submit Proposal <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
           </button>
         ) : (
           <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" /> Proposal Active
           </div>
         )}
      </div>
    </div>
    
    <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
  </Card>
);

export const RFQBoard = () => {
  const { rfqs, submitQuote } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);

  const handleQuote = (rfq) => {
    setSelectedRfq(rfq);
    setShowForm(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">RFQ Marketplace</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg italic">Explore new health schemes and submit your competitive rates directly.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
              <input type="text" placeholder="Search Markets..." className="pl-12 pr-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-300 transition-all shadow-sm" />
           </div>
           <button className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-brand-600 hover:border-brand-100 transition-all shadow-sm"><ListFilter className="w-6 h-6" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {rfqs.map((rfq) => (
            <RFQItem key={rfq.id} rfq={rfq} onQuote={() => handleQuote(rfq)} />
         ))}
      </div>

      <AnimatePresence>
         {showForm && (
           <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-3xl max-w-xl w-full p-10 space-y-8"
              >
                  <div className="flex justify-between items-start">
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Submit Quotation</h3>
                        <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mt-1">FOR {selectedRfq?.id} • {selectedRfq?.title}</p>
                     </div>
                     <button onClick={() => setShowForm(false)} className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all">✕</button>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Comprehensive Package Rate (Per Head)</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
                           <input type="number" placeholder="0.00" className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected TAT (Hours)</label>
                        <input type="number" placeholder="24" className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all" />
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button 
                       onClick={() => setShowForm(false)}
                       className="flex-1 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all"
                     >
                       Save As Draft
                     </button>
                     <button 
                       onClick={() => { submitQuote(selectedRfq.id, {}); setShowForm(false); }}
                       className="flex-1 py-4 text-[10px] font-black text-white bg-brand-600 uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-100 hover:bg-brand-500 transition-all"
                     >
                       Confirm Proposal
                     </button>
                  </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};
