import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  ExternalLink, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  FileText, 
  History, 
  Upload, 
  Download,
  ShieldCheck,
  ChevronRight,
  User,
  Activity,
  ArrowUpRight,
  Package
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export const AppointmentDetailDrawer = ({ appointment, isOpen, onClose }) => {
  const { updateAppointmentStatus } = useAppContext();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  if (!appointment) return null;

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      updateAppointmentStatus(appointment.id, 'verification_required');
      setUploading(false);
      onClose();
    }, 2000);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'tests', label: 'Tests & Packages', icon: Package },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-[101] flex flex-col overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-black shadow-2xl shadow-brand-200 rotate-3 transition-transform hover:rotate-0">
                    {appointment.customerName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                      {appointment.customerName}
                      <Badge status={appointment.status} className="text-sm px-4 py-1.5 font-black uppercase tracking-widest shadow-sm" />
                    </h2>
                    <p className="text-gray-400 font-bold mt-1 text-sm tracking-widest uppercase">{appointment.id} • {appointment.branch}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mt-10">
                {appointment.status === 'new' && (
                  <>
                    <Button 
                      variant="primary" 
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      className="flex-1 py-4 text-sm font-black uppercase tracking-widest rounded-2xl shadow-brand-100 shadow-xl"
                      icon={Check}
                    >
                      Confirm Booking
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => updateAppointmentStatus(appointment.id, 'no-show')}
                      className="flex-1 py-4 text-sm font-black uppercase tracking-widest rounded-2xl"
                      icon={X}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {appointment.status === 'confirmed' && (
                  <Button 
                    variant="primary" 
                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                    className="flex-1 py-4 text-sm font-black uppercase tracking-widest rounded-2xl shadow-brand-100 shadow-xl"
                    icon={ShieldCheck}
                  >
                    Mark as Arrived / Samples Taken
                  </Button>
                )}
                <Button variant="secondary" className="px-5 rounded-2xl border-gray-100 hover:border-gray-200 shadow-sm" icon={ExternalLink}>SHARE</Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 px-8 bg-white sticky top-0 z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-5 text-xs font-black uppercase tracking-widest transition-all relative group h-16 ${
                    activeTab === tab.id ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {React.createElement(tab.icon, { className: `w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-brand-600' : ''}` })}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabDrawer" 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 rounded-full" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar-v2">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                        <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-brand-100 transition-colors group-hover:bg-white group-hover:shadow-lg group-hover:shadow-gray-100">
                          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <Phone className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 text-lg">{appointment.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-brand-100 transition-colors group-hover:bg-white group-hover:shadow-lg group-hover:shadow-gray-100">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 text-lg truncate flex-1">{appointment.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                        </div>
                        <p className="font-black text-gray-900 uppercase">{format(parseISO(appointment.date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Time</span>
                        </div>
                        <p className="font-black text-gray-900 uppercase">{format(parseISO(appointment.date), 'hh:mm a')}</p>
                      </div>
                      <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Activity className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Age/Gender</span>
                        </div>
                        <p className="font-black text-gray-900 uppercase tracking-tighter">{appointment.age}Y • {appointment.gender}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] px-1">Selected Package</h4>
                      <Card className="hover:border-brand-100 transition-all border-2 border-gray-50 p-8 shadow-none bg-gradient-to-br from-white to-gray-50/30 group">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-brand-100/20">
                            <Package className="w-8 h-8" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h5 className="text-xl font-black text-gray-900 uppercase tracking-tight">{appointment.package}</h5>
                              <span className="text-2xl font-black text-brand-600">₹{appointment.price}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                               <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-100">PRE-PAID</span>
                               <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">62 PARAMETERS</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'timeline' && (
                  <motion.div 
                    key="timeline"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-12 pl-4"
                  >
                    {appointment.auditLog?.map((log, idx) => (
                      <div key={idx} className="relative pl-10 group">
                        {idx !== (appointment.auditLog?.length || 0) - 1 && (
                          <div className="absolute left-4 top-8 bottom-[-32px] w-0.5 bg-gray-100 rounded-full" />
                        )}
                        <div className="absolute left-0 top-1 p-2 bg-white border-2 border-brand-600 rounded-xl shadow-lg shadow-brand-100 group-hover:scale-125 transition-transform duration-300 z-10">
                          <History className="w-4 h-4 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{log.action}</p>
                          <p className="text-xs text-brand-600 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                             Performed by: {log.user} 
                             <span className="w-1 h-1 bg-gray-300 rounded-full" />
                             {format(parseISO(log.timestamp), 'MMM dd, hh:mm a')}
                          </p>
                          <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-medium text-gray-500 leading-relaxed italic border-l-4 border-l-brand-600">
                             "System verified the customer identity and initiated the booking protocol."
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'reports' && (
                  <motion.div 
                    key="reports"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10"
                  >
                    {/* File Upload Area */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] px-1">Upload Diagnostics</h4>
                      <div className="border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center hover:border-brand-200 hover:bg-brand-50/20 transition-all group cursor-pointer relative overflow-hidden">
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={handleUpload}
                          disabled={uploading}
                        />
                        <div className="flex flex-col items-center gap-6">
                           <div className="w-24 h-24 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-brand-100/50">
                              <Upload className="w-10 h-10" />
                           </div>
                           <div>
                              <p className="text-xl font-black text-gray-900 uppercase tracking-tight">Drag & Drop Results</p>
                              <p className="text-sm text-gray-400 font-bold mt-2 uppercase tracking-widest">Supported: PDF, JPG, PNG (Max 10MB)</p>
                           </div>
                           <Button 
                             loading={uploading}
                             variant="secondary" 
                             className="px-8 py-3 rounded-2xl border-gray-200 font-black uppercase tracking-widest text-xs"
                           >
                             Select Files from storage
                           </Button>
                        </div>
                      </div>
                    </div>

                    {/* Existing Reports */}
                    {appointment.reports?.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] px-1">Available Reports ({appointment.reports.length})</h4>
                        <div className="space-y-4">
                          {appointment.reports.map((report) => (
                            <div key={report.id || report.name} className="p-6 bg-white rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-brand-100 hover:shadow-xl hover:shadow-gray-100/50 transition-all">
                              <div className="flex items-center gap-5">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{report.name}</p>
                                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{report.size} • PDF Document</p>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Download className="w-5 h-5" /></button>
                                <button className="p-3 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><ExternalLink className="w-5 h-5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {appointment.status === 'verification_required' && (
                          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-5">
                             <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                                <Clock className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Pending Dispatch Verification</p>
                                <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed uppercase tracking-wider">
                                   These reports have been uploaded and are currently under review by the quality assurance team. They will be sent to the customer once approved.
                                </p>
                             </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
