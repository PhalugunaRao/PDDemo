import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Save, 
  Lock, 
  CheckCircle2,
  Calendar,
  Settings,
  Bell,
  CreditCard,
  Building
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export const ProfilePage = () => {
  const { profile, updateProfile } = useAppContext();
  const [formData, setFormData] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const menuItems = [
    { id: 'profile', label: 'Public Profile', icon: User },
    { id: 'security', label: 'Security Settings', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Settings & Account</h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">Manage your clinical profile, security protocols, and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <Card className="p-4 bg-gray-50/50 border-none shadow-none rounded-3xl">
             {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group ${
                    item.id === 'profile' ? 'bg-white text-brand-600 shadow-xl shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${item.id === 'profile' ? 'text-brand-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
             ))}
          </Card>

          <Card className="p-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-none rounded-3xl relative overflow-hidden group">
             <div className="relative z-10">
                <ShieldCheck className="w-10 h-10 mb-4 text-brand-100 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black uppercase tracking-tight">Security Verified</h3>
                <p className="text-xs text-brand-100/80 font-bold mt-2 leading-relaxed uppercase tracking-wider">Your account is secured with RSA-2048 encryption and 2FA authentication protocol.</p>
             </div>
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </Card>
        </div>

        {/* Content Area */}
        <div className="xl:col-span-3 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Profile Avatar Section */}
            <Card className="p-10 border-none shadow-2xl shadow-gray-200/40 rounded-3xl relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30">
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-3xl bg-brand-100 border-[6px] border-white shadow-2xl flex items-center justify-center text-4xl font-black text-brand-600 relative overflow-hidden">
                       <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <button className="absolute -bottom-4 -right-4 p-4 bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-200 border-4 border-white group-hover:scale-110 transition-all">
                       <Camera className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{profile.name}</h2>
                     <p className="text-brand-600 font-bold mt-1 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                        {profile.role}
                        <CheckCircle2 className="w-4 h-4 fill-brand-600 text-white" />
                     </p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-200 shadow-sm">
                           <Building className="w-4 h-4" />
                           {profile.branch}
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-200 shadow-sm">
                           <Clock className="w-4 h-4" />
                           {profile.timings}
                        </div>
                     </div>
                  </div>
                  <div className="md:ml-auto">
                    {!isEditing ? (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 rounded-2xl border-gray-200 font-black uppercase tracking-widest"
                      >
                         Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 rounded-2xl text-red-500 font-black uppercase tracking-widest"
                        >
                           Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="px-8 py-3 rounded-2xl shadow-xl shadow-brand-100 font-black uppercase tracking-widest"
                          icon={Save}
                        >
                           Save Protocol
                        </Button>
                      </div>
                    )}
                  </div>
               </div>
               
               {/* Background detail */}
               <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-100/10 -skew-x-12 translate-x-1/2 pointer-events-none" />
            </Card>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] px-2 flex items-center justify-between">
                     Identity Information
                     <User className="w-4 h-4" />
                  </h4>
                  <Card className="p-8 border-none shadow-xl shadow-gray-200/30 rounded-3xl space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 px-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-70 disabled:grayscale transition-all duration-300"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Terminal</label>
                        <input 
                          type="email" 
                          disabled={!isEditing}
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 px-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-70 disabled:grayscale transition-all duration-300"
                        />
                     </div>
                  </Card>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] px-2 flex items-center justify-between">
                     Professional Details
                     <Building className="w-4 h-4" />
                  </h4>
                  <Card className="p-8 border-none shadow-xl shadow-gray-200/30 rounded-3xl space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Active Branch</label>
                        <select 
                          disabled={!isEditing}
                          value={formData.branch}
                          onChange={(e) => setFormData({...formData, branch: e.target.value})}
                          className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 px-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-70 disabled:grayscale transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhYWFhYWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-[length:20px_20px] bg-[right_1.25rem_center] bg-no-repeat"
                        >
                          <option>Central Clinic</option>
                          <option>Westside Diagnostic</option>
                          <option>East Metro Hub</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operation Hours</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.timings}
                          onChange={(e) => setFormData({...formData, timings: e.target.value})}
                          className="w-full bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 px-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-70 disabled:grayscale transition-all duration-300"
                        />
                     </div>
                  </Card>
               </div>
            </div>
          </form>

          {/* Additional Features Card */}
          <Card className="p-0 border-none shadow-2xl shadow-gray-200/40 rounded-3xl overflow-hidden group">
             <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-8 hover:bg-gray-50/50 transition-colors cursor-pointer group/item flex flex-col items-center text-center">
                   <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all shadow-lg shadow-brand-100/30">
                      <Settings className="w-6 h-6" />
                   </div>
                   <h5 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Interface</h5>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Configure visual preferences and dark mode protocol.</p>
                </div>
                <div className="p-8 hover:bg-gray-50/50 transition-colors cursor-pointer group/item flex flex-col items-center text-center">
                   <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all shadow-lg shadow-green-100/30">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <h5 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Availability</h5>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Manage system-wide appointment slots and holidays.</p>
                </div>
                <div className="p-8 hover:bg-gray-50/50 transition-colors cursor-pointer group/item flex flex-col items-center text-center">
                   <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all shadow-lg shadow-amber-100/30">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <h5 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Certification</h5>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Update clinical licenses and medical certifications.</p>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
