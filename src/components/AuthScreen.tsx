import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Key, Mail, User, Phone, Fingerprint, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
  language: 'en' | 'bn';
  onLoginSuccess: (user: { name: string; username: string; email: string; phone: string; avatar: string }) => void;
}

export function AuthScreen({ language, onLoginSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'biometric'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const t = {
    en: {
      welcome: "FIRE GUARDIAN",
      tagline: "Futuristic Glassmorphic Security Hub",
      loginTab: "Log In",
      signupTab: "Sign Up",
      email: "Email Address",
      password: "Security Password",
      username: "Custom Username",
      name: "Full Name",
      phone: "Mobile Number",
      forgot: "Forgot Password?",
      loginBtn: "Authorize",
      signupBtn: "Register Terminal",
      guestBtn: "Guest Mode Access",
      biometricsTitle: "Biometric Key Scan",
      biometricsDesc: "Verify touch identifier or biometric PIN key",
      fingerprintSuccess: "Biometric Decryption Successful!",
      signupSuccess: "Terminal registered successfully! Log in to access.",
      forgotSuccess: "Secure bypass link dispatched to your email address.",
      invalid: "Invalid authorization credentials.",
      backToLogin: "Back to login portal",
      placeholderEmail: "operator@fireprotection.net",
      placeholderUser: "pyro_guardian",
      placeholderPhone: "017XXXXXXXX",
      scanPrompt: "Touch and hold the fingerprint scanner"
    },
    bn: {
      welcome: "ফায়ার গার্ডিয়ান",
      tagline: "ফিউচারিস্টিক গ্লাস মরফিক সিকিউরিটি হাব",
      loginTab: "লগ ইন",
      signupTab: "সাইন আপ",
      email: "ইমেইল এড্রেস",
      password: "সিকিউরিটি পাসওয়ার্ড",
      username: "কাস্টম ইউজারনেম",
      name: "সম্পূর্ণ নাম",
      phone: "মোবাইল নম্বর",
      forgot: "পাসওয়ার্ড ভুলে গেছেন?",
      loginBtn: "অথরাইজ করুন",
      signupBtn: "টার্মিনাল রেজিস্টার",
      guestBtn: "গেস্ট মোড অ্যাক্সেস",
      biometricsTitle: "বায়োমেট্রিক কী স্ক্যান",
      biometricsDesc: "টাচ আইডি বা বায়োমেট্রিক পিন কী যাচাই করুন",
      fingerprintSuccess: "বায়োমেট্রিক ডিক্রিপশন সফল হয়েছে!",
      signupSuccess: "টার্মিনাল সফলভাবে নিবন্ধিত! অ্যাক্সেস করতে লগ ইন করুন।",
      forgotSuccess: "আপনার ইমেল ঠিকানায় নিরাপদ বাইপাস লিঙ্ক পাঠানো হয়েছে।",
      invalid: "অবৈধ অনুমোদন শংসাপত্র।",
      backToLogin: "লগইন পোর্টালে ফিরে যান",
      placeholderEmail: "operator@fireprotection.net",
      placeholderUser: "pyro_guardian",
      placeholderPhone: "017XXXXXXXX",
      scanPrompt: "ফিঙ্গারপ্রিন্ট স্ক্যানারটি স্পর্শ করে ধরে রাখুন"
    }
  };

  const currentT = t[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(language === 'bn' ? "দয়া করে সব ঘর পূরণ করুন।" : "Please fill in all security fields.");
      return;
    }
    setError('');
    // Successful simulation
    onLoginSuccess({
      name: name || "Officer Hossain",
      username: username || "pyro_guardian",
      email: email,
      phone: phone || "01712345678",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop"
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username || !name) {
      setError(language === 'bn' ? "সব বিবরণ বাধ্যতামূলক।" : "All profile parameters are required.");
      return;
    }
    setError('');
    setSuccessMsg(currentT.signupSuccess);
    setTimeout(() => {
      setSuccessMsg('');
      setMode('login');
    }, 2000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(language === 'bn' ? "অনুগ্রহ করে ইমেলটি লিখুন।" : "Please key in your registered email.");
      return;
    }
    setError('');
    setSuccessMsg(currentT.forgotSuccess);
    setTimeout(() => {
      setSuccessMsg('');
      setMode('login');
    }, 2500);
  };

  const triggerBiometrics = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onLoginSuccess({
        name: "Commander Imram",
        username: "biometric_secure",
        email: "imran@fireprotection.bn",
        phone: "01730009999",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop"
      });
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 overflow-hidden font-sans select-none">
      {/* Background Orbs for Glass refraction */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/5 blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-red-950/20 relative z-10"
      >
        {/* Glow Line Indicator */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-cyan-500 rounded-t-full"></div>

        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-4 hover:scale-105 transition-transform">
            <Shield className="w-10 h-10 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-wider">
            {currentT.welcome}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {currentT.tagline}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs mb-4 text-center font-mono animate-bounce">
            {error}
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs mb-4 flex items-center justify-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentT.placeholderEmail}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.password}</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-11 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-xs text-orange-400/90 font-mono hover:text-orange-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {currentT.forgot}
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 py-3 rounded-xl text-sm font-bold shadow-xl shadow-orange-950/30 border border-orange-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Shield className="w-4.5 h-4.5 text-slate-200" />
                {currentT.loginBtn}
              </button>

              <div className="flex gap-4 pt-1">
                <button 
                  type="button"
                  onClick={() => {
                    setError('');
                    onLoginSuccess({
                      name: "Guest Fire Officer",
                      username: "guest_ops",
                      email: "guest@fireprotection.net",
                      phone: "01800000000",
                      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&fit=crop"
                    });
                  }}
                  className="flex-1 bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-xs text-slate-400 py-3 rounded-xl transition-all font-mono text-center active:scale-95 cursor-pointer"
                >
                  {currentT.guestBtn}
                </button>

                <button 
                  type="button"
                  onClick={() => setMode('biometric')}
                  className="flex-1 bg-cyan-950/10 hover:bg-cyan-950/20 border border-cyan-950/30 text-cyan-400 py-3 rounded-xl text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  {language === 'bn' ? 'বায়োমেট্রিক' : 'Biometrics'}
                </button>
              </div>

              <div className="text-center pt-4 border-t border-slate-800/50">
                <button 
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-mono cursor-pointer"
                >
                  {language === 'bn' ? 'নতুন অপারেটর? সাইন আপ করুন।' : "New Safety Operator? Sign Up."}
                </button>
              </div>
            </motion.form>
          )}

          {mode === 'signup' && (
            <motion.form 
              key="signup"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSignup} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.name}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Commander Imran"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.username}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={currentT.placeholderUser}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentT.placeholderEmail}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={currentT.placeholderPhone}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.password}</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 py-3 rounded-xl text-sm font-bold border border-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                {currentT.signupBtn}
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-mono cursor-pointer"
                >
                  {language === 'bn' ? 'ইতিমধ্যে একাউন্ট আছে? লগইন করুন।' : "Already operational? Log In."}
                </button>
              </div>
            </motion.form>
          )}

          {mode === 'forgot' && (
            <motion.form 
              key="forgot"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleForgot} 
              className="space-y-4"
            >
              <p className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg leading-relaxed text-center font-mono">
                {language === 'bn' ? 'সিস্টেম মডিউলে একটি নিরাপদ ডিক্রিপশন রিসেট বাইপাস লিঙ্ক ইস্যু করতে আপনার ইমেল প্রদান করুন।' : 'Identify your registered email link. The secure decryption bypass configuration will be sent to establish a new password.'}
              </p>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{currentT.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentT.placeholderEmail}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 text-sm py-3 pl-11 pr-4 rounded-xl text-slate-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-100 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all cursor-pointer"
              >
                {language === 'bn' ? 'রিসেট লিঙ্ক পাঠান' : 'Dispatch Override Authorization'}
              </button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-mono cursor-pointer"
                >
                  {currentT.backToLogin}
                </button>
              </div>
            </motion.form>
          )}

          {mode === 'biometric' && (
            <motion.div 
              key="biometric"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 text-center py-4"
            >
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-bold text-slate-200 mb-1">{currentT.biometricsTitle}</h3>
                <p className="text-xs text-slate-400 font-mono px-4">{currentT.biometricsDesc}</p>
              </div>

              <div className="flex justify-center my-6">
                <button 
                  type="button"
                  onMouseDown={triggerBiometrics}
                  onTouchStart={triggerBiometrics}
                  className={`relative p-8 rounded-full border border-cyan-500/20 flex items-center justify-center transition-all cursor-pointer active:scale-95 ${isScanning ? 'bg-cyan-500/20 shadow-[0_0_24px_rgba(6,182,212,0.4)] border-cyan-400/80 scale-105' : 'bg-cyan-500/5 hover:bg-cyan-500/10'}`}
                >
                  <Fingerprint className={`w-16 h-16 ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-cyan-500'}`} />
                  {isScanning && (
                    <span className="absolute inset-0 rounded-full border border-cyan-400 scale-110 animate-ping opacity-30"></span>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 font-mono animate-pulse">
                {isScanning ? (language === 'bn' ? 'স্ক্যান করা হচ্ছে... স্পর্শ করে ধরে রাখুন' : 'Analyzing scanner data... Hold screen') : currentT.scanPrompt}
              </p>

              <div>
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-mono cursor-pointer bg-slate-950/40 px-4 py-2 rounded-lg border border-slate-800/80"
                >
                  {currentT.backToLogin}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
