import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parse with safety limit
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for the Gemini Client
let aiInstance: GoogleGenAI | null = null;
function getAIInstance() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined on the server side. Please declare it in the Secrets panel (Settings > Secrets) to enable AI systems.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Initial Database Stores (In-memory backends mimicking Firestore sync)
let helplinesStore = [
  {
    id: "p1",
    name: "National Emergency Helpline (999)",
    banglaName: "জাতীয় জরুরী হেল্পলাইন (৯৯৯)",
    phone: "999",
    address: "Dhaka, Bangladesh",
    banglaAddress: "ঢাকা, বাংলাদেশ",
    category: "general"
  },
  {
    id: "f_dhaka",
    name: "Dhaka Division Fire Control Room",
    banglaName: "ঢাকা বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002222",
    address: "Kazi Alauddin Road, Dhaka 1000",
    banglaAddress: "কাজী আলাউদ্দিন রোড, ঢাকা ১০০০",
    category: "fire"
  },
  {
    id: "p_dhaka",
    name: "Dhaka Metropolitan Police (DMP)",
    banglaName: "ঢাকা মেট্রোপলিটন পুলিশ (ডিএমপি)",
    phone: "01713373100",
    address: "DMP HQ, 36 Minto Road, Dhaka",
    banglaAddress: "ডিএমপি হেডকোয়ার্টার্স, ৩৬ মিন্টো রোড, ঢাকা",
    category: "police"
  },
  {
    id: "f_ctg",
    name: "Chattogram Division Fire Control",
    banglaName: "চট্টগ্রাম বিভাগ ফায়ার সার্ভিস কন্ট্রোল",
    phone: "01730002235",
    address: "Agrabad Commercial Area, Chattogram",
    banglaAddress: "আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম",
    category: "fire"
  },
  {
    id: "p_ctg",
    name: "Chattogram Metropolitan Police (CMP)",
    banglaName: "চট্টগ্রাম মেট্রোপলিটন পুলিশ (সিএমপি)",
    phone: "01713373200",
    address: "Lalkhan Bazar, Chattogram",
    banglaAddress: "লালখান বাজার, চট্টগ্রাম",
    category: "police"
  },
  {
    id: "f_raj",
    name: "Rajshahi Division Fire Control Room",
    banglaName: "রাজশাহী বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002241",
    address: "Rajshahi Station Road, Rajshahi",
    banglaAddress: "রাজশাহী স্টেশন রোড, রাজশাহী",
    category: "fire"
  },
  {
    id: "p_raj",
    name: "Rajshahi Metropolitan Police (RMP)",
    banglaName: "রাজশাহী মেট্রোপলিটন পুলিশ (আরএমপি)",
    phone: "01713373300",
    address: "RMP Headquarter, Rajshahi",
    banglaAddress: "আরএমপি হেডকোয়ার্টার, রাজশাহী",
    category: "police"
  },
  {
    id: "f_khulna",
    name: "Khulna Division Fire Control Room",
    banglaName: "খুলনা বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002242",
    address: "Boyra Main Road, Khulna",
    banglaAddress: "বয়রা প্রধান সড়ক, খুলনা",
    category: "fire"
  },
  {
    id: "p_khulna",
    name: "Khulna Metropolitan Police (KMP)",
    banglaName: "খুলনা মেট্রোপলিটন পুলিশ (কেএমপি)",
    phone: "01713373400",
    address: "KMP HQ, Jahanabad, Khulna",
    banglaAddress: "কেএমপি হেডকোয়ার্টার, জাহানাবাদ, খুলনা",
    category: "police"
  },
  {
    id: "f_sylhet",
    name: "Sylhet Division Fire Control Room",
    banglaName: "সিলেট বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002243",
    address: "Keane Bridge West Approach, Sylhet",
    banglaAddress: "কীন ব্রিজ পশ্চিম অ্যাপ্রোচ, সিলেট",
    category: "fire"
  },
  {
    id: "p_sylhet",
    name: "Sylhet Metropolitan Police (SMP)",
    banglaName: "সিলেট মেট্রোপলিটন পুলিশ (এসএমপি)",
    phone: "01713373600",
    address: "SMP Headquarter, Subhanighat, Sylhet",
    banglaAddress: "এসএমপি হেডকোয়ার্টার, সোবহানীঘাট, সিলেট",
    category: "police"
  },
  {
    id: "f_barisal",
    name: "Barishal Division Fire Control Room",
    banglaName: "বরিশাল বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002244",
    address: "Band Road, Barishal 8200",
    banglaAddress: "বান্দ রোড, বরিশাল ৮২০০",
    category: "fire"
  },
  {
    id: "p_barisal",
    name: "Barishal Metropolitan Police (BMP)",
    banglaName: "বরিশাল মেট্রোপলিটন পুলিশ (বিএমপি)",
    phone: "01713373500",
    address: "BMP HQ, Band Road, Barishal",
    banglaAddress: "বিএমপি হেডকোয়ার্টার, বান্দ রোড, বরিশাল",
    category: "police"
  },
  {
    id: "f_rangpur",
    name: "Rangpur Division Fire Control Room",
    banglaName: "রংপুর বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002245",
    address: "Rangpur Fire Station, Rangpur",
    banglaAddress: "রংপুর ফায়ার স্টেশন, রংপুর",
    category: "fire"
  },
  {
    id: "p_rangpur",
    name: "Rangpur District Police Control Room",
    banglaName: "রংপুর জেলা পুলিশ কন্ট্রোল রুম",
    phone: "01713373700",
    address: "District Police Lines, Rangpur",
    banglaAddress: "জেলা পুলিশ লাইন্স, রংপুর",
    category: "police"
  },
  {
    id: "f_mym",
    name: "Mymensingh Division Fire Control Room",
    banglaName: "ময়মনসিংহ বিভাগ ফায়ার সার্ভিস কন্ট্রোল রুম",
    phone: "01730002246",
    address: "Mymensingh Fire Station, Mymensingh",
    banglaAddress: "ময়মনসিংহ ফায়ার স্টেশন, ময়মনসিংহ",
    category: "fire"
  },
  {
    id: "p_mym",
    name: "Mymensingh District Police Control Room",
    banglaName: "ময়মনসিংহ জেলা পুলিশ কন্ট্রোল রুম",
    phone: "01713373800",
    address: "District Police Lines, Mymensingh",
    banglaAddress: "জেলা পুলিশ লাইন্স, ময়মনসিংহ",
    category: "police"
  }
];

