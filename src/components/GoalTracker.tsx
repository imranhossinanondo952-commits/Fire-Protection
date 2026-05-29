import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Calendar, 
  Clock, 
  Bell, 
  Check, 
  X, 
  TrendingUp, 
  Briefcase, 
  Home, 
  HelpCircle, 
  AlertCircle 
} from 'lucide-react';
import { Goal, RoutineItem } from '../types';

interface GoalTrackerProps {
  language: 'en' | 'bn';
  goals: Goal[];
  routines: RoutineItem[];
  onAddGoal: (g: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onToggleStep: (goalId: string, stepIndex: number) => void;
  onAddRoutine: (r: Omit<RoutineItem, 'id'>) => void;
  onToggleRoutine: (id: string) => void;
  onDeleteRoutine: (id: string) => void;
}

export function GoalTracker({
  language,
  goals,
  routines,
  onAddGoal,
  onDeleteGoal,
  onToggleStep,
  onAddRoutine,
  onToggleRoutine,
  onDeleteRoutine
}: GoalTrackerProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);

  // Goal Form Fields
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<'monthly' | 'house_building' | 'business' | 'investment'>('house_building');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [goalNotes, setGoalNotes] = useState('');
  const [stepsInput, setStepsInput] = useState('');

  // Routine Form Fields
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineTime, setRoutineTime] = useState('09:00');
  const [routineCategory, setRoutineCategory] = useState<'safety' | 'work' | 'personal' | 'financial'>('safety');
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);

  const t = {
    en: {
      goalsTitle: "LONG-TERM STRATEGIC PLANS & INVESTMENT NOTES",
      goalsTag: "Structured target tracking with multi-step validation checks",
      addGoal: "Commission Goal",
      routinesTitle: "DAILY SAFETY PROTOCOLS & RUNBOOKS",
      routinesTag: "Tactical scheduler synced securely to active device memory",
      addRoutine: "Schedule Protocol",
      stepsLeft: "steps remaining",
      progress: "Target Completion Value",
      target: "Financial Limit",
      current: "Accumulated Value",
      emptyGoals: "No security investment notes recorded yet.",
      emptyRoutines: "Device calendar schedule currently clear.",
      notifSuccess: "Safety notification scheduled successfully!",
      calendarSyncSuccess: "Synchronizing and locking routine parameters to browser calendar API.",
      formGoal: {
        title: "Create Strategic Objective Mode",
        name: "Objective Title",
        category: "Objective Category",
        target: "Sought Resource Limit (৳)",
        current: "Current Saved / Investment (৳)",
        steps: "Validation Action Checklists (comma-separated)",
        stepsPlaceholder: "e.g., Get fire NOC, Fit fire sensors, Insulate wiring",
        notes: "Operational Execution Notes"
      },
      formRoutine: {
        title: "Schedule Operating Protocol Runbook",
        name: "Routine Exercise Name",
        time: "Scheduled Activation UTC Time",
        category: "Safety Category",
        alert: "Enable Foreground Popups",
        sync: "Persist to Main Device Calendar"
      },
      categories: {
        monthly: "Monthly Plans",
        house_building: "House Building Plans",
        business: "Business Plans",
        investment: "Investment Records"
      },
      routineCats: {
        safety: "Safety Drills",
        work: "System Security Audit",
        personal: "Officer Shift Tasks",
        financial: "Ledger Reconciliation"
      },
      cancel: "Abort Control",
      save: "Deploy Parameters"
    },
    bn: {
      goalsTitle: "দীর্ঘমেয়াদী কৌশলগত পরিকল্পনা ও বিনিয়োগ নোট",
      goalsTag: "ধাপভিত্তিক অগ্রগতি নিরীক্ষণ এবং আর্থিক নিরাপত্তা বাস্তবায়ন",
      addGoal: "নতুন লক্ষ্য যোগ করুন",
      routinesTitle: "দৈনিক নিরাপত্তা প্রটোকল এবং সময়সূচী",
      routinesTag: "ডিভাইস ক্যালেন্ডার মেমরির সাথে সিঙ্ক করা সময়সূচী",
      addRoutine: "সময়সূচী তালিকাভুক্ত করুন",
      stepsLeft: "টি ধাপ বাকি আছে",
      progress: "লক্ষ্য অর্জনের হার",
      target: "আর্থিক সীমা",
      current: "বর্তমান বরাদ্দ",
      emptyGoals: "এখনও কোনও নির্দিষ্ট লক্ষ্য কমিশন করা হয়নি।",
      emptyRoutines: "ডিভাইসের সময়সূচী পরিষ্কার। কোনো নিরাপত্তা ড্রিল নির্ধারিত নেই।",
      notifSuccess: "নিরাপত্তা বিজ্ঞপ্তি সফলভাবে সক্রিয় করা হয়েছে!",
      calendarSyncSuccess: "ব্রাউজার ক্যালেন্ডারের সাথে সিঙ্ক নিশ্চিত করা হয়েছে।",
      formGoal: {
        title: "নতুন কৌশলগত পরিকল্পনা বোর্ড",
        name: "পরিকল্পনার বিবরণ",
        category: "পরিকল্পনার ধরণ",
        target: "মোট কাঙ্ক্ষিত সম্পদ সংস্থান (৳)",
        current: "বর্তমান সঞ্চিত পরিমাণ (৳)",
        steps: "প্রয়োজনীয় ধাপসমূহ (কমা দিয়ে লিখুন)",
        stepsPlaceholder: "যেমনঃ ফায়ার এনওসি আনা, সেন্সর লাগানো, ওয়ারিং নিরাপদ করা",
        notes: "পরিকল্পনা সংক্রান্ত অতিরিক্ত নোট"
      },
      formRoutine: {
        title: "দৈনিক ড্রিল বা কাজের সময়সূচী প্রবর্তন",
        name: "কাজের নাম",
        time: "নির্ধারিত সময় (UTC)",
        category: "শ্রেণীর ধরণ",
        alert: "অন-স্ক্রিন নোটিফিকেশন প্রদর্শন করুন",
        sync: "ডিভাইস ক্যালেন্ডারে যুক্ত করুন"
      },
      categories: {
        monthly: "মাসিক পরিকল্পনা",
        house_building: "বাড়ি তৈরির পরিকল্পনা",
        business: "ব্যবসা সম্প্রসারণ",
        investment: "দীর্ঘমেয়াদী নিরাপদ ডিপোজিট"
      },
      routineCats: {
        safety: "নিরাপত্তা মহড়া ড্রিল",
        work: "সার্ভার সিকিউরিটি অডিট",
        personal: "ডিউটি অফিসার শিফট কাজ",
        financial: "বাজেট খতিয়ান রেকোন"
      },
      cancel: "বাতিল করুন",
      save: "তালিকাবদ্ধ করুন"
    }
  }[language];

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle) return;

    // Split steps
    const rawSteps = stepsInput.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => ({ name: s, completed: false }));

    const newG: Goal = {
      id: Date.now().toString(),
      title: goalTitle,
      category: goalCategory,
      targetAmount: Number(targetAmount) || 0,
      currentAmount: Number(currentAmount) || 0,
      steps: rawSteps.length > 0 ? rawSteps : [{ name: "Review budget details", completed: false }],
      notes: goalNotes
    };

    onAddGoal(newG);

    setGoalTitle('');
    setStepsInput('');
    setTargetAmount('');
    setCurrentAmount('');
    setGoalNotes('');
    setShowGoalModal(false);
  };

  const handleRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle) return;

    onAddRoutine({
      title: routineTitle,
      time: routineTime,
      category: routineCategory,
      isCompleted: false,
      alertEnabled,
      calendarSync
    });

    if (alertEnabled && window.Notification) {
      if (Notification.permission === 'granted') {
        new Notification("Fire Protection Alarm", {
          body: `${routineTitle} scheduled at ${routineTime} successfully.`
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    setRoutineTitle('');
    setShowRoutineModal(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'house_building':
        return <Home className="w-5 h-5 text-orange-400" />;
      case 'business':
        return <Briefcase className="w-5 h-5 text-cyan-404" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default:
        return <Target className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-20 select-none">
      
      {/* SECTION 1: Strategic Target Goals */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-lg shadow-orange-950/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#22d3ee] uppercase flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              {t.goalsTitle}
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Active Targets Dashboard
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{t.goalsTag}</p>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-orange-950/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t.addGoal}
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10 font-mono text-xs">
            {t.emptyGoals}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              // Calculate completion fraction
              const stepsCompleted = goal.steps.filter(s => s.completed).length;
              const stepsTotal = goal.steps.length;
              const stepPercent = stepsTotal > 0 ? (stepsCompleted / stepsTotal) * 100 : 0;
              const fundsPercent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const totalProgress = Math.round((stepPercent + fundsPercent) / 2);

              return (
                <div key={goal.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(goal.category)}
                        <span className="text-xs font-mono text-slate-400 capitalize bg-slate-950/40 px-2 py-0.5 rounded-md border border-slate-850">
                          {t.categories[goal.category] || goal.category}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1 text-slate-600 hover:text-slate-450 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-200 mt-3 leading-snug">
                      {goal.title}
                    </h3>

                    {goal.notes && (
                      <p className="text-xs text-slate-400 italic font-mono mt-1.5 line-clamp-2">
                        {goal.notes}
                      </p>
                    )}

                    {/* Progress tracking bars */}
                    <div className="mt-5 space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>{t.progress}</span>
                          <span className="text-orange-400 font-bold">{totalProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                            style={{ width: `${totalProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-[11px] font-mono border-t border-slate-850 pt-2 text-slate-400">
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase">{t.current}</span>
                          <span className="font-bold text-slate-200">৳{goal.currentAmount.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-500 uppercase">{t.target}</span>
                          <span className="font-bold text-slate-400">৳{goal.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Validation Step Checklists */}
                    <div className="mt-4 pt-3 border-t border-slate-850">
                      <span className="block text-[10px] font-mono text-slate-500 mb-2 uppercase">ACTION PROTOCOL STEPS:</span>
                      <div className="space-y-1.5">
                        {goal.steps.map((step, idx) => (
                          <button
                            key={idx}
                            onClick={() => onToggleStep(goal.id, idx)}
                            className="w-full flex items-center gap-2 text-left text-xs text-slate-350 hover:text-slate-200 font-mono transition-colors py-0.5 cursor-pointer"
                          >
                            {step.completed ? (
                              <CheckSquare className="w-4 h-4 text-orange-500 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-700 hover:text-orange-500/45 shrink-0" />
                            )}
                            <span className={step.completed ? 'line-through text-slate-550' : ''}>
                              {step.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Daily scheduler */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-lg shadow-orange-950/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#22d3ee] uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-404" />
              {t.routinesTitle}
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Safety Drill & Active Calendars
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{t.routinesTag}</p>
          </div>
          <button
            onClick={() => setShowRoutineModal(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/35 text-cyan-400 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t.addRoutine}
          </button>
        </div>

        {routines.length === 0 ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10 font-mono text-xs">
            {t.emptyRoutines}
          </div>
        ) : (
          <div className="space-y-2.5">
            {routines.map((item) => (
              <div 
                key={item.id} 
                className={`bg-slate-900/30 border rounded-2xl p-4 flex items-center justify-between transition-colors ${item.isCompleted ? 'border-emerald-500/20 bg-emerald-950/5' : 'border-slate-850'}`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleRoutine(item.id)}
                    className="p-1 text-slate-500 hover:text-slate-350 bg-slate-950 border border-slate-850 rounded-lg cursor-pointer"
                  >
                    {item.isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-4 h-4 block"></span>
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-extrabold ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono bg-slate-950 border border-slate-850 text-slate-450 px-1.5 py-0.5 rounded">
                        {t.routineCats[item.category] || item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {item.time} Active
                      </span>
                      {item.alertEnabled && (
                        <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-0.5">
                          <Bell className="w-2.5 h-2.5" /> Alarm
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteRoutine(item.id)}
                  className="p-1.5 text-slate-655 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal Creation Drawer overlays */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-850">
              <h3 className="text-base font-black text-slate-200 uppercase tracking-wider">
                {t.formGoal.title}
              </h3>
              <button 
                onClick={() => setShowGoalModal(false)}
                className="p-1.5 bg-slate-950 rounded-lg border border-slate-850 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4 mt-4">
              
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.formGoal.name}</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Uttara Fire Insulated Control Room Layout"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.formGoal.category}</label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono cursor-pointer"
                >
                  <option value="house_building">{t.categories.house_building}</option>
                  <option value="business">{t.categories.business}</option>
                  <option value="investment">{t.categories.investment}</option>
                  <option value="monthly">{t.categories.monthly}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.formGoal.target}</label>
                  <input
                    type="number"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="e.g. 100000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.formGoal.current}</label>
                  <input
                    type="number"
                    required
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">
                  {t.formGoal.steps}
                </label>
                <textarea
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  placeholder={t.formGoal.stepsPlaceholder}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.formGoal.notes}</label>
                <input
                  type="text"
                  value={goalNotes}
                  onChange={(e) => setGoalNotes(e.target.value)}
                  placeholder="General parameters, deadlines, or resource vendors"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs text-slate-400 rounded-xl font-mono cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {t.save}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Routine Creation Drawer overlays */}
      {showRoutineModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-850">
              <h3 className="text-base font-black text-slate-200 uppercase tracking-wider">
                {t.formRoutine.title}
              </h3>
              <button 
                onClick={() => setShowRoutineModal(false)}
                className="p-1.5 bg-slate-950 rounded-lg border border-slate-850 text-slate-550 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRoutineSubmit} className="space-y-4 mt-4">
              
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.formRoutine.name}</label>
                <input
                  type="text"
                  required
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  placeholder="e.g. Evacuation alarm audio drill check"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.formRoutine.time}</label>
                  <input
                    type="time"
                    required
                    value={routineTime}
                    onChange={(e) => setRoutineTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.formRoutine.category}</label>
                  <select
                    value={routineCategory}
                    onChange={(e) => setRoutineCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono cursor-pointer"
                  >
                    <option value="safety">{t.routineCats.safety}</option>
                    <option value="work">{t.routineCats.work}</option>
                    <option value="personal">{t.routineCats.personal}</option>
                    <option value="financial">{t.routineCats.financial}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertEnabled}
                    onChange={(e) => setAlertEnabled(e.target.checked)}
                    className="w-4 h-4 bg-slate-950 border border-slate-800 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-mono">{t.formRoutine.alert}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calendarSync}
                    onChange={(e) => setCalendarSync(e.target.checked)}
                    className="w-4 h-4 bg-slate-950 border border-slate-800 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-mono">{t.formRoutine.sync}</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowRoutineModal(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs text-slate-400 rounded-xl font-mono cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {t.save}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
