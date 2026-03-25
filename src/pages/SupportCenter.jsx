import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  PlayCircle, 
  ChevronRight,
  User,
  ExternalLink,
  HelpCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const EscalationLevel = ({ level, title, description, colorClass }) => (
  <div className="flex gap-4 relative pb-8 last:pb-0">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${colorClass} shrink-0 mt-1.5 z-10`} />
      <div className="w-0.5 h-full bg-blue-100 last:hidden absolute top-4 left-[5.5px]" />
    </div>
    <div>
      <p className="font-bold text-gray-900 leading-none mb-1">{level}: {title}</p>
      <p className="text-xs text-gray-400 font-medium">{description}</p>
    </div>
  </div>
);

export const SupportCenter = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Card - Relationship Manager */}
        <Card className="p-10 border-none shadow-sm h-full bg-white rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner border-2 border-white">
                AK
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Arjun Kumar</h2>
                <p className="text-sm font-bold text-gray-400 mt-1">Your Dedicated Relationship Manager</p>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-gray-600 font-bold group-hover:text-gray-900">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-gray-600 font-bold group-hover:text-gray-900">arjun.kumar@ekincare.com</p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="p-2 text-green-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <p className="text-green-600 font-black">Available on WhatsApp</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-12 border-t border-gray-50/50">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95">
               <MessageCircle className="w-5 h-5" /> Chat Now
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95">
               <Mail className="w-5 h-5" /> Email
            </button>
          </div>
        </Card>

        {/* Right Columns */}
        <div className="space-y-8 flex flex-col h-full">
          {/* Escalation Matrix */}
          <Card className="p-10 border-none shadow-sm bg-white rounded-2xl flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-10">Escalation Matrix</h3>
            <div className="space-y-0">
               <EscalationLevel 
                  level="Level 1" 
                  title="Relationship Manager" 
                  description="First point of contact (Arjun Kumar)" 
                  colorClass="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
               />
               <EscalationLevel 
                  level="Level 2" 
                  title="Regional Head" 
                  description="Escalate if unresolved in 24 hours" 
                  colorClass="bg-amber-400" 
               />
               <EscalationLevel 
                  level="Level 3" 
                  title="Ops Head" 
                  description="Critical escalations and unresolved SLA breaches" 
                  colorClass="bg-red-500" 
               />
            </div>
          </Card>

          {/* Tutorial Card */}
          <Card className="p-10 border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl relative overflow-hidden group">
            <div className="relative z-10 max-w-[70%]">
              <h3 className="text-2xl font-black text-white leading-tight mb-4">New to the Dashboard?</h3>
              <p className="text-sm font-bold text-blue-100/90 leading-relaxed mb-8 uppercase tracking-wide">
                Learn how to manage appointments, upload reports, and submit invoices efficiently.
              </p>
              <button className="flex items-center gap-3 px-6 py-4 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-black/20 group active:scale-95">
                 <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> Watch Tutorials
              </button>
            </div>
            
            {/* Play Button Watermark */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700 pointer-events-none">
               <PlayCircle className="w-64 h-64 text-white" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
