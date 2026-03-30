import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { RAW_APPOINTMENTS } from '../data/realAppointments';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { 
  Calendar, 
  Upload, 
  AlertCircle, 
  Circle,
  Clock,
  Check,
  X,
} from 'lucide-react';
import { format, parse, parseISO } from 'date-fns';

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
  const { updateAppointmentStatus } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('today');
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const todayKey = new Date().toISOString().split('T')[0];

  const realAppointments = useMemo(() => {
    return RAW_APPOINTMENTS.map((raw) => {
      let isoDate = new Date().toISOString();
      try {
        if (raw.appointment_date && raw.appointment_time) {
          const dateStr = `${raw.appointment_date} ${raw.appointment_time}`;
          isoDate = parse(dateStr, 'yyyy-MM-dd hh:mm a', new Date()).toISOString();
        }
      } catch {
        console.warn('Failed to parse dashboard date for', raw.appointment_id);
      }

      const ageGender = raw.age_and_gender?.split(',') || ['NA', 'NA'];

      return {
        id: raw.appointment_id || `RAW-${raw.id}`,
        customerName: raw.name,
        phone: raw.mobile_number,
        date: isoDate,
        package: raw.package_name?.[0] || 'Standard Package',
        status: (raw.vendor_status || 'NEW').trim().toLowerCase().replace(/\s+/g, '_'),
        vendor_status: (raw.vendor_status || 'NEW').trim().toUpperCase(),
        branch: raw.branch || 'Madhapur, Hyderabad',
        age: ageGender[0]?.trim(),
        gender: ageGender[1]?.trim(),
        home_collection: !!raw.home_collection,
        address: raw.home_address,
        timeSinceCreate: raw.time_since_create,
      };
    });
  }, []);

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

  const dashboardStats = useMemo(() => {
    const todaysAppointments = realAppointments.filter((appointment) => appointment.date.startsWith(todayKey));
    const slaCandidates = todaysAppointments;

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
      appointmentsToday: todaysAppointments.length,
      reportsPending: realAppointments.filter((appointment) => appointment.status === 'completed').length,
      slaBreaches: slaBuckets.red,
      amber: slaBuckets.amber,
      green: slaBuckets.green,
    };
  }, [realAppointments, todayKey]);

  const filteredAppointments = useMemo(() => {
    const todaysAppointments = realAppointments.filter((appointment) => appointment.date.startsWith(todayKey));

    if (activeFilter === 'reports') {
      return realAppointments.filter((appointment) => appointment.status === 'completed');
    }
    if (activeFilter === 'red') {
      return todaysAppointments.filter((appointment) => getSlaBucket(appointment) === 'red');
    }
    if (activeFilter === 'amber') {
      return todaysAppointments.filter((appointment) => getSlaBucket(appointment) === 'amber');
    }
    if (activeFilter === 'green') {
      return todaysAppointments.filter((appointment) => getSlaBucket(appointment) === 'green');
    }

    return todaysAppointments;
  }, [realAppointments, activeFilter, todayKey]);

  const filterHeadingMap = {
    today: "Today's Appointments",
    reports: 'Reports Pending',
    red: 'Breached SLA Appointments',
    amber: 'Approaching SLA Appointments',
    green: 'Within SLA Appointments',
  };

  return (
    <div className="space-y-8 pb-10">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <KPICard 
          title="Appointments Today" 
          value={dashboardStats.appointmentsToday} 
          icon={Calendar} 
          colorClass="bg-blue-50" 
          iconColor="text-blue-600" 
          onClick={() => setActiveFilter('today')}
        />
        <KPICard 
          title="Reports Pending" 
          value={dashboardStats.reportsPending} 
          icon={Upload} 
          colorClass="bg-amber-50" 
          iconColor="text-amber-500" 
          onClick={() => setActiveFilter('reports')}
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
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95"
                                title="Completed"
                              >
                                <Check className="w-3.5 h-3.5" /> Completed
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'no-show')}
                                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
                                title="No Show"
                              >
                                <X className="w-3.5 h-3.5" /> No Show
                              </button>
                            </>
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
                          {activeFilter !== 'reports' && (
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
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-black text-[10px] uppercase truncate max-w-[140px] block">
                          {appointment.package}
                        </span>
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
                  {pendingAction.status === 'confirmed' ? 'Confirm Appointment' : 'Reject Appointment'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {pendingAction.status === 'confirmed' ? 'Add remarks if needed (optional)' : 'Remarks are mandatory before rejecting'}
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
                  placeholder={pendingAction.status === 'confirmed' ? 'Add remarks if needed' : 'Enter rejection remarks'}
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
                    pendingAction.status === 'confirmed'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {pendingAction.status === 'confirmed' ? 'Confirm' : 'Reject'}
                </button>
              </div>
            </div>
          </Card>
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
