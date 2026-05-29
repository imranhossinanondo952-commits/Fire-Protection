import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Volume2, 
  Eye, 
  Activity, 
  MapPin, 
  Users,
  Flame,
  Zap,
  CheckCircle2,
  RotateCcw,
  Check,
  Lightbulb,
  BookOpen,
  Phone,
  Scale,
  Briefcase,
  Heart,
  FileText,
  Shield,
  PhoneCall,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement, Transaction } from '../types';

interface DashboardHomeProps {
  language: 'en' | 'bn';
  transactions: Transaction[];
  announcements: Announcement[];
  onQuickAdd: () => void;
  onNavigateTo: (tab: string) => void;
  user: { name: string; username: string; email: string; avatar: string };
  onCall: (phone: string) => void;
}

const libraryGuidesList = {
  fire: {
    titleEn: "Fire Prevention & Hazard Control",
    titleBn: "অগ্নি নিরাপত্তা ও সচেতনতা গাইড",
    subtitleEn: "7 critical rules to prevent household and kitchen fire outbreaks",
    subtitleBn: "অগ্নিকাণ্ড প্রতিরোধে ৭টি প্রধান নিয়মাবলী",
    color: "from-orange-500 to-red-650",
    shadow: "shadow-orange-950/25",
    items: [
      {
        id: "f1",
        titleEn: "Soap-Water Gas Test",
        titleBn: "সাবান-পানি গ্যাসের লাইন পরীক্ষা",
        descEn: "Brush all cylinders and gas hose joints with soap lather monthly. Expanding bubbles signal an active gas leak.",
        descBn: " canবিপদের সবচেয়ে বড় উৎস গ্যাস লিক। অন্তত মাসে একবার সাবান-পানির ফেনা দিয়ে হোস পাইপ ও রেগুলেটর সংযোগ পরীক্ষা করুন।"
      },
      {
        id: "f2",
        titleEn: "Avoid Sockets Overloading",
        titleBn: "বৈদ্যুতিক সকেট ওভারলোড এড়ানো",
        descEn: "Never plug high-wattage air conditioners, refrigerators, or microwave ovens concurrently on standard multi-plugs.",
        descBn: "একটি সকেট বা কমদামী মাল্টি-প্লাগে এসি, ফ্রিজ বা ওভেনের মতো হাই-ভোল্টেজ থার্মাল ডিভাইস কখনই একসাথে চালাবেন না।"
      },
      {
        id: "f3",
        titleEn: "Smoke Alarm Deployment",
        titleBn: "স্মোক অ্যালার্ম ও ডিটেক্টর স্থাপন",
        descEn: "Install smoke detectors near sleeping chambers. Battery-powered sensors emit sonic alerts during dark smolder phases.",
        descBn: "ঘুমানোর ঘর এবং ড্রয়িংরুমে স্বায়ত্তশাসিত স্মোক ডিটেক্টর অ্যালার্ম লাগিয়ে রাখুন, যা ধোঁয়া শনাক্ত করে তীব্র শব্দে সতর্কতা বাজায়।"
      },
      {
        id: "f4",
        titleEn: "Kitchen Oil Fires Strategy",
        titleBn: "তেল-চর্বিজনিত কড়াইয়ের আগুন",
        descEn: "Never throw cold water onto blazing kitchen oil pans. Hot grease vaporizes instantly, projecting dangerous fireball fronts.",
        descBn: "রন্ধন তেলের আগুনে কখনই পানি ছুড়বেন না। অতিরিক্ত বাষ্পীভবনে আগুন চারদিকে ছড়াবে। কড়াইটি ভেজা তোয়ালে দিয়ে চাপ দিন।"
      },
      {
        id: "f5",
        titleEn: "Regulator Nightly Shutoff",
        titleBn: "সিলিন্ডার রেগুলেটর রাতে বন্ধ করা",
        descEn: "Switch cylinder regulator lock knobs off before sleeping. Enable window cross-ventilation for 5 mins before match strikes.",
        descBn: "রাতে ঘুমানোর আগে বা বাইরে যাওয়ার পথে রেগুলেটর সুইচটি ম্যানুয়ালি বন্ধ করুন। সকালে চুলা জ্বালানোর ৫ মিনিট আগে জানালা খুলুন।"
      },
      {
        id: "f6",
        titleEn: "Extinguisher ABC Mounting",
        titleBn: "অগ্নিনির্বাপক যন্ত্রের পরিমিত ঝুলানো",
        descEn: "Keep standard dry chemical ABC extinguishers within 5 feet of floor height near high-risk stair corridors.",
        descBn: "মেঝে থেকে ৫ ফুট অবাধিক উচ্চতায় সিঁড়ির গোড়ায় অথবা ঘরের প্রবেশপথের কাছে সহজে ব্যবহারযোগ্য ফায়ার এক্সটিংগুইশার ঝুলিয়ে রাখুন।"
      },
      {
        id: "f7",
        titleEn: "Chemicals Isolation",
        titleBn: "দাহ্য কেমিক্যাল ও দ্রাবক দূরে রাখা",
        descEn: "Store paint thinners, petrol, and high-pressure aerosols sealed in cool, aerated compartments isolated from kitchen flames.",
        descBn: "রং কাটার থিনার, তারপিন তেল, পেট্রোল বা এরোসল স্প্রে ক্যান কখনই চুলার আশেপাশে রাখবেন না। এগুলো শীতল ও শুষ্ক কেবিনেটে রাখুন।"
      }
    ]
  },
  life: {
    titleEn: "Emergency Rescue & Life Safety",
    titleBn: "জীবন নিরাপত্তা ও উদ্ধার প্রটোকল",
    subtitleEn: "7 physical techniques and checks to safely escape burning complexes",
    subtitleBn: "বিপদের সময় জীবন বাঁচাতে ৭টি পরিমিত আচার-আচরণ",
    color: "from-cyan-500 to-emerald-600",
    shadow: "shadow-cyan-950/25",
    items: [
      {
        id: "l1",
        titleEn: "Low-Crawl Ground Escape",
        titleBn: "হামাগুড়ি দিয়ে মেঝে ঘেঁষে গমন",
        descEn: "Heated carbon dioxide and carbon monoxide float high. Cool, breathable oxygen layers settle 1 foot above flooring.",
        descBn: "গরম ধোঁয়া ও বিষাক্ত গ্যাস তীব্র বেগে উপরের দিকে ওঠে। মেঝের ১ ফুট ওপরের বাতাস তুলনামূলক বিশুদ্ধ থাকে, তাই কুঁকড়ে হামাগুড়ি দিন।"
      },
      {
        id: "l2",
        titleEn: "Wet Cotton Mouth-Seal",
        titleBn: "ভিজে সুতি কাপড় দিয়ে মুখাবরণ তৈরি",
        descEn: "Smoke inhalation triggers 80% of fire mortality. Place thick wet cloths over nostrils to intercept toxic micro-particles.",
        descBn: "বিষাক্ত রাসায়নিক ধোঁয়ার দমবন্ধের কারণে বেশি মানুষ মারা যান। এই কার্বন ফুসফুসে ঢোকা আটকাতে মুখ ভিজে সুতি তোয়ালে দিয়ে ঢেকে রাখুন।"
      },
      {
        id: "l3",
        titleEn: "Elevator Evacuation Prohibition",
        titleBn: "লিফট বা এলিভেটর ব্যবহার বন্ধ রাখা",
        descEn: "Do not venture into cargo/passenger elevators. Grid power blackouts trap occupants inside shaft gas chambers in seconds.",
        descBn: "অগ্নি দুর্ঘটনার মুহূর্ত থেকে কখনই লিফটে ঢুকবেন না। পাওয়ার শাটডাউন হলে আপনি ওখানেই চিরতরে আটকা পড়ে ধোঁয়ায় নিশ্বাস হারাবেন।"
      },
      {
        id: "l4",
        titleEn: "Hand-Back Door-Temp Scan",
        titleBn: "হাতের উল্টো পিঠ দরজা পরীক্ষা পদ্ধতি",
        descEn: "Never touch handles blindly. Use the back of your bare hand to scan frame heat before opening to prevent flash backfires.",
        descBn: "দরজা খোলার আগে সরাসরি হ্যান্ডেল ধরবেন না। হাতের উল্টো পিঠ দরজার ফ্রেমে ঠেকিয়ে গরম লাগলে বুঝুন ওপাশে জীবনঘাতী আগুন ও লাভা সক্রিয়।"
      },
      {
        id: "l5",
        titleEn: "Stop, Drop, and Roll Drill",
        titleBn: "শরীরে আগুন লাগলে গড়াগড়ি দেয়া",
        descEn: "Running fans flames with massive oxygen inflow. Instantly drop, cover eyes, and roll sideways to choke the fire.",
        descBn: "শরীরে বা কাপড়ে আগুন লাগলে কখনই দিশেহারা হয়ে দৌড়াবেন না। হাতের তালু দিয়ে মুখ ঢেকে সাথে সাথে মাটিতে শুয়ে ডানে-বামে গড়াগড়ি করুন।"
      },
      {
        id: "l6",
        titleEn: "Tap Water Thermal Care",
        titleBn: "ঝলসানো ত্বকে দীর্ঘ সময় পানির প্রয়োগ",
        descEn: "Pour fresh clean running tap water over burned flesh for 20 minutes onwards to cool target tissue. Avoid oil or toothpaste.",
        descBn: "আগুনের তাপ ত্বক দীর্ঘক্ষণ ড্যামেজ করে। তাই সাথে সাথে আক্রান্ত স্থানে অন্তত ২০ মিনিট ঠান্ডা পানি ঢালুন। টুথপেস্ট বা তুলা দেবেন না।"
      },
      {
        id: "l7",
        titleEn: "Prioritize Human Lives",
        titleBn: "সম্পদ উদ্ধারচেষ্টা সম্পূর্ণরূপে বর্জন",
        descEn: "Never return inside smoldering sectors for gold ornaments, hard drives, or currency bins. Human lives can never be replaced.",
        descBn: "দলিল বা অলংকার উদ্ধারের লোভে দাউ দাউ করা ঘরে পুনরায় ফিরে যাবেন না। জিনিসপত্র সংগ্রহে মাত্র ৫ সেকেন্ড নষ্ট করাও মৃত্যুর কারণ হতে পারে।"
      }
    ]
  },
  legal: {
    titleEn: "Legal Aid & Regulatory Compliance",
    titleBn: "আইনি সাহায্য ও ফায়ার সেফটি অধিকার",
    subtitleEn: "7 statutory guidelines on claims, developer liability and rights in Bangladesh",
    subtitleBn: "দুর্ঘটনায় আপনার আইনি নিরাপত্তা ও ক্ষতিপূরণ অধিকার",
    color: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-950/25",
    items: [
      {
        id: "lg1",
        titleEn: "Fire Prevention Act 2003 Rules",
        titleBn: "ফায়ার সার্ভিস আইন ২০০৩ ও দণ্ডাবলী",
        descEn: "Commercial buildings operating without dual escape layouts face up to 3 years imprisonment under the 2003 penal codes.",
        descBn: "২০০৩ সালের ফায়ার সার্ভিস ও অগ্নি প্রতিরোধ আইন অনুসারে প্রতিটি ভবনে বাধ্যতামুলক নিষ্কাশন ব্যবস্থা না রাখলে ৩ বছরের সাজার বিধান রয়েছে।"
      },
      {
        id: "lg2",
        titleEn: "Labor Safety Escape Outlets",
        titleBn: "শ্রম আইন ২০০৬ অনুযায়ী কারখানার বাধ্যবাধকতা",
        descEn: "Labor Act Section 61 enforces dual fire escapes and mock safety escape drills twice per year for facilities exceeding 50 workers.",
        descBn: "বাংলাদেশ শ্রম আইনের ৬১ ও ৬২ ধারা অনুযায়ী কমপক্ষে ৫০ জন কর্মরত কারখানায় বিকল্প ফায়ার গেট রাখা এবং বছরে ২ বার মহড়া দিতে হবে।"
      },
      {
        id: "lg3",
        titleEn: "Civil Damage Litigations",
        titleBn: "অবহেলাজনিত ক্ষতিপূরণ প্রাপ্তির আইনি দাবি",
        descEn: "Under Tort and civil trial frameworks, fire victims have strict claims to seek financial restitution from negligent landlords.",
        descBn: "ভবন মালিকের চূড়ান্ত গাফিলতি বা ত্রুটিযুক্ত লাইনের আগুনে স্বজনহারা হলে সিভিল কোর্টে রিট করে বা মামলা দিয়ে আর্থিক ক্ষতিপূরণ আদায়ের অধিকার রয়েছে।"
      },
      {
        id: "lg4",
        titleEn: "Good Samaritan Protection",
        titleBn: "স্বেচ্ছাসেবী উদ্ধারকারীদের আইনি রক্ষাকবচ",
        descEn: "Supreme Court mandates shield voluntary rescuers from arbitrary police harassment or civil suites for rescue operation impacts.",
        descBn: "উদ্ধারকাজ করতে গিয়ে কোন অনাকাঙ্ক্ষিত আঘাতে ভুক্তভোগীর জীবনহানি ঘটলেও স্বেচ্ছাসেবী উদ্ধারকারীদের নামে পুলিশ কোনো দেওয়ানি মামলা করতে পারবে না।"
      },
      {
        id: "lg5",
        titleEn: "Insurance Claims Documentation",
        titleBn: "অগ্নি বীমা দাবি প্রমাণের সঠিক পদ্ধতি",
        descEn: "Retain offsite cloud logs of asset ledgers, layout permits, and fire licenses to fast-track insurance settlements.",
        descBn: "বীমা দাবি প্রমাণ সহজ করতে ব্যবসার সম্পদ খতিয়ান, ফায়ার লাইসেন্স সার্টিফিকেট এবং নিরাপত্তা ড্রিল রিপোর্টের কপি অফসাইট ক্লাউড ড্রাইভে রাখুন।"
      },
      {
        id: "lg6",
        titleEn: "Tenancy Safety Rent Actions",
        titleBn: "ভাড়াটিয়ার নিরাপদ বৈদ্যুতিক তারের অধিকার",
        descEn: "Rent Control Rules empower tenants to demand landlords revamp precarious wire links, or legally withhold rent till repairs resolve.",
        descBn: "মেয়াদোত্তীর্ণ ঝুঁকিপূর্ণ তার পরিবর্তন করতে ভাড়াটিয়া বাড়িওয়ালাকে চিঠি দিতে পারেন। মেরামত না হওয়া পর্যন্ত ভাড়া স্থগিত রাখারও আইনি সুযোগ রয়েছে।"
      },
      {
        id: "lg7",
        titleEn: "Developer Professional Liability",
        titleBn: "বিল্ডিং কোড অমান্যে ডেভেলপারের শাস্তি",
        descEn: "Bangladesh National Building Code (BNBC) mandates severe criminal liability and license cancellation for structural fires caused by materials fraud.",
        descBn: "বিল্ডিং কোড (BNBC) বাইপাস করে নিম্নমানের অগ্নিনিরোধক রড-সিমেন্ট ব্যবহারের কারণে বড় দুর্ঘটনা ঘটলে নির্মাতা ডেভেলপার লাইসেন্স বাতিলের মুখে পড়বে।"
      }
    ]
  }
};