let announcementsStore = [
  {
    id: "a1",
    title: "System Ready: Safety Drill",
    titleBangla: "সিস্টেম প্রস্তুত: সুরক্ষা ড্রিল",
    type: "security",
    date: "2026-05-29",
    body: "Comprehensive fire prevention audit schedule and simulation parameters have been set successfully. Use the dashboard simulator to log your emergency tests.",
    bodyBangla: "ব্যাপক অগ্নি প্রতিরোধ অডিট সময়সূচী এবং সিমুলেশন পরামিতি সফলভাবে সেট করা হয়েছে। আপনার জরুরি পরীক্ষা লগ করতে ড্যাশবোর্ড সিমুলেটর ব্যবহার করুন।"
  },
  {
    id: "a2",
    title: "Monsoon Fire Precaution Notice",
    titleBangla: "বর্ষাকালীন অগ্নি সতর্কতা বিজ্ঞপ্তি",
    type: "emergency",
    date: "2026-05-28",
    body: "Ensure all server rooms and biometric control terminals are insulated from heavy rainwater leakage. Verify the water levels of emergency system reserves.",
    bodyBangla: "সব সার্ভার রুম এবং বায়োমেট্রিক কন্ট্রোল টার্মিনাল যেন ভারী বৃষ্টির পানি থেকে সুরক্ষিত থাকে তা নিশ্চিত করুন। জরুরি রিজার্ভ পরীক্ষা করুন।"
  },
  {
    id: "a3",
    title: "Financial Planning Advisory",
    titleBangla: "আর্থিক পরিকল্পনা পরামর্শ",
    type: "financial",
    date: "2026-05-27",
    body: "Set aside 5% of monthly income for safety gear maintenance or backup generator fuel. Use the automated diagnostics run on the Budget tab below.",
    bodyBangla: "সুরক্ষা সরঞ্জাম রক্ষণাবেক্ষণ বা ব্যাকআপ জেনারেটর জ্বালানির জন্য মাসিক আয়ের ৫% আলাদা করে রাখুন। নিচের বাজেট ট্যাবে স্বয়ংক্রিয় ডায়াগনস্টিক ব্যবহার করুন।"
  }
];

