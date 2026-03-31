import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { RAW_APPOINTMENTS } from '../data/realAppointments';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { 
  ArrowLeft,
  Calendar, 
  Upload, 
  AlertCircle, 
  Circle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Check,
  Info,
  X,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const KPICard = ({ title, value, icon: Icon, colorClass, iconColor, onClick }) => (
  <Card
    className={`p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl ${onClick ? 'cursor-pointer hover:-translate-y-0.5 transition-all' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{value}</h3>
      </div>
    </div>
  </Card>
);

export const DashboardHome = () => {
  const { appointments, updateAppointmentStatus } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('today');
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openPendingInfo, setOpenPendingInfo] = useState(null);
  const [openPackageInfo, setOpenPackageInfo] = useState(null);
  const [expandedPendingGroups, setExpandedPendingGroups] = useState([]);
  const [expandedPackageGroups, setExpandedPackageGroups] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const todayKey = new Date().toISOString().split('T')[0];
  const realAppointmentIds = useMemo(
    () => new Set(RAW_APPOINTMENTS.map((raw) => raw.appointment_id || `RAW-${raw.id}`)),
    []
  );

  const realAppointments = useMemo(() => {
    return appointments.filter((appointment) => realAppointmentIds.has(appointment.id));
  }, [appointments, realAppointmentIds]);

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

  const submitPendingAction = () => {
    const trimmedRemarks = remarks.trim();

    if (pendingAction?.isMandatory && !trimmedRemarks) {
      setRemarksError('Remarks are mandatory before rejecting.');
      return;
    }

    updateAppointmentStatus(pendingAction.appointmentId, pendingAction.status, trimmedRemarks);
    closeRemarksDialog();
  };

  const getSlaBucket = (appointment) => {
    const scheduledDateTime = new Date(appointment.date);
    const diffMinutes = (Date.now() - scheduledDateTime.getTime()) / (1000 * 60);

    if (diffMinutes <= 7) return 'green';
    if (diffMinutes <= 15) return 'amber';
    return 'red';
  };

  const isReportPendingAppointment = (appointment) => {
    const normalizedVendorStatus = (appointment.vendor_status || '').trim().toUpperCase();
    return normalizedVendorStatus === 'COMPLETED' || normalizedVendorStatus === 'PARTIALLY RECEIVED';
  };

  const dashboardStats = useMemo(() => {
    const todaysAppointments = realAppointments.filter((appointment) => appointment.date.startsWith(todayKey));
    const todaysConfirmedAppointments = todaysAppointments.filter(
      (appointment) => (appointment.vendor_status || '').trim().toUpperCase() === 'CONFIRMED'
    );
    const slaCandidates = todaysAppointments.filter(
      (appointment) => (appointment.vendor_status || '').trim().toUpperCase() === 'NEW'
    );

    const slaBuckets = slaCandidates.reduce(
      (accumulator, appointment) => {
        const scheduledDateTime = new Date(appointment.date);
        const diffMinutes = (Date.now() - scheduledDateTime.getTime()) / (1000 * 60);

        if (diffMinutes <= 7) {
          accumulator.green += 1;
        } else if (diffMinutes <= 15) {
          accumulator.amber += 1;
        } else {
          accumulator.red += 1;
        }

        return accumulator;
      },
      { green: 0, amber: 0, red: 0 }
    );

    return {
      appointmentsToday: todaysConfirmedAppointments.length,
      slaBreaches: slaBuckets.red + realAppointments.filter(isReportPendingAppointment).length,
      amber: slaBuckets.amber,
      green: slaBuckets.green,
    };
  }, [realAppointments, todayKey]);

  const filteredAppointments = useMemo(() => {
    const todaysAppointments = realAppointments.filter((appointment) => appointment.date.startsWith(todayKey));
    const todaysConfirmedAppointments = todaysAppointments.filter(
      (appointment) => (appointment.vendor_status || '').trim().toUpperCase() === 'CONFIRMED'
    );
    const todaysPendingAppointments = todaysAppointments.filter(
      (appointment) => (appointment.vendor_status || '').trim().toUpperCase() === 'NEW'
    );

    if (activeFilter === 'red') {
      return [
        ...todaysPendingAppointments.filter((appointment) => getSlaBucket(appointment) === 'red'),
        ...realAppointments.filter(isReportPendingAppointment),
      ];
    }
    if (activeFilter === 'amber') {
      return todaysPendingAppointments.filter((appointment) => getSlaBucket(appointment) === 'amber');
    }
    if (activeFilter === 'green') {
      return todaysPendingAppointments.filter((appointment) => getSlaBucket(appointment) === 'green');
    }

    return todaysConfirmedAppointments;
  }, [realAppointments, activeFilter, todayKey]);

  const filterHeadingMap = {
    today: "Today's Appointments",
    red: 'SLA Breaches',
    amber: 'Approaching SLA Appointments',
    green: 'Within SLA Appointments',
  };

  return (
    <div className="space-y-8 pb-10">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Appointments Today" 
          value={dashboardStats.appointmentsToday} 
          icon={Calendar} 
          colorClass="bg-blue-50" 
          iconColor="text-blue-600" 
          onClick={() => setActiveFilter('today')}
        />
        <KPICard 
          title="SLA Breaches" 
          value={dashboardStats.slaBreaches} 
          icon={AlertCircle} 
          colorClass="bg-red-50" 
          iconColor="text-red-500" 
          onClick={() => setActiveFilter('red')}
        />
        <KPICard 
          title="Approaching SLA" 
          value={dashboardStats.amber} 
          icon={Clock} 
          colorClass="bg-amber-50" 
          iconColor="text-amber-600" 
          onClick={() => setActiveFilter('amber')}
        />
        <KPICard 
          title="Within SLA" 
          value={dashboardStats.green} 
          icon={Circle} 
          colorClass="bg-green-50" 
          iconColor="text-green-600" 
          onClick={() => setActiveFilter('green')}
        />
      </div>

      <Card className="p-8 border-none shadow-sm rounded-xl bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{filterHeadingMap[activeFilter]}</h2>
            <p className="text-sm text-gray-500 mt-1">Cards act as dashboard filters and update the records below.</p>
          </div>
          <Badge status="confirmed" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest">
            {filteredAppointments.length} Records
          </Badge>
        </div>

        <div className="overflow-x-auto">
          {filteredAppointments.length > 0 ? (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-4 py-4">Date & Time</th>
                  <th className="px-4 py-4">Action</th>
                  <th className="px-4 py-4">Appointment ID</th>
                  <th className="px-4 py-4">Branch</th>
                  <th className="px-4 py-4">Dr. Name</th>
                  <th className="px-4 py-4">Time Since Creation</th>
                  <th className="px-4 py-4">Home Coll.</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">National ID</th>
                  <th className="px-4 py-4">Customer Details</th>
                  <th className="px-4 py-4">Package Name</th>
                  <th className="px-4 py-4">Collection Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAppointments.map((appointment) => {
                  const slaBucket = getSlaBucket(appointment);
                  const normalizedVendorStatus = (appointment.vendor_status || '').trim().toUpperCase();

                  return (
                    <tr key={appointment.id} className="hover:bg-blue-50/20 transition-colors text-xs font-medium text-gray-700">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{format(parseISO(appointment.date), 'dd MMM yyyy')}</span>
                          <span className="text-gray-400 text-[10px] mt-1">{format(parseISO(appointment.date), 'hh:mm a')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {normalizedVendorStatus === 'NEW' ? (
                            <>
                              <button
                                onClick={() => openRemarksDialog(appointment.id, 'confirmed', false)}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-sm shadow-green-100 transition-all active:scale-90"
                                title="Confirm"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openRemarksDialog(appointment.id, 'rejected', true)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm shadow-red-100 transition-all active:scale-90"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : normalizedVendorStatus === 'CONFIRMED' ? (
                            <>
                              <button
                                onClick={() => openRemarksDialog(appointment.id, 'completed', false)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95"
                                title="Completed"
                              >
                                <Check className="w-3.5 h-3.5" /> Completed
                              </button>
                              <button
                                onClick={() => openRemarksDialog(appointment.id, 'no-show', true)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
                                title="No Show"
                              >
                                <X className="w-3.5 h-3.5" /> No Show
                              </button>
                            </>
                          ) : appointment.status === 'partially_received' ? (
                            <button
                              onClick={() => openPendingReportsDialog(appointment)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                            >
                              <Info className="w-3.5 h-3.5" /> View Pending Reports
                            </button>
                          ) : appointment.status === 'completed' ? (
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload Reports
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload Reports
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-black text-blue-600 uppercase tracking-tighter">{appointment.id}</td>
                      <td className="px-4 py-4">{appointment.branch || 'Madhapur, Hyderabad'}</td>
                      <td className="px-4 py-4 text-gray-400">Dr. Vikram Singh</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black shadow-sm bg-gray-100 text-gray-700">
                          {appointment.timeSinceCreate || '0'} Hrs
                        </span>
                      </td>
                      <td className="px-4 py-4 font-black uppercase text-[10px]">
                        {appointment.home_collection ? 'YES' : 'NO'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Badge status={appointment.status} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest w-fit" />
                          {activeFilter !== 'today' && !isReportPendingAppointment(appointment) && (
                            <span
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                                slaBucket === 'green'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : slaBucket === 'amber'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {slaBucket === 'green' ? 'Within SLA' : slaBucket === 'amber' ? 'Approaching SLA' : 'Breached SLA'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400">--</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 uppercase">{appointment.customerName}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                              {appointment.age || 'NA'}, {appointment.gender || 'NA'}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{appointment.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openPackageInfoDialog(appointment)}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-black text-[10px] uppercase truncate max-w-[140px] block hover:bg-blue-100 transition-colors text-left"
                          title="View package info"
                        >
                          {appointment.package}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-gray-500 max-w-[220px] truncate">
                        {appointment.address && appointment.address !== ', ' ? appointment.address : '-------------------'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-gray-400">No matching records found</p>
            </div>
          )}
        </div>
      </Card>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                  {pendingAction.status === 'confirmed'
                    ? 'Confirm Appointment'
                    : pendingAction.status === 'completed'
                      ? 'Mark Appointment as Completed'
                      : pendingAction.status === 'no-show'
                        ? 'Mark Appointment as No Show'
                        : 'Reject Appointment'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {pendingAction.status === 'confirmed' || pendingAction.status === 'completed'
                    ? 'Add remarks if needed (optional)'
                    : pendingAction.status === 'no-show'
                      ? 'Remarks are mandatory before marking this appointment as no show'
                      : 'Remarks are mandatory before rejecting'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500">
                  Remarks {pendingAction.isMandatory ? '*' : '(Optional)'}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    if (remarksError) setRemarksError('');
                  }}
                  rows={4}
                  placeholder={
                    pendingAction.status === 'confirmed'
                      ? 'Add remarks if needed'
                      : pendingAction.status === 'completed'
                        ? 'Add completion remarks if needed'
                        : pendingAction.status === 'no-show'
                          ? 'Enter no show remarks'
                          : 'Enter rejection remarks'
                  }
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-700 outline-none transition-all resize-none ${
                    remarksError
                      ? 'border-red-300 focus:ring-4 focus:ring-red-500/10 focus:border-red-500'
                      : 'border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600'
                  }`}
                />
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
                <button
                  onClick={submitPendingAction}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all ${
                    pendingAction.status === 'confirmed' || pendingAction.status === 'completed'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {pendingAction.status === 'confirmed'
                    ? 'Confirm'
                    : pendingAction.status === 'completed'
                      ? 'Mark as Completed'
                      : pendingAction.status === 'no-show'
                        ? 'Mark as No Show'
                        : 'Reject'}
                </button>
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
