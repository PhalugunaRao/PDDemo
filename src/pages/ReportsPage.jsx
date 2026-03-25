import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FileText, Download, Search, ExternalLink, Calendar, User, Clock, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const ReportsPage = () => {
  const { appointments } = useAppContext();

  const allReports = useMemo(() => {
    const reports = [];
    appointments.forEach(apt => {
      if (apt.reports) {
        apt.reports.forEach(report => {
          reports.push({
            ...report,
            patientName: apt.customerName,
            appointmentId: apt.id,
            date: report.date || apt.date
          });
        });
      }
    });
    return reports.sort((a, b) => parseISO(b.date) - parseISO(a.date));
  }, [appointments]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Medical Records</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg italic">View and download all clinical reports across your facility.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
              <input type="text" placeholder="Search Patient/Report..." className="pl-12 pr-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-300 transition-all shadow-sm" />
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 hover:border-brand-100 transition-all shadow-sm">
             <Filter className="w-4 h-4" /> Filter
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {allReports.map((report, idx) => (
          <Card key={idx} className="p-8 border-none shadow-xl shadow-gray-200/40 rounded-3xl group hover:shadow-2xl transition-all relative overflow-hidden bg-white/40 backdrop-blur-md">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                 <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                 </div>
                 <Badge status="completed" className="px-3 py-1 font-black uppercase tracking-widest text-[9px]">Verified</Badge>
              </div>
              
              <div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight truncate">{report.name}</h3>
                 <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> {report.patientName}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                 <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-tight">{format(parseISO(report.date), 'MMM dd, yyyy')}</span>
                 </div>
                 <div className="flex gap-2">
                   <button className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Download className="w-5 h-5" /></button>
                   <button className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><ExternalLink className="w-5 h-5" /></button>
                 </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-1/4 h-full bg-red-500/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
          </Card>
        ))}
        
        {allReports.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
             <FileText className="w-20 h-20 text-gray-200 mx-auto mb-6" />
             <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No reports archived yet</h3>
             <p className="text-gray-400 mt-2 font-medium">Reports will appear here once they are uploaded to appointments.</p>
          </div>
        )}
      </div>
    </div>
  );
};
