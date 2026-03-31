import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Package,
  MapPin,
  Tag
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export const AppointmentDetailDrawer = ({ appointment, isOpen, onClose, reportsOnly = false }) => {
  const { appointments, updateAppointmentStatus, uploadReport } = useAppContext();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(reportsOnly ? 'reports' : 'details');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndStoreFiles = (files) => {
    if (!files.length) {
      setSelectedFiles([]);
      setUploadError('');
      return;
    }

    const invalidFile = files.find((file) => {
      const lowerName = file.name.toLowerCase();
      return file.type !== 'application/pdf' && !lowerName.endsWith('.pdf');
    });

    if (invalidFile) {
      setSelectedFiles([]);
      setUploadError('Only PDF files are allowed.');
      setFileInputKey((current) => current + 1);
      return;
    }

    setSelectedFiles(files);
    setUploadError('');
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    validateAndStoreFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    if (uploading || pendingComponents.length === 0 || selectedComponents.length === 0) return;

    const files = Array.from(event.dataTransfer.files || []);
    validateAndStoreFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (uploading || pendingComponents.length === 0 || selectedComponents.length === 0) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragActive(false);
    }
  };

  const openFilePicker = () => {
    if (uploading || pendingComponents.length === 0 || selectedComponents.length === 0) return;
    fileInputRef.current?.click();
  };

  const toggleComponentSelection = (component) => {
    setSelectedComponents((current) =>
      current.includes(component)
        ? current.filter((item) => item !== component)
        : [...current, component]
    );
  };

  const toggleSelectAllComponents = () => {
    setSelectedComponents((current) =>
      current.length === pendingComponents.length ? [] : [...pendingComponents]
    );
  };

  const handleUpload = () => {
    if (!selectedFiles.length || selectedComponents.length === 0) return;

    setUploading(true);
    setTimeout(() => {
      uploadReport(currentAppointment.id, selectedFiles, selectedComponents);
      setSelectedComponents([]);
      setSelectedFiles([]);
      setUploadError('');
      setFileInputKey((current) => current + 1);
      setUploading(false);
    }, 2000);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'tests', label: 'Tests & Packages', icon: Package },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const visibleTabs = reportsOnly ? tabs.filter((tab) => tab.id === 'reports') : tabs;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!appointment?.id) return;

    setActiveTab(reportsOnly ? 'reports' : 'details');
    setSelectedComponents([]);
    setSelectedFiles([]);
    setUploadError('');
    setIsDragActive(false);
    setFileInputKey((current) => current + 1);
  }, [appointment?.id, reportsOnly]);

  if (!appointment) return null;

  const currentAppointment = appointments.find((item) => item.id === appointment.id) || appointment;
  const pendingComponents = currentAppointment.pendingComponents || [];
  const uploadedComponents = currentAppointment.uploadedComponents || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`absolute right-4 bg-white shadow-2xl flex flex-col overflow-hidden border border-gray-100 ${
              reportsOnly
                ? 'top-6 bottom-6 w-[calc(100%-1rem)] max-w-2xl rounded-[2rem]'
                : 'top-24 bottom-4 w-[calc(100%-1rem)] max-w-2xl rounded-[2rem]'
            }`}
          >
            {/* Header */}
            <div className={`border-b border-gray-50 ${reportsOnly ? 'px-6 py-5 bg-white' : 'p-8 bg-gradient-to-r from-gray-50/50 to-white'}`}>
              <div className="flex items-start justify-between">
                <div className={`flex items-center ${reportsOnly ? 'gap-4' : 'gap-5'}`}>
                  {reportsOnly ? (
                    <>
                      <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div>
                        <h2 className="text-2xl font-black text-slate-700 tracking-tight">Upload Reports</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-400">{currentAppointment.id} • {currentAppointment.customerName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-black shadow-2xl shadow-brand-200 rotate-3 transition-transform hover:rotate-0">
                        {currentAppointment.customerName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase">
                          {currentAppointment.customerName}
                          <Badge status={currentAppointment.status} className="text-sm px-4 py-1.5 font-black uppercase tracking-widest shadow-sm" />
                        </h2>
                        <p className="text-gray-400 font-bold mt-1 text-sm tracking-widest uppercase">{currentAppointment.id} • {currentAppointment.branch}</p>
                      </div>
                    </>
                  )}
                </div>
                {!reportsOnly && (
                  <button 
                    onClick={onClose}
                    className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              {!reportsOnly && <div className="flex gap-3 mt-10">
                {currentAppointment.status === 'new' && (
                  <>
                    <Button 
                      variant="primary" 
                      onClick={() => updateAppointmentStatus(currentAppointment.id, 'confirmed')}
                      className="flex-1 py-4 text-sm font-black uppercase tracking-widest rounded-2xl shadow-brand-100 shadow-xl"
                      icon={Check}
                    >
                      Confirm Booking
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => updateAppointmentStatus(currentAppointment.id, 'no-show')}
                      className="flex-1 py-4 text-sm font-black uppercase tracking-widest rounded-2xl"
                      icon={X}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {currentAppointment.status === 'confirmed' && (
                  <Button 
                    variant="primary" 
                    onClick={() => updateAppointmentStatus(currentAppointment.id, 'completed')}
                    className="flex-1 py-4 text-sm font-black uppercase tracking-widest rounded-2xl shadow-brand-100 shadow-xl"
                    icon={ShieldCheck}
                  >
                    Mark as Arrived / Samples Taken
                  </Button>
                )}
                <Button variant="secondary" className="px-5 rounded-2xl border-gray-100 hover:border-gray-200 shadow-sm" icon={ExternalLink}>SHARE</Button>
              </div>}
            </div>

            {/* Navigation Tabs */}
            {!reportsOnly && <div className="flex border-b border-gray-100 px-8 bg-white sticky top-0 z-10">
              {visibleTabs.map((tab) => (
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
            </div>}

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar-v2 ${reportsOnly ? 'px-6 py-6' : 'p-8 space-y-10'}`}>
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
                          <span className="font-bold text-gray-900 text-lg">{currentAppointment.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-brand-100 transition-colors group-hover:bg-white group-hover:shadow-lg group-hover:shadow-gray-100">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 text-lg truncate flex-1">{currentAppointment.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                        </div>
                        <p className="font-black text-gray-900 uppercase">{format(parseISO(currentAppointment.date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Time</span>
                        </div>
                        <p className="font-black text-gray-900 uppercase">{format(parseISO(currentAppointment.date), 'hh:mm a')}</p>
                      </div>
                      <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Activity className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Age/Gender</span>
                        </div>
                        <p className="font-black text-gray-900 uppercase tracking-tighter">{currentAppointment.age}Y • {currentAppointment.gender}</p>
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
                              <div>
                                <h5 className="text-xl font-black text-gray-900 uppercase tracking-tight">{currentAppointment.package}</h5>
                                <div className="flex gap-2 mt-1">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {currentAppointment.benefitType}
                                  </span>
                                </div>
                              </div>
                              <span className="text-2xl font-black text-brand-600">₹{Math.floor(currentAppointment.price)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                               <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-100">PRE-PAID</span>
                               <span className={`px-3 py-1 ${currentAppointment.home_collection ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-100 text-gray-600 border-gray-200'} rounded-full text-[10px] font-black uppercase tracking-widest border`}>
                                 {currentAppointment.home_collection ? 'HOME COLLECTION' : 'CENTER VISIT'}
                               </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {currentAppointment.address && currentAppointment.address !== ', ' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] px-1">Collection Address</h4>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4 hover:bg-white hover:border-brand-100 hover:shadow-lg transition-all">
                           <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5" />
                           </div>
                           <p className="font-bold text-gray-700 text-sm leading-relaxed">{currentAppointment.address}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'tests' && (
                  <motion.div 
                    key="tests"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between px-1">
                       <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em]">Test Components Breakdown</h4>
                       <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100 italic">Verified by Laboratory</span>
                    </div>

                    {currentAppointment.tests ? (
                      Object.entries(currentAppointment.tests).map(([category, tests]) => (
                        <div key={category} className="space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="h-0.5 flex-1 bg-gray-50" />
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{category}</span>
                              <div className="h-0.5 flex-1 bg-gray-50" />
                           </div>
                           <div className="grid grid-cols-1 gap-3">
                              {tests.map((test, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/50 transition-all group">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${test.result_received ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                         {test.result_received ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                      </div>
                                      <div>
                                         <p className="text-[13px] font-black text-gray-900 uppercase leading-none">{test.test_component || test.test_name}</p>
                                         <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">Loinc: {test.lonic_code || 'PENDING'} • {test.category || 'Standard'}</p>
                                      </div>
                                   </div>
                                   <Badge status={test.result_received ? 'completed' : 'pending'} className="text-[9px] px-3 py-1 font-black uppercase tracking-widest" />
                                </div>
                              ))}
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                         <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                         <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Detailed test breakdown unavailable</p>
                      </div>
                    )}
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
                    {currentAppointment.auditLog?.map((log, idx) => (
                      <div key={idx} className="relative pl-10 group">
                        {idx !== (currentAppointment.auditLog?.length || 0) - 1 && (
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
                    className={reportsOnly ? 'space-y-6' : 'space-y-10'}
                  >
                    {reportsOnly && (
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Reports section</p>
                        <h3 className="mt-3 text-xl font-black text-slate-700">Upload diagnostics and select pending components</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-400">Only the report upload workflow is shown here.</p>
                      </div>
                    )}

                    <div className={`grid grid-cols-1 gap-6 items-start ${reportsOnly ? 'xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.95fr)]' : 'lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]'}`}>
                      <div className="space-y-4">
                        <h4 className={`text-sm font-black uppercase tracking-[0.1em] px-1 ${reportsOnly ? 'text-slate-700' : 'text-gray-900'}`}>Upload Diagnostics</h4>
                        <div
                          className={`border-4 border-dashed rounded-3xl text-center transition-all group relative overflow-hidden ${
                            reportsOnly ? 'p-8 bg-gray-50/50' : 'p-12'
                          } ${
                            isDragActive
                              ? 'border-brand-300 bg-brand-50/30'
                              : 'border-gray-100 hover:border-brand-200 hover:bg-brand-50/20'
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <div className="mb-6 relative z-10">
                            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-left">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Components Included In This Report</p>
                                {pendingComponents.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={toggleSelectAllComponents}
                                    className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700 transition-colors"
                                  >
                                    {selectedComponents.length === pendingComponents.length ? 'Clear All' : 'Select All'}
                                  </button>
                                )}
                              </div>
                              <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                                {pendingComponents.map((component) => (
                                  <label key={component} className="flex items-start gap-3 rounded-xl border border-gray-100 px-3 py-3 cursor-pointer hover:border-brand-200 transition-all">
                                    <input
                                      type="checkbox"
                                      checked={selectedComponents.includes(component)}
                                      onChange={() => toggleComponentSelection(component)}
                                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                    />
                                    <span className="text-xs font-black uppercase tracking-wide text-gray-700">{component}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <input
                            key={fileInputKey}
                            id={`report-upload-${currentAppointment.id}`}
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf,.pdf"
                            multiple
                            className="hidden"
                            onChange={handleFileSelection}
                            disabled={uploading || pendingComponents.length === 0 || selectedComponents.length === 0}
                          />
                          <div className="flex flex-col items-center gap-6">
                             <div className="w-24 h-24 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-brand-100/50">
                                <Upload className="w-10 h-10" />
                             </div>
                             <div>
                                <p className="text-xl font-black text-gray-900 uppercase tracking-tight">Drag & Drop Results</p>
                                <p className="text-sm text-gray-400 font-bold mt-2 uppercase tracking-widest">Supported: PDF only</p>
                             </div>
                             <div className="flex flex-col items-center gap-3">
                               <Button
                                 type="button"
                                 onClick={openFilePicker}
                                 variant="secondary"
                                 className="px-8 py-3 rounded-2xl border-gray-200 font-black uppercase tracking-widest text-xs"
                                 disabled={uploading || pendingComponents.length === 0 || selectedComponents.length === 0}
                               >
                                 Select PDF Files
                               </Button>
                               <Button
                                 type="button"
                                 loading={uploading}
                                 variant="primary"
                                 onClick={handleUpload}
                                 className="px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs"
                                 disabled={uploading || pendingComponents.length === 0 || selectedComponents.length === 0 || selectedFiles.length === 0}
                               >
                                 Upload
                               </Button>
                             </div>
                             {selectedComponents.length > 0 && (
                               <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 text-left">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Selected Components</p>
                                 <div className="mt-2 flex flex-wrap gap-2">
                                   {selectedComponents.map((component) => (
                                     <span
                                       key={component}
                                       className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-200"
                                     >
                                       {component}
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             )}
                             {selectedFiles.length > 0 && (
                               <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/80 px-4 py-3 text-left">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Selected Files</p>
                                 <div className="mt-2 space-y-1">
                                   {selectedFiles.map((file) => (
                                     <p key={`${file.name}-${file.size}`} className="text-xs font-bold text-gray-700 truncate">
                                       {file.name}
                                     </p>
                                   ))}
                                 </div>
                               </div>
                             )}
                             {uploadError && (
                               <p className="text-xs font-bold text-red-600">{uploadError}</p>
                             )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className={`text-sm font-black uppercase tracking-[0.1em] px-1 ${reportsOnly ? 'text-slate-700' : 'text-gray-900'}`}>Pending Components</h4>
                        <Card className={`p-5 rounded-3xl border border-gray-100 shadow-none ${reportsOnly ? 'bg-white' : ''}`}>
                          <div className="space-y-3">
                            {uploadedComponents.map((component) => (
                              <div key={`uploaded-${component}`} className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3 border border-green-100">
                                <span className="text-xs font-black uppercase tracking-wider text-green-800">{component}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Uploaded</span>
                              </div>
                            ))}
                            {pendingComponents.map((component) => (
                              <div key={`pending-${component}`} className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 border border-red-100">
                                <span className="text-xs font-black uppercase tracking-wider text-red-800">{component}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-700">Pending</span>
                              </div>
                            ))}
                            {pendingComponents.length === 0 && uploadedComponents.length === 0 && (
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center py-6">No components available</p>
                            )}
                          </div>
                        </Card>

                        {currentAppointment.validationFlags?.length > 0 && (
                          <div className="p-5 bg-red-50 rounded-3xl border border-red-200">
                            <p className="text-sm font-black text-red-800 uppercase tracking-wide">Red Flag Warning</p>
                            <div className="mt-3 space-y-2">
                              {currentAppointment.validationFlags.map((flag) => (
                                <p key={flag} className="text-xs font-bold text-red-700">{flag}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Existing Reports */}
                    {!reportsOnly && currentAppointment.reports?.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] px-1">Available Reports ({currentAppointment.reports.length})</h4>
                        <div className="space-y-4">
                          {currentAppointment.reports.map((report) => (
                            <div key={report.id || report.name} className="p-6 bg-white rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-brand-100 hover:shadow-xl hover:shadow-gray-100/50 transition-all">
                              <div className="flex items-center gap-5">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{report.name}</p>
                                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{report.componentName || 'General'} • {report.size || 'PDF Document'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Download className="w-5 h-5" /></button>
                                <button className="p-3 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><ExternalLink className="w-5 h-5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {currentAppointment.status === 'verification_required' && (
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
        </div>
      )}
    </AnimatePresence>
  );
};
