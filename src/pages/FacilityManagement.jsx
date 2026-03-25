import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Building2, MapPin, Clock, ShieldCheck, Camera, Save, Lock, CheckCircle2, Calendar, FileText, Settings, Settings2, Trash2, Plus, Info, ChevronRight, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FacilityManagement = () => {
  const { facility, updateFacility } = useAppContext();
  const [formData, setFormData] = useState({ ...facility });
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Basic Profile', icon: Building2 },
    { id: 'slots', label: 'Slot Capacity', icon: Calendar },
    { id: 'inventory', label: 'Services Inventory', icon: Briefcase },
    { id: 'compliance', label: 'Compliance & KYC', icon: ShieldCheck },
  ];

  const handleSave = () => {
    updateFacility(formData);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase px-1 underline decoration-brand-100 underline-offset-8">Facility Protocol</h1>
          <p className="text-gray-500 mt-4 font-medium text-lg italic">Self-serve management of infrastructure, operational hours, and service inventory.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 hover:border-brand-100 transition-all shadow-sm group">
              <Settings2 className="w-4 h-4" /> Global Settings
           </button>
           <button 
             onClick={handleSave}
             className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 shadow-xl shadow-brand-100 transition-all active:scale-95 group"
           >
              <Save className="w-4 h-4 group-hover:scale-110" /> Sync Changes
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-1 space-y-4">
           <Card className="p-4 bg-gray-50/50 border-none shadow-none rounded-[2rem]">
              {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                     activeTab === tab.id ? 'bg-white text-brand-600 shadow-xl shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                   }`}
                 >
                   <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-brand-600' : 'text-gray-400'}`} />
                   {tab.label}
                 </button>
              ))}
           </Card>

           <Card className="p-8 bg-brand-50 border-2 border-dashed border-brand-200 rounded-[2rem] text-center space-y-4 group cursor-pointer hover:bg-brand-100/50 transition-all">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform">
                 <Camera className="w-8 h-8 text-brand-600" />
              </div>
              <p className="text-[10px] font-black text-brand-700 uppercase tracking-widest leading-none">Update Facility Photo</p>
           </Card>
        </div>

        <div className="xl:col-span-3">
           <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                   <Card className="p-10 border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] bg-white relative overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Name of Center</label>
                            <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-gray-50/50 border-gray-100 hover:bg-white hover:border-brand-200 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500/50 px-6 py-4 rounded-2xl text-sm font-bold transition-all outline-none"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Hours Protocol</label>
                            <input 
                              type="text" 
                              value={formData.operationalHours}
                              onChange={(e) => setFormData({...formData, operationalHours: e.target.value})}
                              className="w-full bg-gray-50/50 border-gray-100 hover:bg-white hover:border-brand-200 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500/50 px-6 py-4 rounded-2xl text-sm font-bold transition-all outline-none"
                            />
                         </div>
                         <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geolocation & Address Tracking</label>
                            <div className="relative group">
                               <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
                               <input 
                                 type="text" 
                                 value={formData.address}
                                 onChange={(e) => setFormData({...formData, address: e.target.value})}
                                 className="w-full bg-gray-50/50 border-gray-100 hover:bg-white hover:border-brand-200 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500/50 pl-14 pr-6 py-4 rounded-2xl text-sm font-bold transition-all outline-none"
                               />
                            </div>
                         </div>
                      </div>
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/5 -skew-x-12 translate-x-1/2 -z-0 pointer-events-none" />
                   </Card>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="p-8 border-none shadow-xl shadow-gray-200/30 rounded-3xl bg-gray-900 text-white relative flex items-center justify-between group">
                         <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">KYC STATUS</p>
                            <h4 className="text-2xl font-black uppercase tracking-tight">{facility.kycStatus}</h4>
                            <p className="text-brand-400 text-[10px] font-black mt-2 uppercase tracking-widest flex items-center gap-2">
                               <ShieldCheck className="w-4 h-4" /> EK DISPATCH READY
                            </p>
                         </div>
                         <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                         </div>
                         <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                      </Card>
                      
                      <Card className="p-8 border-none shadow-xl shadow-gray-200/30 rounded-3xl bg-white flex flex-col justify-between group">
                         <div className="flex justify-between items-start">
                           <div>
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Holiday Calendar</p>
                              <h4 className="text-xl font-black text-gray-900 mt-2 uppercase tracking-tight">Active Policy</h4>
                           </div>
                           <button className="p-3 text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Plus className="w-5 h-5" /></button>
                         </div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Next Closure: 15 AUG (Independence Day)</p>
                      </Card>
                   </div>
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div 
                  key="inventory"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between px-2 mb-4">
                     <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Service Catalog</h3>
                     <div className="flex gap-4">
                        <div className="relative group">
                          <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="Add Service Item" className="pl-11 pr-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-300 transition-all shadow-sm" />
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facility.inventory.map((item, idx) => (
                      <Card key={idx} className={`p-6 border-2 transition-all rounded-3xl flex items-center justify-between group ${item.enabled ? 'border-brand-50 bg-white hover:border-brand-200 hover:shadow-xl' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${item.enabled ? 'bg-brand-50 text-brand-600' : 'bg-gray-200 text-gray-400'}`}>
                               <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.name}</p>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">EK STANDARD SKU</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <button className={`p-3 rounded-xl transition-all ${item.enabled ? 'text-brand-600 hover:bg-brand-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                              <Settings className="w-5 h-5" />
                           </button>
                           <button className={`p-3 rounded-xl transition-all ${item.enabled ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                              <Trash2 className="w-5 h-5" />
                           </button>
                         </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-brand-50/50 rounded-3xl border border-brand-100 flex items-start gap-4">
                     <Info className="w-6 h-6 text-brand-600 shrink-0" />
                     <p className="text-xs font-bold text-brand-800 uppercase tracking-wide leading-relaxed">
                        Inventory changes are synced with the ekincare search engine in real-time. disabling services will immediately stop new bookings for those items.
                     </p>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
