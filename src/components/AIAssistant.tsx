import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Image as ImageIcon, 
  X, 
  AlertTriangle, 
  HelpCircle, 
  Zap, 
  FileText, 
  ShieldAlert,
  Loader2,
  Flame,
  Scale,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  language: 'en' | 'bn';
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string, imageMime?: string) => Promise<void>;
  onClearHistory: () => void;
}

export function AIAssistant({ language, chatHistory, onSendMessage, onClearHistory }: AIAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      title: "HUMAN SAFETY & LEGAL AID CENTER",
      tagline: "Consult smart AI safeguards for fire mitigation and statutory legal tenant/worker rights",
      placeholder: "Ask about safety gear, 2003 fire law, builder negligence, or LPG tips...",
      clearBtn: "Purge Session Chat",
      send: "Transmit Query",
      attechment: "Attach Image (PNG/JPEG)",
      noHistory: "Welcome to the Human Safety Console. Below is a beautifully arranged summary of critical topics in Fire Safety and Legal Aid. Select any item to instantly consult with Gemini AI or write a custom query below.",
      errorKey: "GEMINI_API_KEY could be unassigned on the server. Please define it in Settings > Secrets.",
      inputImageAlt: "Loaded safety diagram",
      fireSafetySection: "Fire Safety & Precautions (অগ্নি নিরাপত্তা)",
      legalSection: "Legal Aid & Action Rights (আইনি সহায়তা)",
      askAi: "Consult AI Assistance",
      lawTitle1: "Fire Prevention Act 2003",
      lawQuery1: "Specify the main penalties and instructions of the Bangladesh Fire Prevention Act 2003 for buildings operating without safety licenses or dual escape structures.",
      lawTitle2: "Labor Workplace Protection 2006",
      lawQuery2: "What does the Bangladesh Labor Act 2006 say about industrial fire escapes, mock safety drills, and worker compensation rights after accidental fires?",
      lawTitle3: "Tort Liability & Rent Rights",
      lawQuery3: "How can victims or tenants sue for negligence and claim monetary damage compensation against landlords or building builders under Bangladesh civil rent laws after an electrical fire?",
      fireTitle1: "LPG Storage & Soap Leak Test",
      fireQuery1: "Provide an engineering guide on kitchen safety, correct upright storage of gas canisters, and using soap-water for leak detection.",
      fireTitle2: "Circuit Overloads & Wire Gauge",
      fireQuery2: "Explain the visual and physical steps to detect home electrical circuit overloads, and recommended wire gauge and circuit breaker standards.",
      fireTitle3: "Evacuation Low Crawling Strategy",
      fireQuery3: "Detail low-crawl posture steps to escape carbon monoxide gas filled spaces, and the wet cotton towel mouth-seal protocol."
    },
    bn: {
      title: "মানবিক নিরাপত্তা ও আইনি সহায়তা",
      tagline: "অগ্নি নিরাপত্তা প্রটোকল এবং আইনি অধিকার বিশ্লেষণে নিয়োজিত জেমিনি মডেল",
      placeholder: "LPG গ্যাস সর্তকতা, ২০০৩ সালের আইন, বাড়িওয়ালার অবহেলা অথবা ওয়্যারিং নিয়ে লিখুন...",
      clearBtn: "চ্যাট ইতিহাস মুছুন",
      send: "জিজ্ঞাসা করুন",
      attechment: "ছবি যুক্ত করুন (PNG/JPEG)",
      noHistory: "মানবিক নিরাপত্তা কনসোলে আপনাকে স্বাগতম। নিচে অগ্নি নিরাপত্তা (Fire Safety) এবং আইনি সহায়তার (Legal Aid) বিষয়গুলো সুন্দর করে সাজানো আছে। যেকোনো পয়েন্টে ক্লিক করে সরাসরি Gemini AI এর সাথে আলোচনা করুন অথবা নিজে কাস্টম প্রশ্ন লিখুন।",
      errorKey: "GEMINI_API_KEY সার্ভারে সেট করা নেই। চ্যাট সচল করতে অনুগ্রহ করে Secrets সেটিংসে কী যোগ করুন।",
      inputImageAlt: "আপলোড করা সেফটি ডায়াগ্রাম",
      fireSafetySection: "অগ্নি নিরাপত্তা ও সর্তকতা (Fire Safety)",
      legalSection: "আইনি সহায়তা ও অধিকার (Legal Aid & Rights)",
      askAi: "সহায়তা নিন",
      lawTitle1: "অগ্নি প্রতিরোধ আইন ২০০৩ ও জরিমানা",
      lawQuery1: "অগ্নি প্রতিরোধ ও নির্বাপণ আইন ২০০৩ অনুসারে ফায়ার লাইসেন্স ছাড়া বহুতল ভবন পরিচালনা বা বিকল্প নিষ্কাশন ব্যবস্থা না রাখলে কী ধরনের জরিমানা ও কারাদণ্ড হতে পারে বিস্তারিত জানান।",
      lawTitle2: "শ্রম আইন ২০০৬ কর্মক্ষেত্রে নিরাপত্তা",
      lawQuery2: "বাংলাদেশ শ্রম আইন ২০০৬ এর বিধান অনুযায়ী কোনো কারখানায় অগ্নি মহড়া, দুর্ঘটনা প্রতিরোধক ব্যবস্থা এবং কর্মী হতাহতের অবহেলায় ক্ষতিপূরণ দাবির অধিকারগুলো আলোচনা করুন।",
      lawTitle3: "বাড়িওয়ালার অবহেলা ও ভাড়াটিয়ার অধিকার",
      lawQuery3: "কোনো ভবন মালিকের জরাজীর্ণ বৈদ্যুतिक সংযোগের কারণে অগ্নিকাণ্ড ঘটলে ভুক্তভোগী ভাড়াটিয়া দেওয়ানি আদালতে রিট ও মামলার মাধ্যমে ক্ষতিপূরণ বা ভাড়ার আইনি ব্যবহারের অধিকার কীভাবে পেতে পারেন?",
      fireTitle1: "এলপিজি ও সিলিন্ডার লিক পরীক্ষা",
      fireQuery1: "পারিবারিক রান্নাঘরে গ্যাস সিলিন্ডারের নিরাপদ দূরত্ব স্থাপন, গ্যাস হোস পাইপ পরীক্ষা এবং সাবান-পানির চমৎকার লিক ডিটেকশন পদ্ধতি বর্ণনা করুন।",
      fireTitle2: "বৈদ্যুতিক সকেট ওভারলোড ও সর্তকতা",
      fireQuery2: "মাল্টি প্লাগ ওভারলোডিং, জরাজীর্ণ তারের শর্ট সার্কিট ঝুঁকি চেনার লক্ষণ এবং বাড়িতে সার্কিট ব্রেকারের প্রোটোকল বিষয়ে বিস্তারিত গাইড দিন।",
      fireTitle3: "উদ্ধার ও জীবন রক্ষা প্রটোকল",
      fireQuery3: "আগুনের ধোঁয়ায় বিষাক্ত কার্বন মনোঅক্সাইড থেকে বাঁচতে হামাগুড়ি দিয়ে কুঁকড়ে চলা এবং ভিজে তোয়ালে দিয়ে মুখ ঢেকে শ্বাস রাখার বিজ্ঞানসম্মত উপায় বিশদ করুন।"
    }
  }[language];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert(language === 'bn' ? 'ফাইলের আকার ৪ মেগাবাইটের কম হতে হবে।' : 'File size must be under 4MB.');
        return;
      }
      setImageMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() && !selectedImage) return;

    setLoading(true);
    setInputText('');
    
    // Convert DataURL to raw Base64 if image exists
    let base64Data: string | undefined = undefined;
    if (selectedImage) {
      base64Data = selectedImage.split(',')[1];
    }

    // Reset attachments
    const imgBuffer = selectedImage;
    setSelectedImage(null);
    setImageMime(null);

    try {
      await onSendMessage(textToSend, base64Data, imageMime || undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (query: string) => {
    handleSend(query);
  };

  return (
    <div className="space-y-6 pb-20 select-none flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl relative overflow-hidden shrink-0 shadow-lg shadow-orange-950/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#22d3ee] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-404 animate-pulse" />
            {t.title}
          </span>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide mt-1">
            {language === 'bn' ? 'মানবিক নিরাপত্তা ও আইনি সহায়তা ডেস্ক' : 'Human Safety & Legal Aid Desk'}
          </h2>
          <p className="text-xs text-slate-404 font-mono mt-0.5">{t.tagline}</p>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="mt-4 sm:mt-0 px-3 py-1.5 bg-rose-950/25 hover:bg-rose-950/50 border border-rose-950/40 text-rose-450 hover:text-rose-400 rounded-xl text-xs font-mono transition-colors cursor-pointer"
          >
            {t.clearBtn}
          </button>
        )}
      </div>

      {/* Chat History Container */}
      <div className="flex-1 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 overflow-y-auto min-h-48 flex flex-col space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex-1 w-full max-w-4xl mx-auto py-4 px-2 space-y-6">
            
            {/* Header info card */}
            <div className="text-center space-y-2 p-5 bg-gradient-to-r from-slate-900/40 to-slate-950/20 border border-slate-800/60 rounded-3xl">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mx-auto font-sans">
                {t.noHistory}
              </p>
            </div>

            {/* Split Grid for beautifully arranging Fire Safety and Legal Aid topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              
              {/* FIRE SAFETY CATEGORY */}
              <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-5 space-y-4 flex flex-col">
                <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
                  <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 font-mono">
                    {t.fireSafetySection}
                  </h4>
                </div>

                <div className="space-y-3 flex-1">
                  <button
                    onClick={() => selectPreset(t.fireQuery1)}
                    className="w-full text-left p-3.5 rounded-2xl bg-black/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-red-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex flex-col gap-1 transition-all group cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-200 group-hover:text-red-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {t.fireTitle1}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {language === 'bn' ? "পারিবারিক সিলিন্ডার গ্যাস লিক চেকিং ও সাবান পানির টেস্ট গাইড।" : "Kitchen canister insulation, hose pipes and Soap-Water safety rules."}
                    </span>
                  </button>

                  <button
                    onClick={() => selectPreset(t.fireQuery2)}
                    className="w-full text-left p-3.5 rounded-2xl bg-black/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-red-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex flex-col gap-1 transition-all group cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-200 group-hover:text-red-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {t.fireTitle2}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {language === 'bn' ? "মাল্টি প্লাগ ওভারলোডিং, জরাজীর্ণ তারের শর্ট সার্কিট ঝুঁকি চেনার লক্ষণ এবং সার্কিট ব্রেকারের প্রোটোকল।" : "Flexible wire inspection, high volt appliance loads and breaker controls."}
                    </span>
                  </button>

                  <button
                    onClick={() => selectPreset(t.fireQuery3)}
                    className="w-full text-left p-3.5 rounded-2xl bg-black/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-red-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex flex-col gap-1 transition-all group cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-200 group-hover:text-red-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {t.fireTitle3}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {language === 'bn' ? "ঘন ধোঁয়ার কার্বন মনোক্সাইড থেকে জীবন বাঁচাতে হামাগুড়ি ও ভিজে তোয়ালে ব্যবহার।" : "Low crawling guidelines to escape fire buildings and wet cotton mouth protection."}
                    </span>
                  </button>
                </div>
              </div>

              {/* LEGAL AID CATEGORY */}
              <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-5 space-y-4 flex flex-col">
                <div className="flex items-center gap-2 pb-2 border-b border-cyan-500/20">
                  <Scale className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 font-mono">
                    {t.legalSection}
                  </h4>
                </div>

                <div className="space-y-3 flex-1">
                  <button
                    onClick={() => selectPreset(t.lawQuery1)}
                    className="w-full text-left p-3.5 rounded-2xl bg-black/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-cyan-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex flex-col gap-1 transition-all group cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-200 group-hover:text-cyan-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {t.lawTitle1}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {language === 'bn' ? "ফায়ার লাইসেন্স ও বহুতল ভবনের নিয়মাবলী লঙ্ঘন করলে অগ্নি প্রতিরোধ আইন ২০০৩ এর জরিমানা ও শাস্তি।" : "Penal codes & statutory directives for license violation under fire safety laws."}
                    </span>
                  </button>

                  <button
                    onClick={() => selectPreset(t.lawQuery2)}
                    className="w-full text-left p-3.5 rounded-2xl bg-black/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-cyan-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex flex-col gap-1 transition-all group cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-200 group-hover:text-cyan-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {t.lawTitle2}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {language === 'bn' ? "বাংলাদেশ শ্রম আইন ২০০৬ এর বিধান অনুযায়ী অগ্নিকাণ্ড মহড়া ও কারখানার অবহেলায় জীবনহানিতে ক্ষতিপূরণ দাবি।" : "Labor acts, safety drill specifications & compensation rules inside factories."}
                    </span>
                  </button>

                  <button
                    onClick={() => selectPreset(t.lawQuery3)}
                    className="w-full text-left p-3.5 rounded-2xl bg-black/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-cyan-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex flex-col gap-1 transition-all group cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-200 group-hover:text-cyan-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {t.lawTitle3}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {language === 'bn' ? "বাড়িওয়ালার অবহেলাজনিত নিম্নমানের ওয়্যারিং ও শর্ট সার্কিট থেকে অগ্নিকাণ্ডে ভাড়াটিয়ার ক্ষতিপূরণের আইনি অধিকার।" : "Tort litigation & tenant claims against construction failures or poor wiring."}
                    </span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((item) => {
              const isUser = item.role === 'user';
              return (
                <div 
                  key={item.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed border flex flex-col gap-2 ${isUser ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-205 rounded-tr-none' : 'bg-slate-900/40 border-slate-850 text-slate-200 rounded-tl-none'}`}>
                    
                    {/* Header indicator */}
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 text-[9px] font-mono text-slate-500">
                      {isUser ? (
                        <>
                          <User className="w-3 h-3 text-cyan-400" />
                          <span>AUTHORIZED OPERATOR</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-orange-400" />
                          <span>FIRE GUARDIAN SECURE OUTPUT</span>
                        </>
                      )}
                      <span className="ml-auto">{item.timestamp}</span>
                    </div>

                    {/* Image buffer preview inside text message if exist */}
                    {item.imageUrl && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-32 mb-1.5">
                        <img 
                          src={item.imageUrl} 
                          alt="Evidence Attachment Analysis" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Message Body Markdown rendered securely */}
                    <div className="whitespace-pre-wrap leading-relaxed font-sans">{item.text}</div>

                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/40 border border-slate-850 text-slate-300 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-xs font-mono">Decryption analysis in process...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* Input Composer Panel */}
      <div className="space-y-2 shrink-0 bg-slate-950/20 p-3 rounded-2xl border border-slate-900">
        
        {/* Attachment Thumbnail Previews */}
        {selectedImage && (
          <div className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-xl max-w-xs animate-pulse">
            <div className="relative w-12 h-12 rounded overflow-hidden border border-slate-800 shrink-0">
              <img src={selectedImage} alt={t.inputImageAlt} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] text-slate-300 font-mono truncate">Ready for Multimodal Check</span>
              <span className="block text-[8px] text-slate-500 font-mono">Attachment lock active</span>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                setImageMime(null);
              }}
              className="p-1 bg-slate-950 hover:bg-slate-850 rounded text-slate-400 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/30 text-cyan-400 rounded-xl transition-colors cursor-pointer"
            title={t.attechment}
          >
            <ImageIcon className="w-4.5 h-4.5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputText);
              }
            }}
            placeholder={t.placeholder}
            className="flex-1 bg-slate-900/30 border border-slate-850 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 text-xs py-3 px-4 rounded-xl text-slate-200 outline-none transition-all placeholder:text-slate-600"
          />

          <button
            onClick={() => handleSend(inputText)}
            disabled={(!inputText.trim() && !selectedImage) || loading}
            className="p-3 bg-gradient-to-r from-orange-600 to-red-604 hover:from-orange-500 hover:to-red-500 text-slate-100 disabled:bg-slate-850 disabled:from-transparent disabled:text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-lg shadow-orange-950/20"
            title={t.send}
          >
            <Send className="w-4.5 h-4.5" />
          </button>

        </div>
      </div>

    </div>
  );
}
