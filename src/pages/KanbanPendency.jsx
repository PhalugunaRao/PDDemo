import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, FileUp, MoreVertical, List, LayoutPanelLeft, ArrowUpRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';

const KanbanColumn = ({ title, appointments, icon: Icon, colorClass, onAction }) => (
  <div className="flex flex-col gap-6 min-w-[320px] flex-1">
    <div className={`p-4 border-b-2 ${colorClass} flex items-center justify-between bg-white/50 rounded-t-2xl`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">{title}</h3>
      </div>
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black">{appointments.length}</span>
    </div>
    
    <div className="flex flex-col gap-4">
      {appointments.map((apt) => (
        <motion.div 
          layoutId={apt.id}
          key={apt.id} 
          onClick={() => onAction(apt)}
          className="glass-card p-5 rounded-2xl hover:shadow-xl transition-all border-l-4 border-l-brand-600 group cursor-pointer bg-white/80 active:scale-95"
        >
          <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded-md uppercase tracking-widest">{apt.id}</span>
             {apt.isSlaBreached && (
               <div className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse uppercase">
                 <AlertCircle className="w-3 h-3" /> SLA BREACH
               </div>
             )}
          </div>
          <p className="font-black text-gray-900 uppercase text-sm mb-1">{apt.customerName}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">{apt.package}</p>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
            <div className="flex items-center gap-2 text-gray-400">
               <Clock className="w-3 h-3" />
               <span className="text-[10px] font-black uppercase tracking-tight">{format(parseISO(apt.date), 'hh:mm a')}</span>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline p-1">
              ACTION <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      ))}
      
      {appointments.length === 0 && (
         <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
           <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No Pendency</p>
         </div>
      )}
    </div>
  </div>
);

export const KanbanPendency = () => {
  const { appointments } = useAppContext();
  const [view, setView] = useState('kanban');
  const [selectedApt, setSelectedApt] = useState(null);

  const columns = useMemo(() => ({
    requested: appointments.filter(a => a.status === 'requested'),
    accepted: appointments.filter(a => a.status === 'accepted' || a.status === 'customer_arrived'),
    toUpload: appointments.filter(a => a.status === 'sample_collected'),
    uploaded: appointments.filter(a => a.status === 'report_uploaded'),
  }), [appointments]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Operational Pendency</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg italic tracking-tight">Real-time task board for maximizing service efficiency.</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'kanban' ? 'bg-white text-brand-600 shadow-lg' : 'text-gray-400'}`}
          >
            <LayoutPanelLeft className="w-4 h-4" /> Board
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-white text-brand-600 shadow-lg' : 'text-gray-400'}`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar-v2">
        <KanbanColumn title="New Requests" appointments={columns.requested} icon={AlertCircle} colorClass="border-blue-500" onAction={setSelectedApt} />
        <KanbanColumn title="In Progress" appointments={columns.accepted} icon={CheckCircle2} colorClass="border-amber-500" onAction={setSelectedApt} />
        <KanbanColumn title="Upload Reports" appointments={columns.toUpload} icon={FileUp} colorClass="border-red-500" onAction={setSelectedApt} />
        <KanbanColumn title="Under Review" appointments={columns.uploaded} icon={Clock} colorClass="border-brand-500" onAction={setSelectedApt} />
      </div>

      <AppointmentDetailDrawer 
        appointment={selectedApt} 
        isOpen={!!selectedApt} 
        onClose={() => setSelectedApt(null)} 
      />
    </div>
  );
};