export function DashboardHome({ 
  language, 
  transactions, 
  announcements, 
  onQuickAdd, 
  onNavigateTo,
  user,
  onCall
}: DashboardHomeProps) {
  const [activeAnnIndex, setActiveAnnIndex] = useState(0);
  const [activeSafetyTab, setActiveSafetyTab] = useState<'lpg' | 'elec' | 'action' | 'gears'>('lpg');
  const [safetyChecklist, setSafetyChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fire_safety_dashboard_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeLibraryTab, setActiveLibraryTab] = useState<'fire' | 'life' | 'legal'>('fire');
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);

  const toggleSafetyCheck = (key: string) => {
    const updated = { ...safetyChecklist, [key]: !safetyChecklist[key] };
    setSafetyChecklist(updated);
    localStorage.setItem('fire_safety_dashboard_checklist', JSON.stringify(updated));
  };

  // Auto-scroll announcements carousel
  useEffect(() => {
    if (announcements.length === 0) return;
    const interval = setInterval(() => {
      setActiveAnnIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const text = {
    en: {
      salute: "Operator Dashboard",
      emergency_alert: "EMERGENCY BROADCAST",
      balance: "Real-time Net Balance",
      expenses: "Today's Operating Outflows",
      income: "Cumulative Safe Inflow",
      safety_index: "Terminal Integrity Index",
      quick_actions: "Tactical Control Shortcuts",
      action_direct: "View Helicopters & Helplines",
      action_budget: "Financial Audit Tracker",
      action_planner: "Safety Goal Target Boards",
      action_assistant: "Consult Safety Advisor",
      log_expense: "Add Income/Expense",
      empty_announcements: "Clear atmosphere. No emergency broadcasts active in range.",
      ann_prev: "Previous Notice",
      ann_next: "Next Notice",
      system_status: "SYSTEM SECURITY STATUS: SECURE",
      drill_indicator: "ACTIVE PROTECTIVE PROTOCOLS IN FIELD"
    },
    bn: {
      salute: "অপারেটর ড্যাশবোর্ড",
      emergency_alert: "জরুরি সতর্কতা বার্তা",
      balance: "রিয়েল-টাইম নেট ব্যালেন্স",
      expenses: "আজকের পরিচালন ব্যয়",
      income: "সঞ্চিত নিরাপদ প্রবাহ",
      safety_index: "টার্মিনাল সততা সূচক",
      quick_actions: "কৌশলগত নিয়ন্ত্রণ শর্টকাট",
      action_direct: "হেল্পলাইন ও থানাগুলো দেখুন",
      action_budget: "আর্থিক অডিট ট্র্যাকার",
      action_planner: "নিরাপত্তা লক্ষ্য বোর্ড",
      action_assistant: "নিরাপত্তা সহকারী পরামর্শ",
      log_expense: "আয়/ব্যয় যুক্ত করুন",
      empty_announcements: "পরিষ্কার বায়ুমণ্ডল। রেঞ্জে কোনো জরুরি সতর্কতা সক্রিয় নেই।",
      ann_prev: "আগের নোটিশ",
      ann_next: "পরের নোটিশ",
      system_status: "সিস্টেম নিরাপত্তা অবস্থা: সুরক্ষিত",
      drill_indicator: "মাঠে সক্রিয় প্রতিরক্ষামূলক প্রোটোকল রয়েছে"
    }
  };

  const t = text[language];

  const safetyData = {
    en: {
      deckTitle: "INTELLIGENT FIRE SAFETY DIRECTIVE",
      deckSubtitle: "Interactive Runbook & Household Vulnerability Audit",
      progressTitle: "Household Security Shield Rating",
      progressDesc: "Check off active items to increase your safe state rating",
      resetBtn: "Reset Checklist",
      tabs: {
        lpg: {
          label: "LPG & Kitchen",
          title: "LPG Gas Cylinder & Kitchen Care",
          desc: "Kitchen areas are the origin of ~73% of domestic fires. Follow strict isolation standards.",
          points: [
            "Maintain an upright visual placement of all gas cylinders on a flat, solid, dry surface.",
            "Always inspect the rubber hose (flexible pipe) for micro-cracks or hardening. Replace every 2 years.",
            "If soap-water bubbles verify any gas leakage, never power on lights or use open flames nearby."
          ],
          checks: [
            { id: "lpg_soap", text: "Verified gas connections using safe Soap-Water lather recently." },
            { id: "lpg_turnoff", text: "Regulator knob switched OFF every night or when away." },
            { id: "lpg_window", text: "Windows kept open for 5 minutes before lighting the burner matchstick." }
          ]
        },
        elec: {
          label: "Electrical Control",
          title: "Electrical Load & Fire Mitigation",
          desc: "Overloaded circuits and substandard wiring are major causes of severe industrial and domestic flashpoints.",
          points: [
            "Ensure a high-grade automatic Circuit Breaker (MCB) is operational at the main board.",
            "Disconnect heavy heating appliances (electric heaters, irons, geysers) immediately after use.",
            "Avoid running flexible electrical cords underneath carpets, mats, or heavy furniture units."
          ],
          checks: [
            { id: "elec_socket", text: "No multiple high-amp plugs forced into a single wall power socket." },
            { id: "elec_dust", text: "Power socket panels cleared of loose fibrous dust or grease layers." },
            { id: "elec_breaker", text: "Circuit breaker main switch checked for manual tripping capability." }
          ]
        },
        action: {
          label: "Emergency Response",
          title: "Critical Action Protocols During Fire",
          desc: "Seconds save lives. Internalizing evacuation layouts prevents panic-induced lockups.",
          points: [
            "Crawl low under toxic smoke. Cool air is located within 12-24 inches from the floor.",
            "Never use elevators. Elevators can become shafts trapping heat, smoke, or suddenly lose power.",
            "Prioritize human lives over retrieving financial documents. Evacuate immediately."
          ],
          checks: [
            { id: "action_knowpath", text: "Main egress exit doorway cleared of solid obstructions at all times." },
            { id: "action_num", text: "Essential direct dial-numbers of local fire services memorized." },
            { id: "action_route", text: "Participated in household or building drill evac paths." }
          ]
        },
        gears: {
          label: "Critical Armor",
          title: "Essential Fire Mitigation Equipment",
          desc: "Equipping standard gear converts small sparks into minor events instead of catastrophic casualties.",
          points: [
            "Install at least one ABC Dry Powder Fire Extinguisher near high-risk zones.",
            "Mount heavy cotton fire blankets inside kitchen workspaces for quick smothering of fat pans.",
            "Position a simple bucket of dry sand inside utility balconies or generator niches."
          ],
          checks: [
            { id: "gear_ext", text: "Portable dry-chemical Fire Extinguisher is charged and pressure dial is in Green zone." },
            { id: "gear_blanket", text: "Pure wool/heavy cotton blanket or Fire Blanket kept at hand in kitchen." },
            { id: "gear_sand", text: "At least one container/bucket of dry pure sand is kept prepared." }
          ]
        }
      }
    },
    bn: {
      deckTitle: "ইন্টেলিজেন্ট ফায়ার সেফটি ডেক",
      deckSubtitle: "ইন্টারেক্টিভ রানবুক এবং পারিবারিক ঝুঁকি নিরসন গাইড",
      progressTitle: "পারিবারিক নিরাপত্তা শিল্ড সূচক",
      progressDesc: "নিচে আপনার ঘরে উপস্থিত কার্যক্রমগুলো টিক দিন এবং নিরাপত্তা লেভেল বাড়িয়ে নিন",
      resetBtn: "চেকলিস্ট রিসেট করুন",
      tabs: {
        lpg: {
          label: "এলপিজি ও রান্নাঘর",
          title: "এলপিজি গ্যাস সিলিন্ডার ও রান্নাঘরের সতর্কতা",
          desc: "ঘরোয়া আগুনের প্রায় ৭৩% সূত্রপাত ঘটে রান্নাঘর থেকে। কঠোর বিচ্ছিন্নতা স্ট্যান্ডার্ড মেনে চলুন।",
          points: [
            "গ্যাস সিলিন্ডার সবসময় শক্ত, সমতল ও শুকনো জায়গায় খাড়া অবস্থায় (Upright) রাখুন।",
            "কখনও সিলিন্ডারকে রোদে বা আগুনের পাশে রাখবেন না এবং গ্যাস হোস পাইপ প্রতি ২ বছর পর পর পরিবর্তন করুন।",
            "গ্যাসের গন্ধ পেলে বা সাবান-পানির বুদবুদে লিক ধরা পড়লে বৈদ্যুতিক সুইচ অন/অফ করবেন না বা দিয়াশলাই জ্বালাবেন না।"
          ],
          checks: [
            { id: "lpg_soap", text: "আজকালকের মধ্যে সাবান-পানি ফেনা দিয়ে গ্যাস লিক চেক করেছি।" },
            { id: "lpg_turnoff", text: "রাতে ঘুমানোর আগে বা বাইরে যাওয়ার আগে রেগুলেটর বা চাবি অবশ্যই বন্ধ করি।" },
            { id: "lpg_window", text: "চুলা জ্বালানোর অন্তত ৫ মিনিট আগে রান্নাঘরের সব জানালা খুলে বাতাস চলাচল নিশ্চিত করি।" }
          ]
        },
        elec: {
          label: "বৈদ্যুতিক নিয়ন্ত্রণ",
          title: "বৈদ্যুতিক লোড ও অগ্নিঝুঁকি নিরসন",
          desc: "অতিরিক্ত বৈদ্যুতিক লোড বা অত্যন্ত পুরানো জরাজীর্ণ তারের ব্যবহার ফায়ার ফ্ল্যাশপয়েন্টের বড় কারণ।",
          points: [
            "মেইন বোর্ডে একটি ভালো মানের অটোমেটিক সার্কিট ব্রেকার (MCB) সচল রাখুন।",
            "উচ্চ বৈদ্যুতিক শক্তির সরঞ্জাম (যেমনঃ ইস্ত্রি, ওয়াটার হিটার, ওভেন) ব্যবহারের পর সাথে সাথে আনপ্লাগ করুন।",
            "কার্পেট, তোশক বা ভারী ফার্নিচারের নিচ দিয়ে কখনো এক্সটেনশন তার বা কানেক্টিং কেবল নেবেন না।"
          ],
          checks: [
            { id: "elec_socket", text: "একটি নির্দিষ্ট পাওয়ার সকেটে মাল্টি-প্লাগ সংযোগ দিয়ে অতিরিক্ত লোড দিই না।" },
            { id: "elec_dust", text: "বৈদ্যুতিক সকেট বা ডিস্ট্রিবিউশন বোর্ডের ওপর ধূলিকণা বা চর্বি জমতে দিই না।" },
            { id: "elec_breaker", text: "বাড়ির সার্কিট ব্রেকার বা মেইন স্যুইচ স্বাভাবিকভাবে ট্রিপ করে কি না সচলতা দেখেছি।" }
          ]
        },
        action: {
          label: "জরুরি পদক্ষেপ",
          title: "আগুন লাগলে তাৎক্ষণিক জীবন রক্ষাকারী নির্দেশাবলী",
          desc: "কয়েক সেকেন্ডের সিদ্ধান্ত জীবন ও ধ্বংসের মাঝে তফাৎ গড়ে দেয়। শান্ত থেকে সঠিক নিয়ম মেনে চলুন।",
          points: [
            "ঘন ধোঁয়ার মাঝে মাটির কাছাকাছি হামাগুড়ি দিয়ে বের হন; মেঝে থেকে ১২-২৪ ইঞ্চি ওপরে বিশুদ্ধ বাতাস থাকে।",
            "আগুনের সময় লিফট বা এলিভেটর ব্যবহার সম্পূর্ণ এড়িয়ে চলুন, এটি যেকোনো মুহূর্তে বিদ্যুৎ হারিয়ে বন্ধ হতে পারে।",
            "জরুরি অবস্থায় দামি জিনিসপত্র বা কাগজপত্র বাঁচানোর থেকে আগে নিজের ও পরিবারের সদস্যদের দ্রুত বের করুন।"
          ],
          checks: [
            { id: "action_knowpath", text: "বাড়ির প্রধান প্রবেশদ্বার ও সিঁড়ি সবসময় যেকোনো আসবাবপত্র বা জ্যাম থেকে মুক্ত রাখি।" },
            { id: "action_num", text: "৯৯৯ জরুরি হটলাইন নম্বর এবং স্থানীয় ফায়ার সার্ভিসের নম্বর আমার ফোনে সেভ করা আছে।" },
            { id: "action_route", text: "পরিবারের সবার সাথে জরুরি বহির্গমন রুট ও নিরাপদ স্থান সম্পর্কে আগে আলোচনা করেছি।" }
          ]
        },
        gears: {
          label: "সুরক্ষা সামগ্রী",
          title: "অগ্নি প্রতিরোধক প্রয়োজনীয় প্রধান সরঞ্জাম সমূহ",
          desc: "সঠিক সময়ে সঠিক সরঞ্জামের উপস্থিতি বড় ধরনের বিপর্যয়কে সাধারণ ঘটনায় রূপান্তর করতে পারে।",
          points: [
            "বাড়ির বা ব্যবসার ঝুঁকিপূর্ণ পয়েন্টগুলোতে কমপক্ষে একটি ABC ড্রাই পাউডার অগ্নিনির্বাপক যন্ত্র রাখুন।",
            "রান্নাঘরের আশেপাশে সহজলভ্য সুতির মোটা অগ্নিনিরোধক কম্বল (Fire Blanket) বা চাদর ঝুলিয়ে রাখুন।",
            "জেনারেটর রুম বা বারান্দায় ছোট বালতিতে শুকনা পরিষ্কার বালু ভর্তি করে প্রস্তুত রাখুন।"
          ],
          checks: [
            { id: "gear_ext", text: "পোর্টেবল ড্রাই-কেমিক্যাল এক্সটিংগুইশার সচল ও এর প্রেশার কাটা সবুজ জোনে অবস্থান করছে।" },
            { id: "gear_blanket", text: "রান্নাঘরে ব্যবহারের জন্য একটি মোটা সুতির কম্বল অথবা ফায়ার ব্ল্যাঙ্কেট হাতের কাছে প্রস্তুত রেখেছি।" },
            { id: "gear_sand", text: "বালতিতে অথবা প্লাস্টিক পাত্রে শুকনো পরিষ্কার বালু ভর্তি করে নির্দিষ্ট কোণায় রেখেছি।" }
          ]
        }
      }
    }
  };

  const sd = safetyData[language];
  const totalChecklistItems = 12; // 3 checks * 4 tabs
  const completedChecklistCount = Object.keys(safetyChecklist).filter(key => safetyChecklist[key]).length;
  const shieldScore = Math.round((completedChecklistCount / totalChecklistItems) * 100);

  const resetSafetyChecklist = () => {
    setSafetyChecklist({});
    localStorage.removeItem('fire_safety_dashboard_checklist');
  };

  const handleNextAnn = () => {
    if (announcements.length > 0) {
      setActiveAnnIndex((prev) => (prev + 1) % announcements.length);
    }
  };

  const handlePrevAnn = () => {
    if (announcements.length > 0) {
      setActiveAnnIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
    }
  };

  return (
    <div className="space-y-6 pb-20 select-none">
      
      {/* Upper Glass Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-lg shadow-orange-950/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
        
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse text-orange-500" />
            {t.salute}
          </span>
          <h2 className="text-2xl font-black text-slate-100 tracking-wide mt-1">
            {language === 'bn' ? `স্বাগতম, ${user.name}` : `Welcome back, ${user.name}`}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            UID: <span className="text-cyan-400">@{user.username}</span> | {t.system_status}
          </p>
        </div>

        <div className="flex gap-3 mt-4 sm:mt-0 items-center bg-slate-950/50 p-2 rounded-2xl border border-slate-800/80">
          <img 
            src={user.avatar} 
            alt="Profile Avatar" 
            className="w-10 h-10 rounded-xl object-cover border border-slate-700 hover:border-orange-500/50 transition-colors"
            referrerPolicy="no-referrer"
          />
          <div className="text-left hidden sm:block pr-2">
            <span className="block text-xs font-black text-slate-200">Active Node</span>
            <span className="block text-[10px] text-emerald-400 font-mono flex items-center gap-1 leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              CONNECTED
            </span>
          </div>
        </div>
      </div>

      {/* EMERGENCY PRIMARY HOTLINE TRUNK (জরুরি ৯৯৯ এবং ১০২ সংযোগ) */}
      <div className="bg-gradient-to-r from-red-950/20 via-orange-950/10 to-slate-900/10 border border-red-500/25 p-5 rounded-[28px] shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-650 to-orange-550 flex items-center justify-center text-slate-100 shadow-[0_0_15px_rgba(239,68,68,0.3)] shrink-0 animate-pulse">
            <PhoneCall className="w-6 h-6 text-red-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-widest animate-pulse">
                {language === 'bn' ? 'জরুরি হেল্পলাইন ট্রাঙ্ক' : 'EMERGENCY TRUNK HOTLINE'}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-100 mt-1 leading-snug">
              {language === 'bn' ? '১-ক্লিকে জরুরি হেল্পলাইন ডায়াল করুন (১০২ এবং ৯৯৯)' : 'One-press instant emergency support calling'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-lg">
              {language === 'bn' ? 'সরাসরি ফায়ার সার্ভিস (১০২) বা জাতীয় জরুরি সেবা কেন্দ্রে (৯৯৯) কল সংযোগ করতে নিচের নাম্বারে ক্লিক করুন।' : 'Directly establish critical telephone communication channels for swift incident response.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <button 
            onClick={() => onCall('999')}
            className="flex-1 md:flex-none py-3 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-slate-100 font-extrabold text-sm rounded-2xl border border-red-500/40 hover:scale-[1.03] active:scale-95 transition-all text-center flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/30 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-red-100 fill-current" />
            <div className="text-left font-sans">
              <div className="text-[8px] font-mono tracking-widest text-red-200 uppercase leading-none">NATIONAL</div>
              <div className="text-xs font-black leading-none mt-1">৯৯৯ (National Hub)</div>
            </div>
          </button>

          <button 
            onClick={() => onCall('102')}
            className="flex-1 md:flex-none py-3 px-6 bg-gradient-to-r from-red-800 to-red-650 hover:from-red-700 hover:to-red-550 text-slate-100 font-extrabold text-sm rounded-2xl border border-red-500/40 hover:scale-[1.03] active:scale-95 transition-all text-center flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/30 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-current" />
            <div className="text-left font-sans">
              <div className="text-[8px] font-mono tracking-widest text-red-200 uppercase leading-none">FIRE SERVICE</div>
              <div className="text-xs font-black leading-none mt-1">১০২ (Fire Hotline)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Announcements Slider Carousel */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-rose-950/40 rounded-3xl p-5 relative overflow-hidden shadow-lg shadow-rose-950/10">
        {/* Glow indicator */}
        <div className="absolute top-0 left-0 h-full w-[3px] bg-rose-500"></div>

        <div className="flex items-center justify-between mb-3 border-b border-slate-850 pb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4.5 h-4.5 text-rose-500 animate-bounce" />
            <span className="text-xs font-mono font-black text-rose-400 tracking-wider">
              {t.emergency_alert}
            </span>
          </div>
          {announcements.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={handlePrevAnn}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={t.ann_prev}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextAnn}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={t.ann_next}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="h-24 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {announcements.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full text-slate-400 text-xs font-mono"
              >
                {t.empty_announcements}
              </motion.div>
            ) : (
              announcements.map((ann, idx) => {
                if (idx !== activeAnnIndex) return null;
                const isEmergency = ann.type === 'emergency';
                return (
                  <motion.div
                    key={ann.id}
                    initial={{ opacity: 0, scale: 0.98, y: 3 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -3 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-center"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                        {isEmergency && <AlertTriangle className="w-4 h-4 text-orange-500 animate-pulse" />}
                        {language === 'bn' ? ann.titleBangla || ann.title : ann.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {language === 'bn' ? ann.bodyBangla || ann.body : ann.body}
                    </p>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Balanced and Expenses Dashboard Tracker Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Cash Reserve Balance Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                {t.balance}
              </p>
              <h3 className="text-3xl font-black text-slate-100 tracking-tight mt-1">
                ৳{netBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-800/50">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              {language === 'bn' ? 'মোট আয়' : 'Safe Net'}
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 ml-auto">
              <ArrowUpRight className="w-3.5 h-3.5" />
              100% Secure
            </div>
          </div>
        </div>

        {/* Operating Outflow expenses tracker */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                {t.expenses}
              </p>
              <h3 className="text-3xl font-black text-slate-100 tracking-tight mt-1">
                ৳{totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-550 mb-1">
                <span>Total Expenses Ratio</span>
                <span className="text-rose-400">
                  {totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}%
                </span>
              </div>
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety integrity indicator and drill gauges */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-slate-700/80 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                {t.safety_index}
              </p>
              <h3 className="text-3xl font-black text-slate-100 tracking-tight mt-1">
                98.7%
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            {t.drill_indicator}
          </p>
        </div>

      </div>

      {/* Control Actions & Navigation Grid shortcuts */}
      <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mt-8 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-orange-500" />
        {t.quick_actions}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Navigation to Emergency directories */}
        <button 
          onClick={() => onNavigateTo('directory')}
          className="bg-slate-900/30 hover:bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-orange-500/30 text-left p-5 rounded-3xl transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="block text-xs text-slate-400 font-mono uppercase tracking-wide">Emergency List</span>
          <span className="block text-sm font-black text-slate-200 mt-1 leading-snug">
            {t.action_direct}
          </span>
        </button>

        {/* Navigation to active budgets */}
        <button 
          onClick={() => onNavigateTo('budget')}
          className="bg-slate-900/30 hover:bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-cyan-500/30 text-left p-5 rounded-3xl transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="block text-xs text-slate-400 font-mono uppercase tracking-wide">Budget Audit</span>
          <span className="block text-sm font-black text-slate-200 mt-1 leading-snug">
            {t.action_budget}
          </span>
        </button>

        {/* Navigation to plans */}
        <button 
          onClick={() => onNavigateTo('planner')}
          className="bg-slate-900/30 hover:bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-emerald-500/30 text-left p-5 rounded-3xl transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="block text-xs text-slate-400 font-mono uppercase tracking-wide">Goal Plan</span>
          <span className="block text-sm font-black text-slate-200 mt-1 leading-snug">
            {t.action_planner}
          </span>
        </button>

        {/* Navigation to Safety Advisor */}
        <button 
          onClick={() => onNavigateTo('assistant')}
          className="bg-slate-900/30 hover:bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-purple-500/30 text-left p-5 rounded-3xl transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="block text-xs text-slate-400 font-mono uppercase tracking-wide font-black text-purple-450">Safety Advisor</span>
          <span className="block text-sm font-black text-slate-200 mt-1 leading-snug">
            {t.action_assistant}
          </span>
        </button>

      </div>

      {/* PROFESSIONAL FIRE SAFETY DECK (দ্বৈত ভাষার বিশদ গাইডলাইন ও অডিট) */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/45 backdrop-blur-xl border border-slate-800 rounded-[32px] p-6 shadow-xl relative overflow-hidden mt-8">
        {/* Abstract design blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6 mb-6">
          <div>
            <span className="text-xs font-mono font-black tracking-widest text-orange-500 uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              {sd.deckTitle}
            </span>
            <h3 className="text-xl font-extrabold text-slate-100 tracking-wide mt-1">
              {sd.deckSubtitle}
            </h3>
          </div>

          <div className="flex flex-col items-start md:items-end bg-slate-950/40 p-3 rounded-2xl border border-slate-800 max-w-sm w-full md:w-auto">
            <div className="flex justify-between w-full text-xs font-mono mb-1.5 text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                {sd.progressTitle}
              </span>
              <span className="text-cyan-400 font-bold">{shieldScore}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500" 
                style={{ width: `${shieldScore}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">{sd.progressDesc}</span>
          </div>
        </div>

        {/* Responsive Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(sd.tabs) as Array<'lpg' | 'elec' | 'action' | 'gears'>).map((tabKey) => {
            const tab = sd.tabs[tabKey];
            const isActive = activeSafetyTab === tabKey;
            
            // Icon mapping helper
            const getTabIcon = (key: string) => {
              switch (key) {
                case 'lpg': return <Flame className="w-4 h-4 text-orange-500" />;
                case 'elec': return <Zap className="w-4 h-4 text-yellow-500" />;
                case 'action': return <AlertTriangle className="w-4 h-4 text-red-500" />;
                default: return <BookOpen className="w-4 h-4 text-cyan-500" />;
              }
            };

            return (
              <button
                key={tabKey}
                onClick={() => setActiveSafetyTab(tabKey)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-slate-100 shadow-lg shadow-orange-950/20' 
                    : 'bg-slate-950/50 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {getTabIcon(tabKey)}
                {tab.label}
              </button>
            );
          })}

          {completedChecklistCount > 0 && (
            <button
              onClick={resetSafetyChecklist}
              className="px-3 py-2.5 rounded-2xl text-xs font-bold font-mono bg-slate-950/30 hover:bg-slate-950/50 border border-slate-850 hover:border-slate-800 text-slate-500 hover:text-slate-300 transition-colors ml-auto flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {sd.resetBtn}
            </button>
          )}
        </div>

        {/* Safety Tab Panel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Description & Safety Guidelines Runbook */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950/30 p-5 rounded-2xl border border-slate-800/60">
              <h4 className="text-base font-extrabold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                {sd.tabs[activeSafetyTab].title}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {sd.tabs[activeSafetyTab].desc}
              </p>
            </div>

            {/* Structured Guidelines List */}
            <div className="space-y-3">
              {sd.tabs[activeSafetyTab].points.map((point, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 bg-slate-950/15 p-3.5 rounded-2xl border border-slate-900 hover:border-orange-500/10 transition-colors group"
                >
                  <div className="mt-0.5 p-1.5 bg-orange-500/10 rounded-xl text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-mono text-orange-500 font-bold block">
                      {language === 'bn' ? `নির্দেশিকা ০${index + 1}` : `Guideline 0${index + 1}`}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5 font-medium font-sans">
                      {point}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Runbook Safety Checklist */}
          <div className="lg:col-span-5 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
                <CheckCircle2 className="w-4.5 h-4.5 text-cyan-400" />
                <span className="text-xs font-mono font-black text-slate-200 tracking-wide uppercase">
                  {language === 'bn' ? 'ব্যক্তিগত অডিট চেকলিস্ট' : 'Self-Audit Runbook'}
                </span>
              </div>

              {/* Checklist list */}
              <div className="space-y-3">
                {sd.tabs[activeSafetyTab].checks.map((item) => {
                  const isChecked = !!safetyChecklist[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleSafetyCheck(item.id)}
                      className="w-full text-left flex items-start gap-2.5 bg-slate-900/30 hover:bg-slate-900/50 p-3 rounded-xl border border-slate-850 hover:border-slate-800 transition-all group cursor-pointer"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                        isChecked 
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 border-transparent text-slate-950' 
                          : 'border-slate-700 bg-slate-950 text-transparent group-hover:border-slate-500'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={`text-[11px] leading-relaxed transition-colors font-sans ${
                        isChecked ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-300'
                      }`}>
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick footer helper */}
            <div className="mt-6 pt-4 border-t border-slate-900 text-center">
              <span className="text-[10px] font-mono text-slate-500">
                {language === 'bn' 
                  ? 'নিরাপদ জীবন গড়তে প্রতিটি প্রটোকল নিয়মিত চর্চা করুন।' 
                  : 'Practice safety standards. Seconds save lives.'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* UNIVERSAL SAFETY & LEGAL PORTAL (অগ্নি, জীবন ও আইনি নিরাপত্তা পোর্টাল) */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/45 backdrop-blur-xl border border-slate-800 rounded-[32px] p-6 shadow-xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Block with Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'bn' ? 'সমন্বিত নিরাপত্তা ও লিগ্যাল এইড পোর্টাল' : 'SOCIETY CRITICAL COMPLIANCE'}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
              {language === 'bn' ? 'জীবন, ফায়ার ও আইনি নিরাপত্তা নির্দেশিকা' : 'Life, Fire & Legal Safety Library'}
            </h3>
            <p className="text-xs text-slate-404 mt-1 max-w-2xl">
              {language === 'bn' ? 'অগ্নিকাণ্ড প্রতিরোধ, জীবন রক্ষা এবং বাংলাদেশের প্রচলিত আইন ও ক্ষতিপূরণ সংক্রান্ত ২১টি গুরুত্বপূর্ণ নির্দেশনাবলী নিচের ট্যাবগুলো থেকে দেখে নিন।' : '21 comprehensive, actionable rules and legal guidelines designed for safety assurance and statutory liabilities.'}
            </p>
          </div>
          
          {/* Statistics counter */}
          <div className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 font-mono text-xs w-full md:w-auto">
            <div className="text-center px-2">
              <span className="block text-purple-400 font-bold text-lg">21</span>
              <span className="text-[9px] text-slate-500 uppercase">{language === 'bn' ? 'প্রধান পয়েন্ট' : 'Guidelines'}</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <div className="text-center px-2">
              <span className="block text-emerald-400 font-bold text-lg">3</span>
              <span className="text-[9px] text-slate-500 uppercase">{language === 'bn' ? 'প্রধান ক্যাটাগরি' : 'Categories'}</span>
            </div>
          </div>
        </div>

        {/* Tab Selection Switches */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveLibraryTab('fire')}
            className={`px-4 py-3 rounded-2xl text-xs font-black font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
              activeLibraryTab === 'fire' 
                ? 'bg-gradient-to-r from-orange-600 to-red-650 text-slate-100 border-transparent shadow-lg shadow-orange-950/20' 
                : 'bg-slate-950/50 hover:bg-slate-900/50 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{language === 'bn' ? 'অগ্নি নিরাপত্তা ও সচেতনতা (Fire Safety)' : 'Fire Safety'}</span>
          </button>

          <button
            onClick={() => setActiveLibraryTab('life')}
            className={`px-4 py-3 rounded-2xl text-xs font-black font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
              activeLibraryTab === 'life' 
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-slate-100 border-transparent shadow-lg shadow-cyan-950/20' 
                : 'bg-slate-950/50 hover:bg-slate-900/50 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-500" />
            <span>{language === 'bn' ? 'জীবন বাঁচানোর প্রটোকল (Life Safety)' : 'Life Safety'}</span>
          </button>

          <button
            onClick={() => setActiveLibraryTab('legal')}
            className={`px-4 py-3 rounded-2xl text-xs font-black font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
              activeLibraryTab === 'legal' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-slate-100 border-transparent shadow-lg shadow-purple-950/20' 
                : 'bg-slate-950/50 hover:bg-slate-900/50 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4 text-purple-400" />
            <span>{language === 'bn' ? 'আইনি নিরাপত্তা ও অধিকার (Legal Rights)' : 'Legal & Claims'}</span>
          </button>
        </div>

        {/* Category Description Banner */}
        <div className="bg-slate-950/30 border border-slate-800/50 p-4 rounded-2xl mb-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-bold block">
              {language === 'bn' ? 'নির্দেশিকা সেকশন তথ্যচিত্র' : 'CURRENT OPERATIONAL COMPASS'}
            </span>
            <h4 className="text-base font-extrabold text-slate-100 mt-1">
              {libraryGuidesList[activeLibraryTab][language === 'bn' ? 'titleBn' : 'titleEn']}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {libraryGuidesList[activeLibraryTab][language === 'bn' ? 'subtitleBn' : 'subtitleEn']}
            </p>
          </div>
          <span className="text-[10px] uppercase font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 px-3 py-1.5 rounded-xl font-bold">
            {language === 'bn' ? '৭টি সুনির্দিষ্ট পয়েন্ট লোড করা হয়েছে' : '7 critical nodes loaded'}
          </span>
        </div>

        {/* GUIDES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {libraryGuidesList[activeLibraryTab].items.map((guide, idx) => {
            const getGuideIcon = (tab: string, itemIdx: number) => {
              if (tab === 'fire') {
                if (itemIdx === 0) return <Flame className="w-5 h-5 text-orange-400" />;
                if (itemIdx === 1) return <Zap className="w-5 h-5 text-yellow-500" />;
                if (itemIdx === 2) return <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse" />;
                if (itemIdx === 3) return <AlertTriangle className="w-5 h-5 text-red-500" />;
                if (itemIdx === 4) return <CheckCircle2 className="w-5 h-5 text-green-400" />;
                if (itemIdx === 5) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
                return <Lightbulb className="w-5 h-5 text-orange-300" />;
              } else if (tab === 'life') {
                if (itemIdx === 0) return <Activity className="w-5 h-5 text-cyan-400" />;
                if (itemIdx === 1) return <ShieldAlert className="w-5 h-5 text-teal-400" />;
                if (itemIdx === 2) return <Users className="w-5 h-5 text-rose-400" />;
                if (itemIdx === 3) return <MapPin className="w-5 h-5 text-emerald-400" />;
                if (itemIdx === 4) return <RotateCcw className="w-5 h-5 text-yellow-400" />;
                if (itemIdx === 5) return <Heart className="w-5 h-5 text-red-500 animate-pulse" />;
                return <CheckCircle2 className="w-5 h-5 text-green-400" />;
              } else {
                if (itemIdx === 0) return <Scale className="w-5 h-5 text-purple-400" />;
                if (itemIdx === 1) return <Briefcase className="w-5 h-5 text-indigo-400" />;
                if (itemIdx === 2) return <FileText className="w-5 h-5 text-amber-500" />;
                if (itemIdx === 3) return <Shield className="w-5 h-5 text-cyan-400" />;
                if (itemIdx === 4) return <Users className="w-5 h-5 text-pink-400" />;
                if (itemIdx === 5) return <ShieldAlert className="w-5 h-5 text-sky-400" />;
                return <MapPin className="w-5 h-5 text-emerald-450" />;
              }
            };

            return (
              <motion.div
                key={guide.id}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setSelectedGuide(guide)}
                className="bg-slate-950/45 hover:bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl relative overflow-hidden shadow-lg transition-all group flex flex-col justify-between cursor-pointer text-left"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${libraryGuidesList[activeLibraryTab].color} opacity-[0.02] rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity`} />
                
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-900 pb-2">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                      {getGuideIcon(activeLibraryTab, idx)}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest bg-slate-1000 px-2 py-0.5 rounded-md border border-slate-900">
                      NODE {idx + 1}
                    </span>
                  </div>

                  <h5 className="text-sm font-black text-slate-100 group-hover:text-cyan-400 transition-colors tracking-wide leading-snug">
                    {language === 'bn' ? guide.titleBn : guide.titleEn}
                  </h5>
                  
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {language === 'bn' ? guide.descBn : guide.descEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-900/40 text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    {language === 'bn' ? 'বিস্তারিত দেখতে ট্যাপ করুন' : 'Click to read details'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-650 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DETAILED DIALOG MODAL OVERLAY SHEET */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-950 border border-slate-800 rounded-[32px] p-6 max-w-lg w-full relative shadow-2xl overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-cyan-500 to-purple-500" />
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 p-1 rounded-xl bg-slate-900 hover:bg-slate-805 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Close guide details modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-4 mt-2 text-left">
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-2xl text-cyan-400">
                  <Shield className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase block">
                    {language === 'bn' ? 'নিরাপত্তা ও আইনি অডিট গাইডলাইন' : 'CRITICAL SAFETY & LAWS TRUNK'}
                  </span>
                  <h4 className="text-lg font-black text-slate-100 tracking-wide mt-0.5">
                    {language === 'bn' ? selectedGuide.titleBn : selectedGuide.titleEn}
                  </h4>
                </div>
              </div>

              <div className="space-y-4 my-6 bg-slate-900/40 p-5 rounded-2xl border border-slate-850 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-orange-400 uppercase block">
                    {language === 'bn' ? 'কার্যকরী নির্দেশিকা (বাংলা):' : 'BENGALI INSTRUCTION:'}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {selectedGuide.descBn}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-slate-800" />

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">
                    {language === 'bn' ? 'English Version (ইংরেজি সংস্করণ):' : 'ENGLISH INSTRUCTION:'}
                  </span>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    {selectedGuide.descEn}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-900 font-mono text-[9px] text-slate-500">
                <span>{language === 'bn' ? 'সুরক্ষিত নিরাপত্তা নেটওয়ার্ক' : 'FIRE PROTECTION SYSTEM v2.0'}</span>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-bold uppercase rounded-xl text-[10px] text-slate-100 transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
                >
                  OK, {language === 'bn' ? 'ঠিক আছে' : 'I Understand'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Immediate float action button for logging items */}
      <div className="fixed bottom-6 right-6 md:right-8 z-55 flex flex-col items-end gap-3">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={onQuickAdd}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 p-4 rounded-2xl text-slate-100 shadow-xl shadow-red-950/40 border border-orange-500/30 flex items-center gap-2 font-bold cursor-pointer relative group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          title={t.log_expense}
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-mono uppercase pr-1 hidden sm:inline">
            {t.log_expense}
          </span>
        </motion.button>
      </div>

    </div>
  );
}
