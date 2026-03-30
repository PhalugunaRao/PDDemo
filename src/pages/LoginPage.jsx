import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Building2,
  Globe2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@provider.com');
  const [password, setPassword] = useState('mediSync@demo2025');
  const [loginType, setLoginType] = useState('PAN_INDIA');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password, { login_type: loginType });
      if (success) {
        navigate('/dashboard');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen bg-[#f3f7fb] relative overflow-hidden p-4 md:px-8 md:py-4">
      <div className="absolute inset-y-0 right-0 w-[42%] bg-gradient-to-b from-[#d9f1ff] via-[#f6fbff] to-white" />
      <div className="absolute top-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#9ed8ff]/35 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] h-[280px] w-[280px] rounded-full bg-brand-200/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto grid h-full max-h-[calc(100vh-2rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-2xl shadow-sky-100/60 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="hidden xl:flex flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#0b5cab_0%,#1d7cd8_55%,#8fd2ff_100%)] p-10 text-white">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
                <ShieldCheck className="h-9 w-9" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">Care Lynk Style Access</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight">ekincare Partner Desk</h1>
              </div>
            </div>
            <p className="mt-10 max-w-md text-base font-medium leading-7 text-white/85">
              Manage pan India and branch operations from one secure provider workspace with the same trusted login flow.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70">Why This Login</p>
              <p className="mt-3 text-lg font-bold">Switch between Pan India and Branch level access without changing your credentials.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Pan India</p>
                <p className="mt-2 text-sm font-bold">Centralized visibility across operations.</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Branch Level</p>
                <p className="mt-2 text-sm font-bold">Location-specific control for daily teams.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center overflow-y-auto p-6 sm:p-8 xl:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6 xl:hidden">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-xl shadow-brand-100">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-600">Provider Access</p>
                  <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-900">ekincare Partner Desk</h2>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-brand-600">Welcome Back</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">Sign in to continue</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                Choose your access level and continue with the same provider credentials.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-3xl bg-gray-100 p-2">
              <button
                type="button"
                onClick={() => setLoginType('PAN_INDIA')}
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-[0.24em] transition-all ${
                  loginType === 'PAN_INDIA' ? 'bg-white text-brand-600 shadow-md' : 'text-gray-500'
                }`}
              >
                <Globe2 className="h-4 w-4" /> Pan India
              </button>
              <button
                type="button"
                onClick={() => setLoginType('BRANCH')}
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-[0.24em] transition-all ${
                  loginType === 'BRANCH' ? 'bg-white text-brand-600 shadow-md' : 'text-gray-500'
                }`}
              >
                <Building2 className="h-4 w-4" /> Branch Level
              </button>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-sky-100/40 sm:p-7">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-brand-600 text-gray-400 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-11 py-3.5 bg-gray-50/50 border-gray-100 hover:bg-white hover:border-gray-200"
                      placeholder="admin@provider.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-brand-600 text-gray-400 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-11 py-3.5 bg-gray-50/50 border-gray-100 hover:bg-white hover:border-gray-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">Selected Login Type</p>
                  <p className="mt-1 text-sm font-bold text-blue-900">{loginType === 'PAN_INDIA' ? 'Pan India Login' : 'Branch Level Login'}</p>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded-md cursor-pointer" />
                    <label htmlFor="remember" className="ml-2 block text-gray-600 font-medium cursor-pointer">Remember me</label>
                  </div>
                  <a href="#" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">Forgot Password?</a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg font-bold rounded-2xl group shadow-brand-100 shadow-xl overflow-hidden"
                  loading={loading}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
