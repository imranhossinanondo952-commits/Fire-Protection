import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Download, 
  LineChart as LineIcon, 
  BarChart as BarIcon, 
  PieChart as PieIcon, 
  DollarSign, 
  Tag, 
  Calendar, 
  Activity, 
  ListCollapse, 
  AlertTriangle, 
  Cpu, 
  X, 
  ReceiptText,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { Transaction, TransactionCategory } from '../types';

interface BudgetTrackerProps {
  language: 'en' | 'bn';
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onRawExportExcel: () => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Food', 
  'Transport', 
  'Shopping', 
  'Bills', 
  'Education', 
  'Medical', 
  'Business', 
  'Others'
];

export function BudgetTracker({ 
  language, 
  transactions, 
  onAddTransaction, 
  onDeleteTransaction,
  onRawExportExcel 
}: BudgetTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const t = {
    en: {
      title: "FINANCIAL LEDGER & SAFETY RESOURCE AUDIT",
      tagline: "Track operating costs, protective gear expenditures, or safety allocations",
      totalIn: "Safe Income",
      totalOut: "Safe Outflow",
      netReserve: "Secured Cash Reserve",
      newLog: "Secure Ledger Entry",
      logHistory: "Ledger History Records",
      exportBtn: "Excel Worksheet Compilation",
      aiDiagnoseBtn: "Initiate Diagnostics Run",
      aiStatus: "GUARDIAN SECURITY COUNSEL",
      aiPlaceholder: "Press 'Initiate Diagnostics Run' below. The Gemini engine will parse your entire ledger and output strategic warnings, safety tool recommendations, and budgetary optimizations.",
      form: {
        title: "Log Terminal Operation",
        type: "Cash Flow Paradigm",
        income: "Inflow (+) / Resource Gain",
        expense: "Outflow (-) / Material Costs",
        amount: "Transaction Value (৳)",
        category: "Resource Classification",
        notes: "Strategic Verification Notes",
        submit: "Recon & Commit",
        cancel: "Discard"
      },
      headers: {
        date: "Date & Time",
        type: "Type",
        cat: "Category",
        val: "Amount (৳)",
        notes: "Notes",
        act: "Action"
      },
      empty: "No ledger assets registered on this device yet.",
      chartsTitle: "Live Real-Time Financial Growth & Category Distributions",
      growthTab: "Operating Runway Area",
      comparisonTab: "Inflow vs Outflow comparison",
      distributionTab: "Expenditure Category allocation",
      analyzing: "Querying Guardian Model..."
    },
    bn: {
      title: "আর্থিক লেজার এবং নিরাপত্তা সম্পদ নিরীক্ষা",
      tagline: "অপারেটিং খরচ, প্রতিরক্ষামূলক সরঞ্জাম ব্যয়, বা নিরাপত্তা বরাদ্দ ট্র্যাক করুন",
      totalIn: "নিরাপদ আয়",
      totalOut: "অপারেটিং আউটফ্লো",
      netReserve: "নেট নগদ রিজার্ভ",
      newLog: "নতুন লেজার এন্ট্রি",
      logHistory: "অপারেটিং খতিয়ান ইতিহাস",
      exportBtn: "এক্সেল ওয়ার্কশীট এক্সপোর্ট",
      aiDiagnoseBtn: "ডায়াগনস্টিক রান করুন",
      aiStatus: "গার্ডিয়ান সিকিউরিটি কাউন্সেল",
      aiPlaceholder: "নীচের 'ডায়াগনস্টিক রান করুন' এ ক্লিক করুন। জেমিনি ইঞ্জিন আপনার লেজার বিশ্লেষণ করে কৌশলগত সতর্কতা এবং সামগ্রিক বাজেট টিপস প্রদান করবে।",
      form: {
        title: "লেনদেনের হিসাব নথিবদ্ধ করুন",
        type: "অর্থ প্রবাহের ধরণ",
        income: "আয় (+) / সম্পদ বৃদ্ধি",
        expense: "ব্যয় (-) / উপাদান গত খরচ",
        amount: "লেনদেনের পরিমাণ (৳)",
        category: "সম্পদ শ্রেণীবিভাগ",
        notes: "যাচাইকরণ নোট",
        submit: "নিশ্চিত করুন",
        cancel: "বাতিল"
      },
      headers: {
        date: "তারিখ ও সময়",
        type: "ধরণ",
        cat: "বিভাগ",
        val: "পরিমাণ (৳)",
        notes: "নোট",
        act: "পদক্ষেপ"
      },
      empty: "এই ডিভাইসে এখনও কোনো লেনদেনের হিসাব লিপিবদ্ধ করা হয়নি।",
      chartsTitle: "রিয়েল-টাইম অপারেশনাল গ্রাফ ও পরিসংখ্যান বিশ্লেষণ",
      growthTab: "আর্থিক প্রবৃদ্ধির চার্ট",
      comparisonTab: "আয় বনাম ব্যয় তুলনা",
      distributionTab: "শ্রেণী ভিত্তিক ব্যয় বন্টন",
      analyzing: "গার্ডিয়ান মডেল বিশ্লেষণ করছে..."
    }
  }[language];

  const handleDiagnose = async () => {
    setAiLoading(true);
    setAiReport('');
    try {
      const res = await fetch('/api/gemini/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, language })
      });
      const data = await res.json();
      setAiReport(data.text || data.error);
    } catch (err: any) {
      setAiReport(`Failing to connect to server backend. Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const moneyStr = amount.trim();
    if (!moneyStr || isNaN(Number(moneyStr))) return;

    onAddTransaction({
      type,
      category,
      amount: Math.abs(Number(moneyStr)),
      dateTime: date,
      notes: notes.trim()
    });

    setAmount('');
    setNotes('');
    setShowAddForm(false);
  };

  // Math aggregates
  const rawIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const rawExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netCash = rawIncome - rawExpense;

  // Preparing Recharts Datasets
  // 1: Area line chart: Cumulative growth over time
  const getGrowthData = () => {
    let balance = 0;
    const sorted = [...transactions].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    return sorted.map(t => {
      const effect = t.type === 'income' ? t.amount : -t.amount;
      balance += effect;
      return {
        date: t.dateTime,
        'Reserve Balance': balance
      };
    });
  };

  // 2: Inflow vs Outflow comparisons
  const getComparisonData = () => {
    return [
      { name: language === 'bn' ? 'আয়' : 'Inflow', BDT: rawIncome, fill: '#10b981' },
      { name: language === 'bn' ? 'ব্যয়' : 'Outflow', BDT: rawExpense, fill: '#f43f5e' }
    ];
  };

  // 3: Expenses split inside a lovely Pie chart slice
  const getCategoryRatio = () => {
    const expensesGroup = transactions.filter(t => t.type === 'expense');
    const mapping: Record<string, number> = {};
    expensesGroup.forEach(t => {
      mapping[t.category] = (mapping[t.category] || 0) + t.amount;
    });
    return Object.keys(mapping).map(cat => ({
      name: cat,
      value: mapping[cat]
    }));
  };

  const CHART_PALETTE = ['#f97316', '#22d3ee', '#a855f7', '#10b981', '#3b82f6', '#ec4899', '#eab308', '#64748b'];

  return (
    <div className="space-y-6 pb-20 select-none">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-lg shadow-orange-950/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#22d3ee] uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            {t.title}
          </span>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide mt-1">
            {language === 'bn' ? 'অপারেশনাল বাজেট কন্ট্রোল' : 'Operating Cost Terminal'}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {t.tagline}
          </p>
        </div>

        <div className="flex gap-2.5 mt-4 sm:mt-0 flex-wrap">
          <button
            onClick={onRawExportExcel}
            className="px-4 py-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            {t.exportBtn}
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-orange-950/35 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t.newLog}
          </button>
        </div>
      </div>

      {/* Aggregate Balance Cards widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-xs font-mono text-slate-400 block">{t.totalIn}</span>
          <span className="text-2xl font-black text-emerald-400 block mt-1 tracking-tight font-mono">
            ৳{rawIncome.toLocaleString('en-US')}
          </span>
          <div className="absolute right-4 bottom-4 w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-xs font-mono text-slate-400 block">{t.totalOut}</span>
          <span className="text-2xl font-black text-rose-500 block mt-1 tracking-tight font-mono">
            ৳{rawExpense.toLocaleString('en-US')}
          </span>
          <div className="absolute right-4 bottom-4 w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-xs font-mono text-slate-400 block">{t.netReserve}</span>
          <span className="text-2xl font-black text-[#22d3ee] block mt-1 tracking-tight font-mono">
            ৳{netCash.toLocaleString('en-US')}
          </span>
          <div className="absolute right-4 bottom-4 w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics Displays Panels */}
      <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6">
        <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase mb-6 flex items-center gap-2">
          <AreaChart className="w-4.5 h-4.5 text-orange-500" />
          {t.chartsTitle}
        </h3>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-950/10 font-mono text-xs">
            {t.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Area growth graph */}
            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-850">
              <span className="text-xs font-bold text-slate-400 tracking-widest block mb-4 uppercase font-mono">
                {t.growthTab}
              </span>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getGrowthData()}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="Reserve Balance" stroke="#22d3ee" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income versus Expense block chart and slice distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-widest block mb-3 uppercase font-mono">
                    {t.comparisonTab}
                  </span>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getComparisonData()}>
                        <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="BDT" radius={[6, 6, 0, 0]}>
                          {getComparisonData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-widest block mb-3 uppercase font-mono">
                    {t.distributionTab}
                  </span>
                  {getCategoryRatio().length === 0 ? (
                    <div className="text-[10px] text-slate-500 font-mono py-10 text-center">No outflows cataloged</div>
                  ) : (
                    <div className="h-36 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCategoryRatio()}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={45}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {getCategoryRatio().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[9px] text-slate-400 font-mono">Slices</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Smart Diagnostics Advice Node */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 border border-cyan-500/15 rounded-3xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest">
              {t.aiStatus}
            </span>
          </div>
          <button
            onClick={handleDiagnose}
            disabled={aiLoading}
            className="px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 disabled:bg-slate-800 border border-cyan-500/20 disabled:border-slate-700 text-cyan-400 disabled:text-slate-500 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {aiLoading ? t.analyzing : t.aiDiagnoseBtn}
          </button>
        </div>

        <div className="min-h-24 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs leading-relaxed text-slate-300">
          {aiReport ? (
            <div className="whitespace-pre-wrap font-sans text-stone-200">
              {aiReport}
            </div>
          ) : (
            <span className="text-slate-550 block text-center font-mono py-6">
              {t.aiPlaceholder}
            </span>
          )}
        </div>
      </div>

      {/* Transaction History Logs */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ReceiptText className="w-4.5 h-4.5 text-cyan-400" />
            {t.logHistory}
          </h3>
          <span className="text-xs text-slate-450 font-mono">{transactions.length} Total</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-600 font-mono text-xs">
            {t.empty}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead>
                <tr className="border-b border-slate-800 pb-2 text-slate-450 uppercase text-[10px]">
                  <th className="py-3 px-2">{t.headers.date}</th>
                  <th className="py-3 px-2">{t.headers.type}</th>
                  <th className="py-3 px-2">{t.headers.cat}</th>
                  <th className="py-3 px-2">{t.headers.val}</th>
                  <th className="py-3 px-2">{t.headers.notes}</th>
                  <th className="py-3 px-2 text-right">{t.headers.act}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {transactions.map((tItem) => (
                  <tr key={tItem.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-3 px-2 text-slate-400">{tItem.dateTime}</td>
                    <td className="py-3 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tItem.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {tItem.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{tItem.category}</td>
                    <td className="py-3 px-2 font-black text-slate-100">৳{tItem.amount.toLocaleString('en-US')}</td>
                    <td className="py-3 px-2 text-slate-400 italic max-w-xs truncate">{tItem.notes || "-"}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onDeleteTransaction(tItem.id)}
                        className="p-1.5 rounded bg-rose-950/10 hover:bg-rose-950/30 text-rose-400 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Dialogue Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-orange-500" />
                {t.form.title}
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1.5 bg-slate-950 rounded-lg text-slate-550 border border-slate-850 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1.5">{t.form.type}</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-black transition-all cursor-pointer ${type === 'expense' ? 'bg-rose-500/20 text-rose-400 border-rose-500/35' : 'bg-slate-950/50 text-slate-500 border-slate-850 hover:bg-slate-900'}`}
                  >
                    {t.form.expense}
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-black transition-all cursor-pointer ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/35' : 'bg-slate-950/50 text-slate-500 border-slate-850 hover:bg-slate-900'}`}
                  >
                    {t.form.income}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.form.amount}</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-sm py-2 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.form.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono cursor-pointer"
                >
                  {CATEGORIES.map(categoryItem => (
                    <option key={categoryItem} value={categoryItem}>{categoryItem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2 px-3 rounded-lg text-slate-200 outline-none font-mono cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.form.notes}</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fuel reserves or drill gear purchase"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs text-slate-400 rounded-xl font-mono cursor-pointer"
                >
                  {t.form.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {t.form.submit}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
