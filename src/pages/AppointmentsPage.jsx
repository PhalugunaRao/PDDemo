import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft,
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2,
  Clock, 
  ChevronDown,
  ChevronLeft, 
  ChevronRight,
  Upload,
  Check,
  X,
  FileText,
  ClipboardList,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { format, parseISO } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmedDateRange, setConfirmedDateRange] = useState({ from: '', to: '' });
  const [confirmedDateRangeError, setConfirmedDateRangeError] = useState('');
  const [openPendingInfo, setOpenPendingInfo] = useState(null);
  const [openPackageInfo, setOpenPackageInfo] = useState(null);
  const [expandedPendingGroups, setExpandedPendingGroups] = useState([]);
  const [expandedPackageGroups, setExpandedPackageGroups] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const slaFilter = searchParams.get('sla');
  const isConfirmationPendingTab = activeTab === 'Pending';
  const isConfirmedTab = activeTab === 'Confirmed';
  const isRejectedTab = activeTab === 'Rejected';
  const isNoShowTab = activeTab === 'No Show';
  const isPartialTab = activeTab === 'Partial';
  const getAppointmentDateKey = (appointmentDate) => format(parseISO(appointmentDate), 'yyyy-MM-dd');

  const getReportStatusGroups = (tests = {}) =>
    Object.entries(tests)
      .map(([testName, testItems]) => {
        const components = (testItems || [])
          .map((testItem) => ({
            label: testItem.test_component || testItem.test_name,
            resultReceived: !!testItem.result_received,
          }))
          .filter((testItem) => testItem.label);

        return {
          testName,
          components,
          pendingCount: components.filter((component) => !component.resultReceived).length,
        };
      })
      .filter((group) => group.components.length > 0);

  const getPackageInfoGroups = (tests = {}) =>
    Object.entries(tests)
      .map(([testName, testItems]) => ({
        testName,
        components: [...new Set(
          (testItems || [])
            .map((testItem) => testItem.test_component || testItem.test_name)
            .filter(Boolean)
        )],
      }))
      .filter((group) => group.components.length > 0);

  const getActionConfig = (status, isMandatory) => {
    const actionMap = {
      confirmed: {
        title: 'Confirm Appointment',
        description: 'Add remarks if needed (optional)',
        placeholder: 'Add remarks if needed',
        submitLabel: 'Confirm',
        submitClassName: 'bg-green-600 hover:bg-green-700',
      },
      rejected: {
        title: 'Reject Appointment',
        description: 'Remarks are mandatory before rejecting',
        placeholder: 'Enter rejection remarks',
        submitLabel: 'Reject',
        submitClassName: 'bg-red-600 hover:bg-red-700',
      },
      completed: {
        title: 'Mark Appointment as Completed',
        description: 'Add remarks if needed (optional)',
        placeholder: 'Add completion remarks if needed',
        submitLabel: 'Mark as Completed',
        submitClassName: 'bg-green-600 hover:bg-green-700',
      },
      'no-show': {
        title: 'Mark Appointment as No Show',
        description: 'Remarks are mandatory before marking this appointment as no show',
        placeholder: 'Enter no show remarks',
        submitLabel: 'Mark as No Show',
        submitClassName: 'bg-red-600 hover:bg-red-700',
      },
    };

    return {
      ...(actionMap[status] || actionMap.confirmed),
      remarksLabel: `Remarks ${isMandatory ? '*' : '(Optional)'}`,
      remarksError: status === 'no-show'
        ? 'Remarks are mandatory before marking this appointment as no show.'
        : status === 'rejected'
          ? 'Remarks are mandatory before rejecting.'
          : 'Remarks are required to continue.',
    };
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const tabMap = {
      today: 'Today',
      'report-pending': 'Reports',
    };

    if (tabParam && tabMap[tabParam]) {
      setActiveTab(tabMap[tabParam]);
    }
  }, [searchParams]);

  const openRemarksDialog = (appointmentId, status, isMandatory) => {
    setPendingAction({ appointmentId, status, isMandatory });
    setRemarks('');
    setRemarksError('');
  };

  const closeRemarksDialog = () => {
    setPendingAction(null);
    setRemarks('');
    setRemarksError('');
  };

  const closePendingInfoDialog = () => {
    setOpenPendingInfo(null);
    setExpandedPendingGroups([]);
  };

  const closePackageInfoDialog = () => {
    setOpenPackageInfo(null);
    setExpandedPackageGroups([]);
  };

  const openPendingReportsDialog = (appointment) => {
    const groups = getReportStatusGroups(appointment.tests);

    setOpenPendingInfo({
      id: appointment.id,
      appointment,
      groups,
    });
    setExpandedPendingGroups(groups.map((group) => group.testName));
  };

  const openPackageInfoDialog = (appointment) => {
    const groups = getPackageInfoGroups(appointment.tests);

    setOpenPackageInfo({
      id: appointment.id,
      packageName: appointment.package || 'Package Information',
      groups,
    });
    setExpandedPackageGroups(groups.map((group) => group.testName));
  };

  const openUploadDrawerFromPendingReports = () => {
    if (!openPendingInfo?.appointment) return;

    setSelectedAppointment(openPendingInfo.appointment);
    closePendingInfoDialog();
  };

  const togglePendingGroup = (groupName) => {
    setExpandedPendingGroups((current) =>
      current.includes(groupName)
        ? current.filter((item) => item !== groupName)
        : [...current, groupName]
    );
  };

  const togglePackageGroup = (groupName) => {
    setExpandedPackageGroups((current) =>
      current.includes(groupName)
        ? current.filter((item) => item !== groupName)
        : [...current, groupName]
    );
  };

  const handleConfirmedDateChange = (field, value) => {
    setConfirmedDateRange((current) => {
      const nextRange = { ...current, [field]: value };

      if (nextRange.from && nextRange.to && nextRange.to < nextRange.from) {
        setConfirmedDateRangeError('To date cannot be earlier than From date.');
      } else {
        setConfirmedDateRangeError('');
      }

      return nextRange;
    });
  };

  const clearConfirmedDateFilter = () => {
    setConfirmedDateRange({ from: '', to: '' });
    setConfirmedDateRangeError('');
  };

  const submitPendingAction = () => {
    const trimmedRemarks = remarks.trim();

    if (pendingAction?.isMandatory && !trimmedRemarks) {
      setRemarksError(getActionConfig(pendingAction.status, pendingAction.isMandatory).remarksError);
      return;
    }

    updateAppointmentStatus(pendingAction.appointmentId, pendingAction.status, trimmedRemarks);
    closeRemarksDialog();
  };

  const tabs = [
    { id: 'Pending', label: 'Confirmation Pending', icon: AlertCircle },
    { id: 'Confirmed', label: 'Confirmed', icon: Check },
    { id: 'Rejected', label: 'Rejected', icon: X },
    { id: 'No Show', label: 'No Show', icon: X },
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
    if (activeTab === 'Confirmed') {
      filtered = filtered
        .filter(a => a.vendor_status === 'CONFIRMED')
        .sort((a, b) => parseISO(b.date) - parseISO(a.date));
    }
    if (activeTab === 'Rejected') filtered = filtered.filter(a => a.vendor_status === 'REJECTED');
    if (activeTab === 'No Show') filtered = filtered.filter(a => a.status === 'no-show');
    if (activeTab === 'Reports') filtered = filtered.filter(a => a.status === 'completed');
    if (activeTab === 'Recent') filtered = filtered.filter(a => a.status === 'uploaded_recently');
    if (activeTab === 'Partial') filtered = filtered.filter(a => a.status === 'partially_received');
    
    // Date filters (Today/Tomorrow)
    if (activeTab === 'Today') {
      filtered = filtered.filter(a => getAppointmentDateKey(a.date) === today);
    }
    if (activeTab === 'Tomorrow') {
      filtered = filtered.filter(a => getAppointmentDateKey(a.date) === tomorrow);
    }

    if (activeTab === 'Confirmed' && (confirmedDateRange.from || confirmedDateRange.to)) {
      filtered = filtered
        .filter((a) => {
          const appointmentDateKey = getAppointmentDateKey(a.date);

          if (confirmedDateRange.from && appointmentDateKey < confirmedDateRange.from) return false;
          if (confirmedDateRange.to && appointmentDateKey > confirmedDateRange.to) return false;
          return true;
        })
        .sort((a, b) => parseISO(a.date) - parseISO(b.date));
    }

    if (activeTab === 'Today' && slaFilter) {
      filtered = filtered.filter((appointment) => {
        const diffMinutes = (Date.now() - new Date(appointment.date).getTime()) / (1000 * 60);

        if (slaFilter === 'green') return diffMinutes <= 7;
        if (slaFilter === 'amber') return diffMinutes > 7 && diffMinutes <= 15;
        if (slaFilter === 'red') return diffMinutes > 15;
        return true;
      });
    }
    
    return filtered;
  }, [appointments, activeTab, searchTerm, confirmedDateRange, slaFilter]);

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
           {isConfirmedTab && (
             <div className="flex flex-col gap-2">
               <div className="flex flex-wrap items-end gap-3">
                 <label className="flex flex-col gap-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">From</span>
                   <input
                     type="date"
                     value={confirmedDateRange.from}
                     max={confirmedDateRange.to || undefined}
                     onChange={(e) => handleConfirmedDateChange('from', e.target.value)}
                     onClick={(event) => event.currentTarget.showPicker?.()}
                     onFocus={(event) => event.currentTarget.showPicker?.()}
                     className={`px-4 py-3 bg-white border rounded-xl text-xs font-bold outline-none transition-all shadow-sm ${
                       confirmedDateRangeError
                         ? 'border-red-300 focus:ring-4 focus:ring-red-500/10 focus:border-red-500'
                         : 'border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600'
                     }`}
                   />
                 </label>
                 <label className="flex flex-col gap-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">To</span>
                   <input
                     type="date"
                     value={confirmedDateRange.to}
                     min={confirmedDateRange.from || undefined}
                     onChange={(e) => handleConfirmedDateChange('to', e.target.value)}
                     onClick={(event) => event.currentTarget.showPicker?.()}
                     onFocus={(event) => event.currentTarget.showPicker?.()}
                     className={`px-4 py-3 bg-white border rounded-xl text-xs font-bold outline-none transition-all shadow-sm ${
                       confirmedDateRangeError
                         ? 'border-red-300 focus:ring-4 focus:ring-red-500/10 focus:border-red-500'
                         : 'border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600'
                     }`}
                   />
                 </label>
                 {(confirmedDateRange.from || confirmedDateRange.to) && (
                   <button
                     type="button"
                     onClick={clearConfirmedDateFilter}
                     className="px-4 py-3 bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                   >
                     Clear
                   </button>
                 )}
               </div>
               {confirmedDateRangeError && (
                 <p className="text-xs font-bold text-red-600">{confirmedDateRangeError}</p>
               )}
             </div>
           )}
           {!isConfirmedTab && (
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
               <Filter className="w-4 h-4" /> Filter
             </button>
           )}
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
                <th className="px-6 py-5 text-center">Action</th>
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
                {isPartialTab && <th className="px-6 py-5">Pending Reports</th>}
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
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {isConfirmationPendingTab ? (
                        <>
                          <button 
                            onClick={() => openRemarksDialog(apt.id, 'confirmed', false)}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-sm shadow-green-100 transition-all active:scale-90"
                            title="Confirm"
                          >
                             <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openRemarksDialog(apt.id, 'rejected', true)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm shadow-red-100 transition-all active:scale-90"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : isConfirmedTab ? (
                        <>
                          <button
                            onClick={() => openRemarksDialog(apt.id, 'completed', false)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95"
                            title="Completed"
                          >
                            <Check className="w-3.5 h-3.5" /> Completed
                          </button>
                          <button
                            onClick={() => openRemarksDialog(apt.id, 'no-show', true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
                            title="No Show"
                          >
                            <X className="w-3.5 h-3.5" /> No Show
                          </button>
                        </>
                      ) : isRejectedTab ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">--</span>
                      ) : isNoShowTab ? (
                        <button
                          onClick={() => openRemarksDialog(apt.id, 'completed', false)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95"
                          title="Mark as Completed"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark as Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Reports
                        </button>
                      )}
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
                    {isPartialTab && apt.validationFlags?.length > 0 && (
                      <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-red-700">Red Flag Warning</p>
                        <p className="mt-1 text-[10px] font-bold text-red-700">{apt.validationFlags[0]}</p>
                      </div>
                    )}
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
                    <button
                      type="button"
                      onClick={() => openPackageInfoDialog(apt)}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-black text-[10px] uppercase truncate max-w-[120px] block hover:bg-blue-100 transition-colors text-left"
                      title="View package info"
                    >
                      {apt.package || 'Test CBP_22'}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-gray-300">
                    -------------------
                  </td>
                  {isPartialTab && (
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 max-w-[260px]">
                        {getReportStatusGroups(apt.tests).some((group) => group.pendingCount > 0) ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-700 hover:bg-blue-100 transition-colors"
                            aria-label={`View pending reports for ${apt.id}`}
                            onClick={() => openPendingReportsDialog(apt)}
                          >
                            <Info className="w-4 h-4" />
                            View Pending Reports
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-green-50 text-green-700 border-green-200">
                            No Pending Reports
                          </span>
                        )}
                      </div>
                    </td>
                  )}
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

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="space-y-4">
              <div>
                {(() => {
                  const actionConfig = getActionConfig(pendingAction.status, pendingAction.isMandatory);

                  return (
                    <>
                      <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                        {actionConfig.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {actionConfig.description}
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-2">
                {(() => {
                  const actionConfig = getActionConfig(pendingAction.status, pendingAction.isMandatory);

                  return (
                    <>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500">
                        {actionConfig.remarksLabel}
                      </label>
                      <textarea
                        value={remarks}
                        onChange={(e) => {
                          setRemarks(e.target.value);
                          if (remarksError) setRemarksError('');
                        }}
                        rows={4}
                        placeholder={actionConfig.placeholder}
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-700 outline-none transition-all resize-none ${
                          remarksError
                            ? 'border-red-300 focus:ring-4 focus:ring-red-500/10 focus:border-red-500'
                            : 'border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600'
                        }`}
                      />
                    </>
                  );
                })()}
                {remarksError && (
                  <p className="text-xs font-bold text-red-600">{remarksError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={closeRemarksDialog}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                {(() => {
                  const actionConfig = getActionConfig(pendingAction.status, pendingAction.isMandatory);

                  return (
                    <button
                      onClick={submitPendingAction}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all ${actionConfig.submitClassName}`}
                    >
                      {actionConfig.submitLabel}
                    </button>
                  );
                })()}
              </div>
            </div>
          </Card>
        </div>
      )}

      {openPendingInfo && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-[1px]"
          onClick={closePendingInfoDialog}
        >
          <div className="absolute inset-y-0 right-0 w-full max-w-2xl pl-6 sm:pl-10">
            <Card
              className="flex h-full w-full flex-col bg-white shadow-2xl border-l border-gray-200 rounded-none overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={closePendingInfoDialog}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                    aria-label="Close pending reports panel"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-700 tracking-tight">Reports status</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-400">Appointment {openPendingInfo.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openUploadDrawerFromPendingReports}
                  className="px-5 py-3 rounded-2xl bg-blue-600 text-white text-sm font-black tracking-wide hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Upload pending reports
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">List of Tests</p>

                <div className="mt-5 space-y-5">
                  {openPendingInfo.groups.map((group) => {
                    const isExpanded = expandedPendingGroups.includes(group.testName);

                    return (
                      <div key={`${openPendingInfo.id}-${group.testName}`} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => togglePendingGroup(group.testName)}
                          className="flex w-full items-center justify-between gap-4 text-left"
                          aria-expanded={isExpanded}
                        >
                          <div>
                            <p className="text-[15px] font-black text-slate-700">{group.testName}</p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="mt-4 space-y-4 pl-4">
                            {group.components.map((component) => (
                              <div
                                key={`${openPendingInfo.id}-${group.testName}-${component.label}`}
                                className="flex items-center gap-3"
                              >
                                {component.resultReceived ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
                                )}
                                <p className={`text-[14px] font-black ${component.resultReceived ? 'text-slate-700' : 'text-slate-600'}`}>
                                  {component.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {openPackageInfo && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-[1px]"
          onClick={closePackageInfoDialog}
        >
          <div className="absolute inset-y-0 right-0 w-full max-w-2xl pl-6 sm:pl-10">
            <Card
              className="flex h-full w-full flex-col bg-white shadow-2xl border-l border-gray-200 rounded-none overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={closePackageInfoDialog}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                    aria-label="Close package info panel"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-700 tracking-tight">View package info</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-400">{openPackageInfo.packageName}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">List of Tests</p>

                <div className="mt-5 space-y-5">
                  {openPackageInfo.groups.map((group) => {
                    const isExpanded = expandedPackageGroups.includes(group.testName);

                    return (
                      <div key={`${openPackageInfo.id}-${group.testName}`} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => togglePackageGroup(group.testName)}
                          className="flex w-full items-center justify-between gap-4 text-left"
                          aria-expanded={isExpanded}
                        >
                          <div>
                            <p className="text-[15px] font-black text-slate-700">{group.testName}</p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="mt-4 space-y-3 pl-4">
                            {group.components.map((component) => (
                              <div
                                key={`${openPackageInfo.id}-${group.testName}-${component}`}
                                className="flex items-center gap-3"
                              >
                                <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                                <p className="text-[14px] font-black text-slate-700">{component}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <AppointmentDetailDrawer
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
};
