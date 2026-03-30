import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Check,
  X,
  FileText,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { format, parseISO } from 'date-fns';

const TabItem = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-xs font-black uppercase tracking-widest whitespace-nowrap ${
      active 
        ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {label}
  </button>
);

export const AppointmentsPage = () => {
  const { appointments, updateAppointmentStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const isConfirmationPendingTab = activeTab === 'Pending';
  const isConfirmedTab = activeTab === 'Confirmed';

  const tabs = [
    { id: 'Pending', label: 'Confirmation Pending', icon: AlertCircle },
    { id: 'Confirmed', label: 'Confirmed', icon: Check },
    { id: 'Rejected', label: 'Rejected', icon: X },
    { id: 'Reports', label: 'Pending Reports', icon: FileText },
    { id: 'Partial', label: 'Partially Received', icon: ClipboardList },
    { id: 'Recent', label: 'Uploaded Recently', icon: Upload },
    { id: 'Today', label: 'Today', icon: Calendar },
    { id: 'Tomorrow', label: 'Tomorrow', icon: Clock },
    { id: 'All', label: 'All', icon: null },
  ];

  const filteredData = useMemo(() => {
    let filtered = [...appointments];
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = format(tomorrowDate, 'yyyy-MM-dd');

    if (searchTerm) {
      console.log('Current Appointments Statuses:', appointments.map(a => a.status));
      filtered = filtered.filter(a => 
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Simple tab filtering for demo
    // Strict tab filtering based on vendor_status mapping
    if (activeTab === 'Pending') {
      filtered = filtered.filter(a => a.vendor_status === 'NEW');
    }
    if (activeTab === 'Confirmed') filtered = filtered.filter(a => a.vendor_status === 'CONFIRMED');
    if (activeTab === 'Rejected') filtered = filtered.filter(a => a.vendor_status === 'REJECTED');
    if (activeTab === 'Reports') filtered = filtered.filter(a => a.status === 'completed');
    if (activeTab === 'Recent') filtered = filtered.filter(a => a.status === 'uploaded_recently');
    if (activeTab === 'Partial') filtered = filtered.filter(a => a.status === 'partially_received');
    
    // Date filters (Today/Tomorrow)
    if (activeTab === 'Today') {
      filtered = filtered.filter(a => a.date.startsWith(today));
    }
    if (activeTab === 'Tomorrow') {
      filtered = filtered.filter(a => a.date.startsWith(tomorrow));
    }
    
    return filtered;
  }, [appointments, activeTab, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Appointments Management</h1>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Patient Name / ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all w-64 shadow-sm"
              />
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
             <Filter className="w-4 h-4" /> Filter
           </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <Card className="p-0 border-none shadow-sm overflow-hidden bg-white rounded-xl">
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100 bg-gray-50/30">
          {tabs.map(tab => (
            <TabItem 
              key={tab.id} 
              {...tab} 
              active={activeTab === tab.id} 
              onClick={setActiveTab} 
            />
          ))}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto custom-scrollbar-v2">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5">Appointment ID</th>
                <th className="px-6 py-5">Branch</th>
                <th className="px-6 py-5">Dr. Name</th>
                <th className="px-6 py-5">Time Since Creation</th>
                <th className="px-6 py-5">Home Coll.</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">National ID</th>
                <th className="px-6 py-5">Customer Details</th>
                <th className="px-6 py-5">Package Name</th>
                <th className="px-6 py-5">Collection Address</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((apt, idx) => (
                <tr key={idx} className="group hover:bg-blue-50/20 transition-colors text-xs font-medium text-gray-700">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{format(parseISO(apt.date), 'dd MMM yyyy')}</span>
                      <span className="text-gray-400 text-[10px] mt-1">{format(parseISO(apt.date), 'hh:mm a')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-black text-blue-600 uppercase tracking-tighter">
                    {apt.id}
                  </td>
                  <td className="px-6 py-5">
                    {apt.branch || 'Madhapur, Hyderabad'}
                  </td>
                  <td className="px-6 py-5 text-gray-400">
                    Dr. Vikram Singh
                  </td>
                  <td className="px-6 py-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${apt.isSlaBreached ? 'bg-red-500 text-white shadow-red-100' : 'bg-green-500 text-white shadow-green-100'}`}>
                        {apt.timeSinceCreate || '0'} Hrs
                     </span>
                  </td>
                  <td className="px-6 py-5 font-black uppercase text-[10px]">
                    {apt.home_collection ? 'YES' : 'NO'}
                  </td>
                  <td className="px-6 py-5">
                    <Badge status={apt.status} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest" />
                  </td>
                  <td className="px-6 py-5 text-gray-400">
                    --
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 uppercase">{apt.customerName}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                          23, Male
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">ID: 8829 | {apt.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-black text-[10px] uppercase truncate max-w-[120px] block">
                      {apt.package || 'Test CBP_22'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-300">
                    -------------------
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {isConfirmationPendingTab ? (
                        <>
                          <button 
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-sm shadow-green-100 transition-all active:scale-90"
                            title="Confirm"
                          >
                             <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateAppointmentStatus(apt.id, 'rejected')}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm shadow-red-100 transition-all active:scale-90"
                            title="Reject"
                          >
                             <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : isConfirmedTab ? (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95"
                            title="Completed"
                          >
                            <Check className="w-3.5 h-3.5" /> Completed
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'no-show')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
                            title="No Show"
                          >
                            <X className="w-3.5 h-3.5" /> No Show
                          </button>
                        </>
                      ) : (
                        <button 
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Reports
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="py-20 text-center">
               <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching records found</p>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredData.length} of {appointments.length} Total Appointments</p>
           <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-all"><ChevronRight className="w-5 h-5" /></button>
           </div>
        </div>
      </Card>
    </div>
  );
};
