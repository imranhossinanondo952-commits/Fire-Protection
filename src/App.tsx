import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Menu, 
  X, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  Volume2, 
  PhoneCall, 
  Activity, 
  Lock, 
  LogOut, 
  Globe, 
  ChevronRight, 
  Info,
  Sliders,
  AlertTriangle,
  Flame,
  UserCheck
} from 'lucide-react';
import { Helpline, Announcement, Transaction, Goal, RoutineItem, ChatMessage } from './types';
import { AuthScreen } from './components/AuthScreen';
import { DashboardHome } from './components/DashboardHome';
import { EmergencyDirectory } from './components/EmergencyDirectory';
import { BudgetTracker } from './components/BudgetTracker';
import { GoalTracker } from './components/GoalTracker';
import { AIAssistant } from './components/AIAssistant';

export default function App() {
  // Locale States
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  // Multi-terminal Nav active tabs
  const [activeTab, setActiveTab] = useState<'home' | 'directory' | 'budget' | 'planner' | 'assistant'>('home');

  // Authentication states
  const [user, setUser] = useState<{
    name: string;
    username: string;
    email: string;
    phone: string;
    avatar: string;
  } | null>(null);

  // Separate state workflow for helplines normal user vs admin modifier
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // App Local databases (offline-first Hive-like mock backed by localStorage)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Mobile navigation drawer toggle
  const [showNavDrawer, setShowNavDrawer] = useState(false);

  // Global call simulation feedback banner
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  // Sync state data on app render initialization
  useEffect(() => {
    // Load local storage
    const localTx = localStorage.getItem('fire_protection_tx');
    if (localTx) {
      setTransactions(JSON.parse(localTx));
    } else {
      // Setup mock transactions
      const defaults: Transaction[] = [
        { id: "tx1", type: "income", category: "Business", amount: 45000, dateTime: "2026-05-28", notes: "Consultancy shift reward" },
        { id: "tx2", type: "expense", category: "Medical", amount: 1200, dateTime: "2026-05-29", notes: "LPG first-aid gas masks" },
        { id: "tx3", type: "expense", category: "Bills", amount: 3200, dateTime: "2026-05-29", notes: "Home LPG alarm replacement" }
      ];
      setTransactions(defaults);
      localStorage.setItem('fire_protection_tx', JSON.stringify(defaults));
    }

    const localGoals = localStorage.getItem('fire_protection_goals');
    if (localGoals) {
      setGoals(JSON.parse(localGoals));
    } else {
      // Setup mock goals
      const defaultGoals: Goal[] = [
        {
          id: "g1",
          title: "Uttara Fire Safety Gear Installation",
          category: "house_building",
          targetAmount: 85000,
          currentAmount: 35000,
          steps: [
            { name: "Purchase ABC Dry Powder cylinders", completed: true },
            { name: "Install addressable thermal layout", completed: false },
            { name: "Obtain fire civil defense permit", completed: false }
          ],
          notes: "Essential protection parameters for secondary residency"
        }
      ];
      setGoals(defaultGoals);
      localStorage.setItem('fire_protection_goals', JSON.stringify(defaultGoals));
    }

    const localRoutines = localStorage.getItem('fire_protection_routines');
    if (localRoutines) {
      setRoutines(JSON.parse(localRoutines));
    } else {
      // Setup defaults
      const defaultRoutines: RoutineItem[] = [
        { id: "r1", title: "Daily Kitchen Gas Leak Sensor Drill", time: "08:30", category: "safety", isCompleted: true, alertEnabled: true, calendarSync: true },
        { id: "r2", title: "Verify Battery Level of Exit Signages", time: "18:00", category: "work", isCompleted: false, alertEnabled: false, calendarSync: true }
      ];
      setRoutines(defaultRoutines);
      localStorage.setItem('fire_protection_routines', JSON.stringify(defaultRoutines));
    }

    const localChat = localStorage.getItem('fire_protection_chat');
    if (localChat) {
      setChatHistory(JSON.parse(localChat));
    }

    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Announcements fetch crashed:", err);
    }
  };

  // Transaction Helpers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const item: Transaction = {
      ...newTx,
      id: "tx_" + Date.now().toString()
    };
    const updated = [item, ...transactions];
    setTransactions(updated);
    localStorage.setItem('fire_protection_tx', JSON.stringify(updated));
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('fire_protection_tx', JSON.stringify(updated));
  };

  // Goal Helpers
  const handleAddGoal = (newGoal: Goal) => {
    const updated = [newGoal, ...goals];
    setGoals(updated);
    localStorage.setItem('fire_protection_goals', JSON.stringify(updated));
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('fire_protection_goals', JSON.stringify(updated));
  };

  const handleToggleGoalStep = (goalId: string, idx: number) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const steps = [...g.steps];
        steps[idx] = { ...steps[idx], completed: !steps[idx].completed };
        return { ...g, steps };
      }
      return g;
    });
    setGoals(updated);
    localStorage.setItem('fire_protection_goals', JSON.stringify(updated));
  };

  // Routine Helpers
  const handleAddRoutine = (newR: Omit<RoutineItem, 'id'>) => {
    const item: RoutineItem = {
      ...newR,
      id: "rt_" + Date.now().toString()
    };
    const updated = [item, ...routines];
    setRoutines(updated);
    localStorage.setItem('fire_protection_routines', JSON.stringify(updated));
  };

  const handleToggleRoutine = (id: string) => {
    const updated = routines.map(r => {
      if (r.id === id) {
        return { ...r, isCompleted: !r.isCompleted };
      }
      return r;
    });
    setRoutines(updated);
    localStorage.setItem('fire_protection_routines', JSON.stringify(updated));
  };

  const handleDeleteRoutine = (id: string) => {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    localStorage.setItem('fire_protection_routines', JSON.stringify(updated));
  };

  // Chat Assistant Transmit
  const handleSendChatMessage = async (prompt: string, imageBase64?: string, imageMime?: string) => {
    // Generate new entry locally
    const userMsg: ChatMessage = {
      id: "user_" + Date.now().toString(),
      role: 'user',
      text: prompt,
      imageUrl: imageBase64 ? `data:${imageMime};base64,${imageBase64}` : undefined,
      timestamp: new Date().toLocaleTimeString()
    };
    
    const intermediate = [...chatHistory, userMsg];
    setChatHistory(intermediate);
    localStorage.setItem('fire_protection_chat', JSON.stringify(intermediate));

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageBase64,
          imageMime
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: "ai_" + Date.now().toString(),
        role: 'model',
        text: data.text || "Model evaluation timed out.",
        timestamp: new Date().toLocaleTimeString()
      };

      const finalHistory = [...intermediate, aiMsg];
      setChatHistory(finalHistory);
      localStorage.setItem('fire_protection_chat', JSON.stringify(finalHistory));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "err_" + Date.now().toString(),
        role: 'model',
        text: `Network failure or key constraint. Please verify your internet connection. (Details: ${err.message})`,
        timestamp: new Date().toLocaleTimeString()
      };
      const finalHistory = [...intermediate, errorMsg];
      setChatHistory(finalHistory);
      localStorage.setItem('fire_protection_chat', JSON.stringify(finalHistory));
    }
  };

  const handleClearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('fire_protection_chat');
  };

  // Export spreadsheet through clean native form trigger
  const handleRawExportExcel = () => {
    const serializedData = encodeURIComponent(JSON.stringify(transactions));
    window.location.href = `/api/export-excel?data=${serializedData}`;
  };

  // Dialer trigger stimulation
  const handleCallSimulation = (phone: string) => {
    setCallingNumber(phone);
    setTimeout(() => {
      setCallingNumber(null);
    }, 4500);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  const appTitle = {
    en: {
      brandFirst: "Fire",
      brandSecond: "Protection",
      navHome: "Command",
      navDirectory: "Helpline Directory",
      navBudget: "Budget & Charts",
      navPlanner: "Goal Plans",
      navAssistant: "Guardian Assistant",
      callerTitle: "ESTABLISHING EMERGENCY HOTLINE TRUNK...",
      callerDesc: "Connecting directly. Stay alert and keep communication clear.",
      emergencyAlert: "STANDBY DIALING ATTEMPT"
    },
    bn: {
      brandFirst: "ফায়ার",
      brandSecond: "প্রটেকশন",
      navHome: "ড্যাশবোর্ড",
      navDirectory: "জরুরি ডিরেক্টরি",
      navBudget: "বাজেট এবং গ্রাফ",
      navPlanner: "পরিকল্পনা বুক",
      navAssistant: "গার্ডিয়ান অ্যাসিস্ট্যান্ট",
      callerTitle: "হটলাইন সিমুলেশন কানেক্ট করা হচ্ছে...",
      callerDesc: "সরাসরি কানেকশন করা হবে। শান্ত থাকুন এবং নির্দেশনা অনুসরন করুন।",
      emergencyAlert: "জরুরি ডায়ালিং প্রচেষ্টা"
    }
  }[language];

  // Render Auth screening if no user logged in
  if (!user) {
    return (
      <AuthScreen 
        language={language} 
        onLoginSuccess={(validUser) => setUser(validUser)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#f1f5f9] relative overflow-x-hidden font-sans">
      
      {/* Glow Refraction Orbits styled perfectly to match artistic flair criteria */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-15%] w-[450px] h-[450px] rounded-full bg-orange-600/15 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-cyan-600/15 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] rounded-full bg-rose-600/5 blur-[120px]"></div>
      </div>

      <div className="flex h-screen relative z-10">

        {/* SIDE BAR NAVIGATION - Art Flair standard layout */}
        <aside className="w-64 h-full border-r border-white/10 hidden lg:flex flex-col justify-between py-6 px-4 bg-black/3c backdrop-blur-xl shrink-0">
          <div>
            {/* Logo Brand Header */}
            <div className="flex items-center gap-3.5 px-3 mb-9">
              <div className="w-11 h-11 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-400/25">
                <Flame className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-100 tracking-tight flex items-center">
                  {appTitle.brandFirst}<span className="text-orange-500 ml-1">{appTitle.brandSecond}</span>
                </h1>
                <span className="text-[9px] font-mono text-cyan-400 tracking-widest block uppercase">GUARDIAN OS</span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-mono transition-all text-left border cursor-pointer ${activeTab === 'home' ? 'bg-orange-500/10 border-orange-500/30 text-orange-450' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <Activity className="w-4 h-4" />
                <span>{appTitle.navHome}</span>
                {activeTab === 'home' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />}
              </button>

              <button 
                onClick={() => setActiveTab('directory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-mono transition-all text-left border cursor-pointer ${activeTab === 'directory' ? 'bg-orange-500/10 border-orange-500/30 text-orange-450' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <MapPin className="w-4 h-4" />
                <span>{appTitle.navDirectory}</span>
                {activeTab === 'directory' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />}
              </button>

              <button 
                onClick={() => setActiveTab('budget')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-mono transition-all text-left border cursor-pointer ${activeTab === 'budget' ? 'bg-orange-500/10 border-orange-500/30 text-orange-450' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{appTitle.navBudget}</span>
                {activeTab === 'budget' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />}
              </button>

              <button 
                onClick={() => setActiveTab('planner')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-mono transition-all text-left border cursor-pointer ${activeTab === 'planner' ? 'bg-orange-500/10 border-orange-500/30 text-orange-450' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>{appTitle.navPlanner}</span>
                {activeTab === 'planner' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />}
              </button>

              <button 
                onClick={() => setActiveTab('assistant')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-mono transition-all text-left border cursor-pointer ${activeTab === 'assistant' ? 'bg-orange-500/10 border-orange-500/30 text-orange-450' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>{appTitle.navAssistant}</span>
                {activeTab === 'assistant' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-orange-400" />}
              </button>
            </nav>
          </div>

          {/* User Profile Info Footer card */}
          <div className="space-y-3">
            
            {/* Locale Language Switcher toggles */}
            <div className="p-2 bg-slate-950/60 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.1 px-1">
                <Globe className="w-3.5 h-3.5 text-cyan-404" />
                LANG
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-[10px] font-mono font-black rounded-lg transition-colors cursor-pointer ${language === 'en' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/25' : 'text-slate-500 hover:text-slate-350 bg-transparent border border-transparent'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-1 text-[10px] font-mono font-black rounded-lg transition-colors cursor-pointer ${language === 'bn' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/25' : 'text-slate-500 hover:text-slate-350 bg-transparent border border-transparent'}`}
                >
                  বাং
                </button>
              </div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <img 
                src={user.avatar} 
                alt="Profile photo" 
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1 text-left">
                <span className="block text-xs font-black text-slate-100 truncate">{user.name}</span>
                <span className="block text-[10px] text-slate-500 font-mono truncate">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-slate-500 hover:text-rose-450 transition-colors shrink-0 bg-transparent border-none cursor-pointer"
                title="Log Out Terminal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN BODY WRAPPER PANEL */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Upper Navigation Header Bar for Mobile view screens */}
          <header className="h-16 border-b border-white/10 px-5 flex items-center justify-between shrink-0 bg-black/20 backdrop-blur-md relative z-20">
            <div className="flex items-center gap-3 lg:hidden">
              <button 
                onClick={() => setShowNavDrawer(true)}
                className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-sm font-black text-slate-100 flex items-center">
                {appTitle.brandFirst}<span className="text-orange-500">{appTitle.brandSecond}</span>
              </h1>
            </div>

            {/* Desktop header metadata labels */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-bold block text-sm tracking-wider uppercase font-mono">
                Operator Station Console
              </span>
            </div>

            {/* Neon Status alerts Indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                <span className="text-cyan-400 text-[10px] font-mono tracking-widest uppercase">SYS_STATUS: OPTIMAL</span>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
              </div>

              {/* Language mobile switch */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="lg:hidden p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-orange-400 font-bold font-mono cursor-pointer"
              >
                {language === 'en' ? 'BN' : 'EN'}
              </button>
            </div>
          </header>

          {/* Core presentation screen outlet */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
            
            {activeTab === 'home' && (
              <DashboardHome 
                language={language}
                transactions={transactions}
                announcements={announcements}
                onQuickAdd={() => setActiveTab('budget')}
                onNavigateTo={(tab) => setActiveTab(tab as any)}
                user={user}
                onCall={handleCallSimulation}
              />
            )}

            {activeTab === 'directory' && (
              <EmergencyDirectory 
                language={language}
                onCall={handleCallSimulation}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetTracker 
                language={language}
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onRawExportExcel={handleRawExportExcel}
              />
            )}

            {activeTab === 'planner' && (
              <GoalTracker 
                language={language}
                goals={goals}
                routines={routines}
                onAddGoal={handleAddGoal}
                onDeleteGoal={handleDeleteGoal}
                onToggleStep={handleToggleGoalStep}
                onAddRoutine={handleAddRoutine}
                onToggleRoutine={handleToggleRoutine}
                onDeleteRoutine={handleDeleteRoutine}
              />
            )}

            {activeTab === 'assistant' && (
              <AIAssistant 
                language={language}
                chatHistory={chatHistory}
                onSendMessage={handleSendChatMessage}
                onClearHistory={handleClearChatHistory}
              />
            )}

          </main>

        </div>

      </div>

      {/* MOBILE RESPONSIVE SIDEBAR OVERLAY DRAWER */}
      {showNavDrawer && (
        <div className="fixed inset-0 z-100 flex lg:hidden select-none">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNavDrawer(false)}></div>
          
          <div className="w-64 max-w-[80vw] h-full bg-slate-950 border-r border-slate-900 py-6 px-4 relative z-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-slate-500">NAVIGATION</span>
                <button 
                  onClick={() => setShowNavDrawer(false)}
                  className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-4">
                <button 
                  onClick={() => { setActiveTab('home'); setShowNavDrawer(false); }}
                  className={`w-full flex items-center gap-3 text-xs font-mono py-2.5 px-3 rounded-lg border text-left cursor-pointer ${activeTab === 'home' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'text-slate-400 border-transparent hover:bg-slate-900/40'}`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{appTitle.navHome}</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('directory'); setShowNavDrawer(false); }}
                  className={`w-full flex items-center gap-3 text-xs font-mono py-2.5 px-3 rounded-lg border text-left cursor-pointer ${activeTab === 'directory' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'text-slate-400 border-transparent hover:bg-slate-900/40'}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{appTitle.navDirectory}</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('budget'); setShowNavDrawer(false); }}
                  className={`w-full flex items-center gap-3 text-xs font-mono py-2.5 px-3 rounded-lg border text-left cursor-pointer ${activeTab === 'budget' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'text-slate-400 border-transparent hover:bg-slate-900/40'}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{appTitle.navBudget}</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('planner'); setShowNavDrawer(false); }}
                  className={`w-full flex items-center gap-3 text-xs font-mono py-2.5 px-3 rounded-lg border text-left cursor-pointer ${activeTab === 'planner' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'text-slate-400 border-transparent hover:bg-slate-900/40'}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{appTitle.navPlanner}</span>
                </button>

                <button 
                  onClick={() => { setActiveTab('assistant'); setShowNavDrawer(false); }}
                  className={`w-full flex items-center gap-3 text-xs font-mono py-2.5 px-3 rounded-lg border text-left cursor-pointer ${activeTab === 'assistant' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'text-slate-400 border-transparent hover:bg-slate-900/40'}`}
                >
                  <Sparkles className="w-4 h-4 animate-pulse text-cyan-404" />
                  <span>{appTitle.navAssistant}</span>
                </button>
              </nav>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 flex items-center gap-2">
              <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-100 truncate">{user.name}</span>
                <span className="block text-[10px] text-slate-500 truncate">{user.email}</span>
              </div>
              <button onClick={handleLogout} className="p-1 text-slate-550 hover:text-rose-450 cursor-pointer">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY CALLING SIMULATOR HUD OVERLAY */}
      {callingNumber && (
        <div className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-red-500/30 rounded-3xl p-6 shadow-2xl shadow-red-950/40 text-center relative select-none">
            
            {/* Pulsing Outer Radar Circle */}
            <div className="flex justify-center my-6">
              <div className="relative p-7 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse">
                <div className="absolute inset-0 rounded-full border border-red-500/50 scale-110 animate-ping opacity-40"></div>
                <PhoneCall className="w-14 h-14 text-red-500 animate-bounce" />
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full uppercase">
              {appTitle.emergencyAlert}
            </span>

            <h3 className="text-lg font-black text-slate-100 mt-5 uppercase tracking-wide">
              {appTitle.callerTitle}
            </h3>

            <span className="block text-2xl font-black text-stone-200 font-mono mt-2 tracking-wide">
              {callingNumber}
            </span>

            <p className="text-xs text-slate-400 leading-relaxed font-mono px-4 mt-3">
              {appTitle.callerDesc}
            </p>

            <button
              onClick={() => setCallingNumber(null)}
              className="w-full bg-red-650 hover:bg-red-500 text-slate-100 text-xs font-mono font-black py-3 rounded-xl transition-colors cursor-pointer mt-8 border border-red-500/30"
            >
              TERM CONNECTION ATTEMPT
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
