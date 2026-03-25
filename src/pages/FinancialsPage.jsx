import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Wallet, TrendingUp, Download, CheckCircle2, FileClock, Search, AlertCircle, PlusCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const MetricBox = ({ title, value, sub, icon: Icon, colorClass }) => (
  <Card className="relative overflow-hidden group border-none shadow-xl shadow-gray-200/50">
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        <p className={`text-[10px] font-black uppercase tracking-widest ${sub.includes('+') ? 'text-green-600' : 'text-gray-400'}`}>
           {sub}
        </p>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
  </Card>
);

export const FinancialsPage = () => {
  const { financials } = useAppContext();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Revenue & Settlement</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg italic">Track fulfillments, proforma generations, and payment status.</p>
        </div>
        <button className="btn btn-primary px-8 py-3 rounded-2xl shadow-xl shadow-brand-100 font-black uppercase tracking-widest text-xs group">
           <PlusCircle className="w-4 h-4 group-hover:scale-110" /> Submit New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricBox title="Total Realized Revenue" value={`₹${financials.totalRevenue.toLocaleString()}`} sub="+12.4% vs last month" icon={Wallet} colorClass="bg-brand-600" />
        <MetricBox title="Outstanding Payments" value={`₹${financials.outstanding.toLocaleString()}`} sub="Current Cycle" icon={FileClock} colorClass="bg-amber-500" />
        <MetricBox title="Total Volume Sent" value={financials.totalVolume} sub="Completed Fulfillment" icon={TrendingUp} colorClass="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Invoice Tracking</h2>
            <div className="flex gap-4">
               <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                 <input type="text" placeholder="Search Invoice ID" className="pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl outline-none focus:bg-white focus:border-brand-200 transition-all" />
               </div>
            </div>
          </div>
          
          <Card className="p-0 border-none shadow-2xl shadow-gray-200/40 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5">Invoice ID / Type</th>
                  <th className="px-8 py-5">Submission Date</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {financials.invoices.map((inv, idx) => (
                  <tr key={inv.id} className="group hover:bg-gray-50 transition-all cursor-pointer">
                    <td className="px-8 py-5">
                       <span className="font-black text-xs text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{inv.id}</span>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{inv.type}</p>
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-gray-700 uppercase">{format(parseISO(inv.date), 'MMM dd, yyyy')}</td>
                    <td className="px-8 py-5 font-black text-xs text-gray-900">₹{inv.amount.toLocaleString()}</td>
                    <td className="px-8 py-5">
                       <Badge status={inv.status === 'paid' ? 'completed' : inv.status === 'approved' ? 'confirmed' : 'new'} className="uppercase text-[9px] font-black tracking-widest px-3">
                          {inv.status}
                       </Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Download className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase px-1">Remittance Note</h2>
           <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Next Payment Cycle</p>
                      <h4 className="text-2xl font-black mt-2">15 APR 2026</h4>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                       <Wallet className="w-6 h-6 text-brand-400" />
                    </div>
                 </div>
                 
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center font-black text-xs">✓</div>
                       <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">KYC Status</p>
                          <p className="text-xs font-bold mt-1 text-white uppercase tracking-tight">Verified & Active</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-black text-xs">!</div>
                       <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Pending Tax Docs</p>
                          <p className="text-xs font-bold mt-1 text-white uppercase tracking-tight">1 Document Missing</p>
                       </div>
                    </div>
                 </div>
                 
                 <button className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Generate Proforma Report
                 </button>
              </div>
           </Card>
           
           <Card className="p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 group hover:bg-white hover:border-brand-200 transition-all cursor-pointer">
              <div className="flex items-center gap-4 text-gray-400 group-hover:text-brand-600">
                 <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform"><AlertCircle className="w-5 h-5" /></div>
                 <p className="text-xs font-black uppercase tracking-widest">Financial Dispute Support</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
