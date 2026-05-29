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
  Loader2
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
      title: "FIRE & LIFE SAFETY ADVISOR",
      tagline: "Intelligent Gemini model analyzing safety gear, LPG lines, & financial buffers",
      placeholder: "Ask about LPG storage, electrical safety checklists, or budget savings...",
      presetsTitle: "Quick Operational Presets",
      presets: [
        { label: "Check LPG canister safety setup guidelines", query: "What are the core safety protocols and distances for storing LPG gas canisters inside residential kitchen compartments in Bangladesh?" },
        { label: "Suggest fire safety gear checklist", query: "Suggest a comprehensive list of standard home safety tools, including detector alarms, water sprinkler specs, and safety fire blanket BDT estimates." },
        { label: "Analyze electrical wiring overload safety", query: "How do I check my home electrical lines for circuit overload hazards? What are the standard current tolerance ratios for copper conduit lines?" }
      ],
      clearBtn: "Purge Chat Log",
      send: "Transmit Query",
      attechment: "Attach Image (PNG/JPEG)",
      noHistory: "No encrypted conversation logs in current terminal memory. Ask Gemini anything or upload a file diagram to analyze safety risks.",
      errorKey: "GEMINI_API_KEY could be unassigned on the backend. Please declare it in Settings > Secrets.",
      inputImageAlt: "Loaded safety evidence diagram"
    },
    bn: {
      title: "অগ্নি ও জীবন সুরক্ষা পরামর্শক",
      tagline: "নিরাপত্তা সরঞ্জাম, এলপিজি ঝুঁকি এবং আইনি পরামর্শ বিশ্লেষণের জন্য জেমিনি মডেল",
      placeholder: "এলপিজি স্টোরেজ, বৈদ্যুতিক নিরাপত্তা, আইনি ব্যাকআপ বা বাজেট নিয়ে জিজ্ঞাসা করুন...",
      presetsTitle: "কুইক অপারেশনাল প্রেসেট সমূহ",
      presets: [
        { label: "এলপিজি গ্যাস সিলিন্ডার নিরাপত্তা নির্দেশিকা", query: "বাংলাদেশে আবাসিক রান্নাঘরে এলপিজি গ্যাস সিলিন্ডার নিরাপদে রাখার নিয়ম এবং অগ্নিনির্বাপক ব্যবস্থা কী হওয়া উচিত?" },
        { label: "অগ্নি নিরাপত্তা সরঞ্জামের তালিকা", query: "একটি আদেশ বাসাবাড়ির জন্য প্রয়োজনীয় অগ্নি নিরাপত্তা সরঞ্জামের তালিকা দিন, যার মধ্যে অ্যালার্ম এবং ফায়ার ব্ল্যাংকটের খরচ আনুমানিক ও সাধারণ বিডিটি বিবরণ থাকবে।" },
        { label: "বৈদ্যুতিক তারের ওভারলোড পরীক্ষা", query: "আমার ঘরের ইলেকট্রিকাল লাইনে ওভারলোড রিস্ক কীভাবে চেক করব? কপার মেটেরিয়ালের কারেন্ট ধারণ ক্ষমতা কেমন হওয়া দরকার?" }
      ],
      clearBtn: "চ্যাট লগ সাফ করুন",
      send: "জিজ্ঞাসা করুন",
      attechment: "ছবি যুক্ত করুন (PNG/JPEG)",
      noHistory: "এই ডিভাইসে এখনও কোনো বার্তা বিনিময় লগার সক্রিয় নেই। পরামর্শ পেতে প্রশ্ন করুন বা ঘরোয়া ডায়াগ্রাম আপলোড করুন।",
      errorKey: "GEMINI_API_KEY সার্ভারে সেট করা নেই। চ্যাট সচল করতে অনুগ্রহ করে Secrets সেটিংসে কী যোগ করুন।",
      inputImageAlt: "আপলোড করা সেফটি ডায়াগ্রাম"
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
            {language === 'bn' ? 'গার্ডিয়ান নিরাপত্তা বিশেষজ্ঞ' : 'Guardian Safe Assistant'}
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
          <div className="flex-1 flex flex-col justify-center items-center py-10 px-6 max-w-lg mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-xs font-mono text-slate-450 leading-relaxed">
              {t.noHistory}
            </p>

            {/* Presets */}
            <div className="w-full text-left pt-4 space-y-2 shrink-0">
              <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">{t.presetsTitle}</span>
              {t.presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(preset.query)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-900/20 hover:bg-slate-900/40 border border-slate-850 hover:border-cyan-500/30 text-xs text-slate-350 hover:text-slate-200 font-mono flex items-start gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{preset.label}</span>
                </button>
              ))}
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