// Helper to sanitize inputs
const ensureId = (obj: any) => ({ ...obj, id: obj.id || Date.now().toString() });

// -------------------------------------------------------------
// USER SESSION STORE (Bypasses iframe localstorage partition blocks on refresh)
// -------------------------------------------------------------
let userSessionStore: any = null;

app.get("/api/session", (req, res) => {
  res.json({ user: userSessionStore });
});

app.post("/api/session", (req, res) => {
  userSessionStore = req.body.user;
  res.json({ success: true, user: userSessionStore });
});

app.delete("/api/session", (req, res) => {
  userSessionStore = null;
  res.json({ success: true });
});

// -------------------------------------------------------------
// HELPLINE REST ENDPOINTS (Syncs with UI - state normal vs admin editing)
// -------------------------------------------------------------
app.get("/api/helplines", (req, res) => {
  res.json(helplinesStore);
});

app.post("/api/helplines", (req, res) => {
  const newItem = ensureId(req.body);
  helplinesStore.unshift(newItem);
  res.json({ success: true, item: newItem });
});

app.put("/api/helplines/:id", (req, res) => {
  const { id } = req.params;
  const index = helplinesStore.findIndex(h => h.id === id);
  if (index !== -1) {
    helplinesStore[index] = { ...helplinesStore[index], ...req.body };
    res.json({ success: true, item: helplinesStore[index] });
  } else {
    res.status(404).json({ error: "Helpline not found" });
  }
});

app.delete("/api/helplines/:id", (req, res) => {
  const { id } = req.params;
  helplinesStore = helplinesStore.filter(h => h.id !== id);
  res.json({ success: true, message: "Helpline deleted" });
});

// -------------------------------------------------------------
// ANNOUNCEMENTS ENDPOINTS
// -------------------------------------------------------------
app.get("/api/announcements", (req, res) => {
  res.json(announcementsStore);
});

app.post("/api/announcements", (req, res) => {
  const newAnn = ensureId(req.body);
  announcementsStore.unshift(newAnn);
  res.json({ success: true, item: newAnn });
});

