import React, { useState } from 'react';
import { X, Lock, Phone, Mail, User, MapPin, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
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
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Dhaka');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = loginIdentifier.trim();
    const cleanPass = loginPassword.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your Phone Number or Email.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginCustomerFromSupabase(cleanId, cleanPass);
      if (res.success && res.user) {
        onAuthSuccess(res.user, `Welcome back, ${res.user.name}!`);
        onClose();
      } else {
        setErrorMessage(res.error || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPhone = regPhone.trim();
    const cleanAddress = regAddress.trim();
    const cleanPass = regPassword.trim();

    if (!cleanName) {
      setErrorMessage('Please provide your Full Name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please provide a valid Email Address.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid Phone Number (e.g. 017XXXXXXXX).');
      return;
    }
    if (!cleanAddress) {
      setErrorMessage('Please provide your complete Delivery Address.');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomerInSupabase({
        name: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        address: cleanAddress,
        city: regCity,
        password: cleanPass,
      });

      if (res.success && res.user) {
        onAuthSuccess(res.user, `Account created successfully! Welcome, ${res.user.name}.`);
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration error. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="customer-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#ede8e4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2b1420] to-[#745663] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#fcd4e4]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#fcd4e4]">
              Ayesha Cotton Boutique
            </span>
          </div>

          <h2 className="font-playfair text-2xl font-bold">
            {mode === 'login' ? 'Customer Sign In' : 'Customer Registration'}
          </h2>

          <p className="text-xs text-white/80 mt-1">
            {purposeMessage || (mode === 'login'
              ? 'Sign in with your phone & password to place orders and track delivery'
              : 'Create your account for fast ordering, order tracking, and member offers')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-[#f6f4f2] border-b border-[#ede8e4] text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#745663] shadow-xs'
                : 'text-[#53434b] hover:text-[#1b1c1c]'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#745663] shadow-xs'
                : 'text-[#53434b] hover:text-[#1b1c1c]'
            }`}
          >
            Register (New Account)
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  Phone Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="017XXXXXXXX or your@email.com"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8f8287] hover:text-[#1b1c1c] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#745663] hover:bg-[#5c434e] text-white font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#53434b]">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-[#745663] font-bold hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </div>

              {/* Admin Note Box */}
              <div className="mt-4 p-3 bg-[#fcfbfa] border border-[#ede8e4] rounded-xl text-[11px] text-[#53434b] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#1b1c1c]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#745663]" />
                  <span>Admin Access Note:</span>
                </div>
                <p>
                  To manage products and orders, log in with administrator email: <strong className="text-[#745663]">abranjoy2@gmail.com</strong>
                </p>
              </div>
            </form>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. ayesha@example.com"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-[#1b1c1c] focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                  Full Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House #, Road #, Sector/Area, Thana"
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                    City / Zone
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                  >
                    <option value="Dhaka">Dhaka (Inside)</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Outside Dhaka">Other District</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8f8287] absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      className="w-full bg-[#fcfbfa] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl pl-10 pr-8 py-2 text-xs text-[#1b1c1c] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-3 text-[#8f8287] hover:text-[#1b1c1c] cursor-pointer"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#745663] hover:bg-[#5c434e] text-white font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account &amp; Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-[#53434b]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-[#745663] font-bold hover:underline cursor-pointer"
                  >
                    Sign In with Phone
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
