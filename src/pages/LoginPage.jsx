import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@provider.com');
  const [password, setPassword] = useState('mediSync@demo2025');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 -z-1" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 -z-1" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10 group">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-200"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">MediSync Portal</h2>
          <p className="mt-3 text-gray-500 font-medium">Log in to manage your clinical appointments</p>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-gray-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="mt-8 pt-8 border-t border-gray-100/50 text-center">
            <p className="text-gray-500 text-sm">Demo credentials (auto-filled)</p>
            <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-brand-50/50 rounded-xl border border-brand-100 uppercase tracking-widest text-[9px] font-black text-brand-700">
               admin@provider.com / mediSync@demo2025
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-brand-50/50 rounded-xl border border-brand-100">
              <AlertCircle className="w-4 h-4 text-brand-600" />
              <p className="text-xs font-bold text-brand-700 uppercase tracking-widest leading-none">Testing Environment Active</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
