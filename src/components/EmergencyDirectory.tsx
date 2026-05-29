import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Bookmark, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  ShieldAlert, 
  User, 
  CheckCircle2, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import { Helpline } from '../types';

interface EmergencyDirectoryProps {
  language: 'en' | 'bn';
  onCall: (phone: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

export function EmergencyDirectory({ language, onCall, isAdmin, setIsAdmin }: EmergencyDirectoryProps) {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fire' | 'police' | 'medical' | 'general'>('all');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Helpline | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formBanglaName, setFormBanglaName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formBanglaAddress, setFormBanglaAddress] = useState('');
  const [formCategory, setFormCategory] = useState<'fire' | 'police' | 'medical' | 'general'>('fire');

  const t = {
    en: {
      title: "EMERGENCY HELPLINES & FIRE DIRECTORY",
      tagline: "Synchronized offline-first fire station and security registries",
      searchPlaceholder: "Search by office name, district, or telephone...",
      categories: {
        all: "All Units",
        fire: "Fire Stations",
        police: "Police Units",
        medical: "Med-Care",
        general: "General Help"
      },
      addBtn: "Register Service",
      adminBanner: "SECURE CONSOLE CONTROL GRANTED (ADMIN)",
      userBanner: "OBSERVER ACCOUNT (Toggle Control below to ADD / EDIT records)",
      adminToggleOn: "Switch out of Admin Control",
      adminToggleOff: "Switch onto Admin Control",
      call: "Direct Hotline",
      bookmark: "Offline Bookmark",
      bookmarked: "Bookmarked Active",
      deleteConfirm: "Are you sure you want to purge this record?",
      empty: "No synchronized directories in current grid range.",
      formTitle: "Register Service Station Node",
      formEditTitle: "Modify Emergency Node Parameters",
      name: "Operating Station Name (English)",
      bname: "Operating Station Name (Bangla)",
      phone: "Hotline Telephone Number",
      address: "District Geographic Address (English)",
      baddress: "District Geographic Address (Bangla)",
      category: "Service Classification",
      cancel: "Abort Operation",
      save: "Encrypt & Publish",
      successMsg: "Operations successful. Directory synchronized."
    },
    bn: {
      title: "জরুরি হেল্পলাইন ও ফায়ার ডিরেক্টরি",
      tagline: "সিঙ্ক্রোনাইজড অফলাইন-ফার্স্ট ফায়ার স্টেশন এবং নিরাপত্তা রেজিস্ট্রি",
      searchPlaceholder: "অফিস, জেলা বা টেলিফোন নম্বর দিয়ে খুঁজুন...",
      categories: {
        all: "সকল ইউনিট",
        fire: "ফায়ার স্টেশন",
        police: "পুলিশ ইউনিট",
        medical: "চিকিৎসা সেবা",
        general: "সাধারণ সেবা"
      },
      addBtn: "নতুন সার্ভিস যুক্ত করুন",
      adminBanner: "নিরাপদ কনসোল নিয়ন্ত্রণ সক্রিয় করা হয়েছে (এডমিন)",
      userBanner: "পর্যবেক্ষক অ্যাকাউন্ট (এডমিন ফিচার পরীক্ষা করতে নিচের বাটনে চাপ দিন)",
      adminToggleOn: "সাধারণ মোডে পরিবর্তন করুন",
      adminToggleOff: "এডমিন মোডে পরিবর্তন করুন",
      call: "সরাসরি কল",
      bookmark: "অফলাইন বুকমার্ক",
      bookmarked: "বুকমার্ক সফল",
      deleteConfirm: "আপনি কি নিশ্চিতভাবে এই রেকর্ডটি মুছে ফেলতে চান?",
      empty: "গ্রিড পরিসরে কোনো সন্ধান মেলেনি।",
      formTitle: "নতুন কন্ট্যাক্ট স্টেশন নথিভুক্ত করুন",
      formEditTitle: "জরুরি কন্ট্যাক্ট স্টেশন সংশোধন করুন",
      name: "স্টেশনের নাম (ইংরেজি)",
      bname: "স্টেশনের নাম (বাংলা)",
      phone: "টেলিফোন হটলাইন নম্বর",
      address: "ভৌগোলিক ঠিকানা (ইংরেজি)",
      baddress: "ভৌগোলিক ঠিকানা (বাংলা)",
      category: "সেবার শ্রেণীবিভাগ",
      cancel: "বাতিল করুন",
      save: "সংরক্ষণ ও ড্রিল করুন",
      successMsg: "ডিরেক্টরি সফলভাবে সিঙ্ক্রোনাইজ করা হয়েছে।"
    }
  }[language];

  useEffect(() => {
    // Load local offline bookmarks from localstorage
    const savedBookmarks = localStorage.getItem('fire_protection_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/helplines');
      const data = await res.json();
      setHelplines(data);
    } catch (err) {
      console.error("Local database sync offline query:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem('fire_protection_bookmarks', JSON.stringify(updated));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formAddress) return;

    const payload = {
      name: formName,
      banglaName: formBanglaName || formName,
      phone: formPhone,
      address: formAddress,
      banglaAddress: formBanglaAddress || formAddress,
      category: formCategory
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/helplines/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchHelplines();
      } else {
        const res = await fetch('/api/helplines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchHelplines();
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: Helpline) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormBanglaName(item.banglaName || '');
    setFormPhone(item.phone);
    setFormAddress(item.address);
    setFormBanglaAddress(item.banglaAddress || '');
    setFormCategory(item.category);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/helplines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHelplines(prev => prev.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormBanglaName('');
    setFormPhone('');
    setFormAddress('');
    setFormBanglaAddress('');
    setFormCategory('fire');
    setEditingItem(null);
    setShowAddModal(false);
  };

  // Filter listings
  const filteredListings = helplines.filter(item => {
    const isMatchedCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const isMatchedQuery = 
      item.name.toLowerCase().includes(query) ||
      (item.banglaName && item.banglaName.toLowerCase().includes(query)) ||
      item.phone.includes(query) ||
      item.address.toLowerCase().includes(query);
    return isMatchedCat && isMatchedQuery;
  });

  return (
    <div className="space-y-6 pb-20 select-none">
      
      {/* Upper Glass Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-lg shadow-orange-950/20">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#22d3ee] uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            {t.title}
          </span>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide mt-1">
            {language === 'bn' ? 'জরুরি সার্ভিস ডাটাবেজ' : 'Station Node Hub'}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {t.tagline}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-100 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-orange-950/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t.addBtn}
          </button>
        ) : (
          <div className="mt-4 sm:mt-0 p-2.5 bg-slate-950/60 border border-slate-800/50 rounded-2xl flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldAlert className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Read-only Mode</span>
          </div>
        )}
      </div>

      {/* Admin Privilege Simulated Bypass Module */}
      <div className="p-4 rounded-2xl bg-slate-900/25 border border-slate-800/60 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-slate-700'}`}></span>
          <span>{isAdmin ? t.adminBanner : t.userBanner}</span>
        </div>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${isAdmin ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-750' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}
        >
          {isAdmin ? t.adminToggleOn : t.adminToggleOff}
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(Object.keys(t.categories) as Array<keyof typeof t.categories>).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap border transition-all cursor-pointer ${selectedCategory === cat ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/15 text-orange-400 border-orange-500/40 shadow-sm shadow-orange-950/20' : 'bg-slate-900/30 hover:bg-slate-900/50 border-slate-850 text-slate-400'}`}
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-900/30 backdrop-blur-md border border-slate-800/80 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 text-sm py-3.5 pl-11 pr-4 rounded-2xl text-slate-200 outline-none transition-all placeholder:text-slate-650"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Helpline Node Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredListings.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
            <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <span className="text-xs font-mono">{t.empty}</span>
          </div>
        ) : (
          filteredListings.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div 
                key={item.id}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 relative overflow-hidden group hover:border-slate-700/80 transition-all flex flex-col justify-between"
              >
                {/* Visual Category Label Decorator */}
                <div className="absolute top-0 left-0 h-[2px] w-12 bg-orange-500/50"></div>

                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-widest ${item.category === 'fire' ? 'bg-red-500/10 text-red-400 border-red-500/20' : item.category === 'police' ? 'bg-cyan-500/10 text-cyan-404 border-cyan-500/20' : item.category === 'medical' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950/50 text-slate-400'}`}>
                      {item.category}
                    </span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isBookmarked ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-slate-950/50 border-slate-850 text-slate-550 hover:text-slate-350'}`}
                        title={t.bookmark}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-850 text-cyan-400 hover:bg-slate-900 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-950/40 text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-200 mt-3 leading-snug">
                    {language === 'bn' ? item.banglaName || item.name : item.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-550 shrink-0 mt-0.5" />
                    <span>{language === 'bn' ? item.banglaAddress || item.address : item.address}</span>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-850/50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-mono">HOTLINE PHONE</span>
                    <span className="text-sm font-black text-slate-300 font-mono mt-0.5">{item.phone}</span>
                  </div>
                  <button
                    onClick={() => onCall(item.phone)}
                    className="px-4 py-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-orange-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.call}</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Create or Modify Node Drawer Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative select-none">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">
                {editingItem ? t.formEditTitle : t.formTitle}
              </h3>
              <button 
                onClick={resetForm}
                className="p-1.5 bg-slate-950 rounded-lg text-slate-500 hover:text-slate-350 transition-colors border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.name}</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dhaka Headquarters"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.bname}</label>
                  <input
                    type="text"
                    value={formBanglaName}
                    onChange={(e) => setFormBanglaName(e.target.value)}
                    placeholder="যেমনঃ ঢাকা সদরদপ্তর"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.phone}</label>
                <input
                  type="text"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. +880173000..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.address}</label>
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. Sector 7, Uttara, Dhaka"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">{t.baddress}</label>
                  <input
                    type="text"
                    value={formBanglaAddress}
                    onChange={(e) => setFormBanglaAddress(e.target.value)}
                    placeholder="যেমনঃ সেক্টর ৭, উত্তরা, ঢাকা"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1">{t.category}</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-550 text-xs py-2.5 px-3 rounded-lg text-slate-200 outline-none font-mono cursor-pointer"
                >
                  <option value="fire">Fire Station</option>
                  <option value="police">Police Unit</option>
                  <option value="medical">Medical Facility</option>
                  <option value="general">Help Centers</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-xl font-mono cursor-pointer"
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

    </div>
  );
}
