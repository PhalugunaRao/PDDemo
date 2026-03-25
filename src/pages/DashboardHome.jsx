import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Calendar, 
  Upload, 
  AlertCircle, 
  DollarSign, 
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon, colorClass, iconColor }) => (
  <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl">
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

const ActionItem = ({ icon: Icon, title, subtitle, color, statusIcon: StatusIcon }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group cursor-pointer hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${color}`}>
        <StatusIcon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 leading-tight">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
    <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
      Action <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export const DashboardHome = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Appointments Today" 
          value="42" 
          icon={Calendar} 
          colorClass="bg-blue-50" 
          iconColor="text-blue-600" 
        />
        <KPICard 
          title="Reports Pending" 
          value="15" 
          icon={Upload} 
          colorClass="bg-amber-50" 
          iconColor="text-amber-500" 
        />
        <KPICard 
          title="SLA Breaches" 
          value="3" 
          icon={AlertCircle} 
          colorClass="bg-red-50" 
          iconColor="text-red-500" 
        />
        <KPICard 
          title="Total Revenue (MTD)" 
          value="₹4,25,000" 
          icon={DollarSign} 
          colorClass="bg-green-50" 
          iconColor="text-green-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Needs Immediate Action Panel */}
        <div className="lg:col-span-2">
          <Card className="p-8 border-none shadow-sm h-full rounded-xl bg-white">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Needs Immediate Action</h2>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                4 Pending
              </span>
            </div>
            <div className="space-y-2">
              <ActionItem 
                title="Upload Lab Report - Amit Sharma" 
                subtitle="2 hours overdue" 
                color="border-red-100 bg-red-50 text-red-500" 
                statusIcon={AlertCircle}
              />
              <ActionItem 
                title="Accept Booking - Sunita Rao (Full Body Check)" 
                subtitle="15 mins ago" 
                color="border-amber-100 bg-amber-50 text-amber-500" 
                statusIcon={Clock}
              />
              <ActionItem 
                title="Upload Lab Report - Kiran Desai" 
                subtitle="Due in 1 hour" 
                color="border-blue-100 bg-blue-50 text-blue-500" 
                statusIcon={CheckCircle2}
              />
              <ActionItem 
                title="Respond to RFQ #8829 - Q3 Corporate Tie-up" 
                subtitle="Due tomorrow" 
                color="border-blue-100 bg-blue-50 text-blue-500" 
                statusIcon={FileText}
              />
            </div>
          </Card>
        </div>

        {/* SLA Compliance Card */}
        <div>
          <Card className="p-8 border-none shadow-sm h-full rounded-xl bg-white border-l-4 border-l-blue-600">
            <h2 className="text-xl font-bold text-gray-900">SLA Compliance Rate</h2>
            <p className="text-gray-500 text-sm mt-1">Target: 95% reports uploaded within TAT.</p>
            
            <div className="mt-8 mb-4">
              <h3 className="text-6xl font-black text-blue-600 tracking-tighter flex items-end gap-1">
                88<span className="text-4xl pb-2">%</span>
              </h3>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '88%' }}></div>
            </div>

            <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-8">
              Currently 7% below ekincare baseline target.
            </p>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-blue-900 text-sm font-semibold leading-snug">
                Watch out for 3 SLA breached appointments today.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
