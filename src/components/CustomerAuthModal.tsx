import React, { useState } from 'react';
import { X, Lock, Phone, User, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { CustomerUser } from '../types';
import { registerCustomerInSupabase, loginCustomerFromSupabase } from '../lib/supabase';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: CustomerUser | null;
  onAuthSuccess: (user: CustomerUser, message?: string) => void;
  initialMode?: 'login' | 'register';
  purposeMessage?: string;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  initialMode = 'login',
  purposeMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (Full Name, Phone Number, Password)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = loginPhone.trim();
    const cleanPass = loginPassword.trim();

    if (!cleanPhone) {
      setErrorMessage('অনুগ্রহ করে আপনার মোবাইল নম্বর দিন (Please enter your Phone Number).');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('অনুগ্রহ করে আপনার পাসওয়ার্ড দিন (Please enter your Password).');
      return;
    }

    setLoading(true);
    try {
      const res = await loginCustomerFromSupabase(cleanPhone, cleanPass);
      if (res.success && res.user) {
        onAuthSuccess(res.user, `স্বাগতম, ${res.user.name}! লগইন সফল হয়েছে।`);
        onClose();
      } else {
        setErrorMessage(res.error || 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'লগইন ব্যর্থ হয়েছে। সংযোগ পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = regName.trim();
    const cleanPhone = regPhone.trim();
    const cleanPass = regPassword.trim();

    if (!cleanName) {
      setErrorMessage('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন (Please enter your Full Name).');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage('অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে (Minimum 4 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomerInSupabase({
        name: cleanName,
        phoneNumber: cleanPhone,
        password: cleanPass,
      });

      if (res.success && res.user) {
        onAuthSuccess(res.user, `অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম, ${res.user.name}।`);
        onClose();
      } else {
        setErrorMessage(res.error || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'রেজিস্ট্রেশন ত্রুটি। আপনার তথ্য পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="customer-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-[#ede8e4] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2b1420] via-[#502d3f] to-[#745663] text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#fcd4e4]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#fcd4e4]">
              আয়েশা কটন বুটিক • Ayesha Cotton
            </span>
          </div>

          <h2 className="font-playfair text-xl sm:text-2xl font-bold">
            {mode === 'login' ? 'লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </h2>

          <p className="text-[11px] sm:text-xs text-white/85 mt-1 leading-relaxed">
            {purposeMessage || (mode === 'login'
              ? 'মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করে সহজেই অর্ডার ও ট্র্যাকিং করুন'
              : 'দ্রুত অর্ডার প্লেস ও স্পেশাল অফার পেতে আপনার অ্যাকাউন্ট খুলুন')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#f6f4f2] border-b border-[#ede8e4] text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-xs ${
              mode === 'login'
                ? 'bg-white text-[#745663] shadow-xs'
                : 'text-[#53434b] hover:text-[#1b1c1c]'
            }`}
          >
            <span>লগইন</span>
            <span className="text-[10px] opacity-75">(Sign In)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-xs ${
              mode === 'register'
                ? 'bg-white text-[#745663] shadow-xs'
                : 'text-[#53434b] hover:text-[#1b1c1c]'
            }`}
          >
            <span>রেজিস্ট্রেশন</span>
            <span className="text-[10px] opacity-75">(Sign Up)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4">
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <span className="font-bold shrink-0">⚠️</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  মোবাইল নম্বর অথবা ইমেইল <span className="text-[11px] text-[#745663] font-normal">(Phone or Email)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="017XXXXXXXX অথবা abranjoy2@gmail.com"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors tracking-wide"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  পাসওয়ার্ড <span className="text-[11px] text-[#745663] font-normal">(Password)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড দিন"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8f8287] hover:text-[#1b1c1c] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#8f8287]" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#745663] hover:bg-[#5c434e] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>লগইন হচ্ছে... (Signing In)</span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#53434b]">
                  আপনার কি কোনো অ্যাকাউন্ট নেই?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-[#745663] font-bold hover:underline cursor-pointer ml-1"
                  >
                    নতুন অ্যাকাউন্ট খুলুন
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ================= REGISTRATION FORM (Full Name + Phone + Password) ================= */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  পূর্ণ নাম <span className="text-[11px] text-[#745663] font-normal">(Full Name)</span> <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="যেমন: আয়শা রহমান"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  মোবাইল নম্বর <span className="text-[11px] text-[#745663] font-normal">(Phone Number)</span> <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors font-mono tracking-wide"
                  />
                </div>
                <p className="text-[10px] text-[#8f8287] mt-1">
                  এই মোবাইল নম্বরটিই আপনার লগইন আইডি হিসেবে ব্যবহৃত হবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  পাসওয়ার্ড তৈরি করুন <span className="text-[11px] text-[#745663] font-normal">(Password)</span> <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8f8287] hover:text-[#1b1c1c] cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#8f8287]" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#f7f5f3] rounded-xl border border-[#ede8e4] text-[11px] text-[#53434b] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ইমেইল ছাড়া মাত্র ৩টি তথ্যে চোখের পলকে অ্যাকাউন্ট খুলুন!</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#745663] hover:bg-[#5c434e] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                ) : (
                  <>
                    <span>অ্যাকাউন্ট তৈরি করুন (Create Account)</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-[#53434b]">
                  ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-[#745663] font-bold hover:underline cursor-pointer ml-1"
                  >
                    মোবাইল নম্বর দিয়ে লগইন করুন
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