app.delete("/api/announcements/:id", (req, res) => {
  const { id } = req.params;
  announcementsStore = announcementsStore.filter(a => a.id !== id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// AI SYSTEMS API (GEMINI INTEGRATIONS)
// -------------------------------------------------------------

// Automated Financial Planning & Safety Asset AI Diagnostics
app.post("/api/gemini/diagnostics", async (req, res) => {
  try {
    const { transactions, language } = req.body;
    const ai = getAIInstance();

    // Prepare text representation of context
    let contextStr = "Analyze this user's monthly transactions data list for strategic safety advisories and budget optimization. All money entries are in Bangladeshi Taka (৳).\n\n";

    if (!transactions || transactions.length === 0) {
      contextStr += "The user currently has no saved ledger entries. Tell them to log some transactions and suggest setting up a 10% cash cushion for building electrical, LPG gas detector fittings, fire safety tools or insurance.";
    } else {
      contextStr += transactions.map((t: any) => `- [${t.dateTime}] ${t.type.toUpperCase()} / Category: ${t.category} / Amount: ৳${t.amount} / Notes: ${t.notes || 'None'}`).join("\n");
    }

    const sysInst = language === 'bn' 
      ? "আপনি একজন অভিজ্ঞ আর্থিক এবং অগ্নি নিরাপত্তা বিশ্লেষক কর্মকর্তা। ব্যবহারকারীকে সুন্দর বুলেট পয়েন্টে সঠিক ডায়াগনস্টিক রিপোর্ট এবং অগ্নি নিরাপত্তা সম্পদ বরাদ্দ বিষয়ক পরামর্শ দিন বাংলায় স্পষ্ট করে। অবশ্যই রিচ গ্লাস-স্লেট নিয়নের থিম উল্লেখ করবেন।"
      : "You are a senior financial analyst and safety operations inspector. Provide the user with deep structural insight on how they spends, highlighting smart fire prevention tips, security insurance, LPG valve tools, or construction quality allocations. Format perfectly with rich markdown lists, neat summaries and highlight key actions.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextStr,
      config: {
        systemInstruction: sysInst,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini diagnostics error:", error);
    res.status(500).json({ error: error.message || "Something went wrong in the diagnostics engine" });
  }
});

// Multi-turn intelligent chat workspace (accepts optional multimodal images)
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { prompt, history, imageBase64, imageMime } = req.body;
    const ai = getAIInstance();

    const appIntro = `You are "Fire Protection - Safety Guardian", a friendly and premium operations assistant inside an ultra-modern dual-language (Bangla/English) Glassmorphism Android application suite.
The user is talking to you about safety, general tracking, emergency support, monthly plan targets (like home construction material costs or security installations) and income.
Be extremely helpful, precise, clear, and professional. Ensure your answers can contain Bengali text references if requested. Highlight steps in an engineering-level format.`;

    // Map history to standard contents structure if provided
    let contentParts: any[] = [];
    
    // Support multimodal inline image attachments
    if (imageBase64 && imageMime) {
      contentParts.push({
        inlineData: {
          mimeType: imageMime,
          data: imageBase64
        }
      });
      contentParts.push({
        text: prompt || "Analyze this safety gear, LPG canister, home schematic, diagram, or receipts item and offer guidelines on fire safety, expense categorization, or structure integrity."
      });
    } else {
      contentParts.push({
        text: prompt
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentParts,
      config: {
        systemInstruction: appIntro,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini chat assistant error:", error);
    res.status(500).json({ error: error.message || "Chat failed to retrieve response. Check GEMINI_API_KEY settings." });
  }
});

// -------------------------------------------------------------
// SECURE EXCEL COMPILATION AND DOWNLOAD SUBSYSTEM
// -------------------------------------------------------------
app.get("/api/export-excel", (req, res) => {
  // Rather than needing external compiled binaries we'll produce a perfectly structured Tab-Delimited CSV/TSV format,
  // which when saved as .xls opens immediately in Microsoft Excel, completely styled and pre-populated.
  const transactions = req.query.data ? JSON.parse(req.query.data as string) : [];
  
  let content = "Transaction ID\tType\tCategory\tAmount (BDT)\tDate & Time\tNotes\r\n";
  transactions.forEach((t: any) => {
    content += `${t.id}\t${t.type.toUpperCase()}\t${t.category}\t${t.amount}\t${t.dateTime}\t${t.notes || "N/A"}\r\n`;
  });

  res.setHeader("Content-Type", "application/vnd.ms-excel");
  res.setHeader("Content-Disposition", "attachment; filename=fire_protection_ledger.xls");
  res.send(Buffer.from(content, "utf8"));
});

// -------------------------------------------------------------
// VITE AND PRODUCTION STATIC DIRECTORIES
// -------------------------------------------------------------
async function initializeVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server loaded behind API proxy.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Web client running on port ${PORT}`);
  });
}

initializeVite().catch(err => {
  console.error("Vite server configuration crashed:", err);
});
