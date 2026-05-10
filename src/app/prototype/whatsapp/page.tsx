"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message { id: string; sender: "bot" | "user"; text: string; time: string; }
interface Product { id: string; name: string; price: number; originalPrice?: number; category: string; image: string; stock: number; inStock: boolean; rating: number; vendor: string; }

type FlowStep = null | "name" | "price" | "mrp" | "category" | "stock" | "description" | "image" | "confirm";
interface Draft { name: string; price: string; mrp: string; category: string; stock: string; desc: string; image: string; }
const EMPTY: Draft = { name: "", price: "", mrp: "", category: "", stock: "", desc: "", image: "" };

const CATS = ["Vegetables / सब्जियाँ","Fruits / फल","Spices / मसाले","Honey & Natural / शहद","Handicrafts / हस्तशिल्प","Textiles / वस्त्र","Pickles / अचार","Dairy / डेयरी","Grains / अनाज","Other / अन्य"];
const CAT_VAL = ["Vegetables","Fruits","Spices","Honey & Natural Products","Handicrafts","Textiles","Pickles & Preserves","Dairy","Grains & Cereals","Other"];

const PAGE_SIZE = 5;
const ts = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const mk = (sender: "bot"|"user", text: string): Message => ({ id: `${Date.now()}-${Math.random()}`, sender, text, time: ts() });

const B = {
  welcome: `🙏 *BiharEKart में आपका स्वागत है! / Welcome to BiharEKart!*\n\n🛒 *खरीदार / Buyer:*\n• *list / सूची* — सभी उत्पाद / All products\n• *search <name> / खोज <नाम>* — खोजें / Search\n• *next / अगला* — अगला पृष्ठ / Next\n• *prev / पिछला* — पिछला / Prev\n\n🏪 *विक्रेता / Seller:*\n• *add / जोड़ें* — नया उत्पाद जोड़ें / Add product\n\n• *help / मदद* — सहायता / Help`,
  help: `📋 *Help / सहायता*\n\n🛒 *list/सूची* — सभी उत्पाद\n*search x / खोज x* — खोजें\n*next/अगला* — अगला पृष्ठ\n*prev/पिछला* — पिछला\n\n🏪 *add/जोड़ें* — उत्पाद जोड़ें / Add product\n*cancel/रद्द* — रोकें / Stop`,
  noProducts: "😔 कोई उत्पाद नहीं / No products found.",
  loading: "⏳ लोड हो रहा है... / Loading...",
  noMore: "📭 और नहीं हैं / No more. Type *prev/पिछला*.",
  noPrev: "⬆️ पहला पृष्ठ / Already on first page.",
  unknown: "❓ समझ नहीं आया / I didn't understand. Type *help/मदद*.",
  card: (p: Product, i: number) => `${i}️⃣ *${p.name}*\n💰 कीमत/Price: ₹${p.price}${p.originalPrice ? ` ~~₹${p.originalPrice}~~` : ""}\n🏷️ ${p.category} | ${p.inStock ? "✅ उपलब्ध/In Stock" : "❌ अनुपलब्ध/Out of Stock"}\n⭐ ${p.rating.toFixed(1)} | 🏪 ${p.vendor}`,
  pageInfo: (cur: number, total: number, pg: number, pgs: number) => `\n📦 ${total} में से ${cur} / Showing ${cur} of ${total} (Page ${pg}/${pgs})\n*next/अगला* — और देखें / See more.`,
  addStart: `🏪 *नया उत्पाद / Add New Product*\n\nमैं एक-एक करके पूछूंगा / I'll ask step by step.\nरोकने के लिए *cancel/रद्द* लिखें / Type *cancel* to stop.\n\n📝 *उत्पाद का नाम / Product Name:*`,
  askPrice: `💰 *कीमत (₹) / Price (₹):*\nसिर्फ नंबर / Numbers only (e.g. 299)`,
  askMrp: `🏷️ *MRP / Original Price (₹):*\nछूट से पहले की कीमत / Price before discount\nछोड़ने के लिए *skip* लिखें / Type *skip* to skip`,
  askCat: `📂 *श्रेणी / Category:* नंबर चुनें / Choose number:\n\n` + CATS.map((c, i) => `${i+1}. ${c}`).join("\n"),
  askStock: `📦 *स्टॉक / Stock Quantity:*\nकितने उत्पाद हैं? / How many items? (e.g. 50)`,
  askDesc: `📄 *विवरण / Description:*\nउत्पाद के बारे में / About your product`,
  askImage: `🖼️ *उत्पाद की फोटो / Product Image:*\n\nनीचे दिए बटन से फोटो चुनें / Use the button below to choose a photo.\n📌 JPEG, PNG या WEBP | Max 5MB\n\nछोड़ने के लिए *skip* लिखें / Type *skip* to skip.`,
  confirm: (d: Draft) => `✅ *कृपया जांचें / Please Review:*\n\n📝 नाम/Name: *${d.name}*\n💰 कीमत/Price: ₹${d.price}${d.mrp ? ` (MRP ₹${d.mrp})` : ""}\n📂 श्रेणी/Category: ${d.category}\n📦 स्टॉक/Stock: ${d.stock}\n📄 विवरण: ${d.desc}\n🖼️ फोटो/Image: ${d.image ? "✅ अपलोड हुई / Uploaded" : "⏭️ छोड़ी / Skipped"}\n\n*yes/हाँ* — सहेजें / Save\n*no/नहीं* — रद्द करें / Cancel`,
  adding: "⏳ उत्पाद जोड़ा जा रहा है... / Adding product...",
  success: (n: string) => `🎉 *सफलतापूर्वक जोड़ा गया! / Added Successfully!*\n\n*${n}* अब BiharEKart पर है!\n*${n}* is live on BiharEKart!\n\nऔर जोड़ने के लिए *add/जोड़ें* टाइप करें।`,
  error: `❌ *कुछ गलत हुआ / Something went wrong.*\nदोबारा कोशिश करें / Try again with *add/जोड़ें*.`,
  cancelled: "❌ रद्द किया / Cancelled. Type *list/सूची* or *add/जोड़ें*.",
  badPrice: "⚠️ सही कीमत लिखें / Enter valid price (e.g. 299)",
  badStock: "⚠️ सही संख्या लिखें / Enter valid number (e.g. 50)",
  badCat: `⚠️ 1 से ${CATS.length} के बीच नंबर / Enter number 1–${CATS.length}`,
  filterHeader: (cat: string) => `🏷️ *श्रेणी / Category: ${cat}*
फिल्टर हटाने के लिए *list* टाइप करें / Type *list* to clear filter.`,
  sortedBy: (s: string) => `⇅️ *सॉर्ट / Sorted: ${s}*`,
};

// Categories from actual DB
const FILTER_CATS = ["All","Mithila Art","Handlooms","Sweets","Handicrafts","Spices","Electronics"];
const SORT_OPTS = [
  { label: "🆕 नया / Newest", val: "newest" },
  { label: "💰 कम कीमत / Price ↑", val: "price-asc" },
  { label: "💎 ज्यादा कीमत / Price ↓", val: "price-desc" },
  { label: "⭐ रेटिंग / Rating", val: "rating" },
];

function parseCmd(text: string) {
  const t = text.trim().toLowerCase();
  if (["list","सूची","सूचि"].includes(t)) return "list";
  if (["next","अगला","आगाँ"].includes(t)) return "next";
  if (["prev","previous","पिछला","पाछाँ"].includes(t)) return "prev";
  if (["help","मदद","सहायता"].includes(t)) return "help";
  if (["add","जोड़ें","joḍen","नया उत्पाद"].includes(t)) return "add";
  if (["cancel","रद्द","बंद"].includes(t)) return "cancel";
  if (t.startsWith("search ") || t.startsWith("खोज ") || t.startsWith("खोजि ")) return "search:" + text.slice(text.indexOf(" ")+1).trim();
  // filter:CategoryName
  if (t.startsWith("filter:")) return t;
  // sort:val
  if (t.startsWith("sort:")) return t;
  return "unknown";
}

function fmtPage(products: Product[], pg: number, total: number) {
  const pgs = Math.ceil(total / PAGE_SIZE);
  return products.map((p, i) => B.card(p, (pg-1)*PAGE_SIZE + i + 1)).join("\n\n") + B.pageInfo(products.length + (pg-1)*PAGE_SIZE, total, pg, pgs);
}

function renderMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<strong>$1</strong>").replace(/~~(.*?)~~/g,"<s>$1</s>").replace(/\n/g,"<br/>");
}

export default function WhatsAppBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [listening, setListening] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  useEffect(() => {
    fetch("/api/products").then(r=>r.json()).then((d: Product[]) => { setAllProducts(d); setFiltered(d); }).catch(()=>{});
    setTimeout(() => setMessages([mk("bot", B.welcome)]), 500);
  }, []);

  const botMsg = useCallback((text: string, delay = 1200) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", text)]); }, delay);
  }, []);

  const refreshProducts = () => {
    fetch("/api/products").then(r=>r.json()).then((d: Product[]) => { setAllProducts(d); setFiltered(d); }).catch(()=>{});
  };

  const handleFlow = useCallback(async (text: string) => {
    const t = text.trim();
    const tl = t.toLowerCase();
    if (["cancel","रद्द","बंद"].includes(tl) && flowStep !== "confirm") {
      setFlowStep(null); setDraft(EMPTY); botMsg(B.cancelled); return;
    }
    switch (flowStep) {
      case "name": {
        if (!t) { botMsg("⚠️ नाम खाली नहीं हो सकता / Name required."); return; }
        setDraft(d => ({ ...d, name: t })); setFlowStep("price"); botMsg(B.askPrice); break;
      }
      case "price": {
        const n = parseFloat(t);
        if (isNaN(n)||n<=0) { botMsg(B.badPrice); return; }
        setDraft(d => ({ ...d, price: String(n) })); setFlowStep("mrp"); botMsg(B.askMrp); break;
      }
      case "mrp": {
        if (["skip","छोड़ें","छोड़","s"].includes(tl)) {
          setDraft(d => ({ ...d, mrp: "" }));
        } else {
          const n = parseFloat(t);
          if (isNaN(n)||n<=0) { botMsg(B.badPrice); return; }
          setDraft(d => ({ ...d, mrp: String(n) }));
        }
        setFlowStep("category"); botMsg(B.askCat); break;
      }
      case "category": {
        const idx = parseInt(t) - 1;
        if (isNaN(idx)||idx<0||idx>=CAT_VAL.length) { botMsg(B.badCat); return; }
        setDraft(d => ({ ...d, category: CAT_VAL[idx] })); setFlowStep("stock"); botMsg(B.askStock); break;
      }
      case "stock": {
        const n = parseInt(t);
        if (isNaN(n)||n<0) { botMsg(B.badStock); return; }
        setDraft(d => ({ ...d, stock: String(n) })); setFlowStep("description"); botMsg(B.askDesc); break;
      }
      case "description": {
        if (!t) { botMsg("⚠️ विवरण खाली नहीं हो सकता / Description required."); return; }
        setDraft(d => ({ ...d, desc: t }));
        setFlowStep("image");
        botMsg(B.askImage);
        break;
      }
      case "image": {
        // text path: only "skip" is valid text input; actual upload is handled by handleImageFile
        if (["skip","छोड़ें","छोड़","s"].includes(tl)) {
          const updated = { ...draft, image: "" };
          setDraft(updated); setPreviewUrl(null); setFlowStep("confirm"); botMsg(B.confirm(updated));
        } else {
          botMsg("⚠️ फोटो चुनने के लिए नीचे दिए बटन दबाएं / Use the 🖼️ button below, or type *skip* to skip.");
        }
        break;
      }
      case "confirm": {
        if (["yes","हाँ","ha","haan","ok","okay","han"].includes(tl)) {
          botMsg(B.adding, 400);
          try {
            const res = await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: draft.name, description: draft.desc,
                price: Number(draft.price),
                originalPrice: draft.mrp ? Number(draft.mrp) : null,
                category: draft.category, stock: Number(draft.stock),
                image: draft.image || undefined,
                images: draft.image ? JSON.stringify([draft.image]) : "[]",
                highlights: "[]", details: "{}",
              }),
            });
            const result = await res.json();
            if (res.ok) {
              refreshProducts();
              setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", B.success(draft.name))]); }, 1600);
            } else {
              setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", `${B.error}\n_${result.error||"Unknown error"}_`)]); }, 1600);
            }
          } catch {
            setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", B.error)]); }, 1600);
          }
          setFlowStep(null); setDraft(EMPTY); setPreviewUrl(null);
        } else if (["no","नहीं","cancel","रद्द"].includes(tl)) {
          setFlowStep(null); setDraft(EMPTY); setPreviewUrl(null); botMsg(B.cancelled);
        } else {
          botMsg("⚠️ *yes/हाँ* या *no/नहीं* लिखें / Type *yes* or *no*.");
        }
        break;
      }
    }
  }, [flowStep, draft, botMsg]);

  // Image file handler — called from the file input
  const handleImageFile = useCallback(async (file: File) => {
    if (!file) return;
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setMessages(p => [...p, mk("user", `🖼️ ${file.name} (uploading...)`)]) ;
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.urls?.[0]) {
        const url = data.urls[0];
        const updatedDraft = { ...draft, image: url };
        setDraft(updatedDraft);
        setMessages(p => [...p, mk("bot", `✅ *फोटो अपलोड हो गई! / Image Uploaded!*\n\nआगे बढ़ने के लिए नीचे दिए बटन दबाएं / Tap the button below to continue.`)]);
        setFlowStep("confirm");
        setTimeout(() => botMsg(B.confirm(updatedDraft)), 800);
      } else {
        setPreviewUrl(null);
        setMessages(p => [...p, mk("bot", `❌ अपलोड विफल / Upload failed: ${data.error || "Unknown"}\n*skip* टाइप करके छोड़ें / Type *skip* to skip.`)]);
      }
    } catch {
      setPreviewUrl(null);
      setMessages(p => [...p, mk("bot", "❌ अपलोड विफल / Upload failed. Type *skip*.")]); 
    }
    setUploading(false);
  }, [draft, botMsg]);

  const applySort = (prods: Product[], sort: string) => {
    const arr = [...prods];
    if (sort === "price-asc") arr.sort((a,b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a,b) => b.price - a.price);
    else if (sort === "rating") arr.sort((a,b) => b.rating - a.rating);
    return arr;
  };

  const handleCommand = useCallback((text: string) => {
    if (flowStep !== null) { handleFlow(text); return; }
    const cmd = parseCmd(text);
    if (cmd === "list") {
      const src = activeFilter === "All" ? allProducts : allProducts.filter(p => p.category === activeFilter);
      const sorted = applySort(src, activeSort);
      setFiltered(sorted); setPage(1); setShowFilters(true);
      if (!allProducts.length) { botMsg(B.noProducts); return; }
      botMsg(B.loading, 400);
      setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", fmtPage(sorted.slice(0, PAGE_SIZE), 1, sorted.length))]); }, 1400);
    } else if (cmd.startsWith("filter:")) {
      const cat = cmd.slice(7);
      setActiveFilter(cat); setPage(1); setShowFilters(true);
      const src = cat === "All" ? allProducts : allProducts.filter(p => p.category === cat);
      const sorted = applySort(src, activeSort);
      setFiltered(sorted);
      botMsg(cat === "All" ? B.loading : B.filterHeader(cat), 400);
      setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", sorted.length ? fmtPage(sorted.slice(0, PAGE_SIZE), 1, sorted.length) : B.noProducts)]); }, 1400);
    } else if (cmd.startsWith("sort:")) {
      const s = cmd.slice(5);
      setActiveSort(s); setPage(1);
      const src = activeFilter === "All" ? allProducts : allProducts.filter(p => p.category === activeFilter);
      const sorted = applySort(src, s);
      setFiltered(sorted);
      const label = SORT_OPTS.find(o => o.val === s)?.label || s;
      botMsg(B.sortedBy(label), 400);
      setTimeout(() => { setTyping(false); setMessages(p => [...p, mk("bot", sorted.length ? fmtPage(sorted.slice(0, PAGE_SIZE), 1, sorted.length) : B.noProducts)]); }, 1400);
    } else if (cmd === "next") {
      const np = page + 1, start = (np-1)*PAGE_SIZE;
      if (start >= filtered.length) { botMsg(B.noMore); return; }
      setPage(np); botMsg(fmtPage(filtered.slice(start, start+PAGE_SIZE), np, filtered.length));
    } else if (cmd === "prev") {
      if (page <= 1) { botMsg(B.noPrev); return; }
      const pp = page - 1, start = (pp-1)*PAGE_SIZE;
      setPage(pp); botMsg(fmtPage(filtered.slice(start, start+PAGE_SIZE), pp, filtered.length));
    } else if (cmd === "help") {
      botMsg(B.help);
    } else if (cmd === "add") {
      setDraft(EMPTY); setFlowStep("name"); botMsg(B.addStart);
    } else if (cmd === "cancel") {
      botMsg(B.cancelled);
    } else if (cmd.startsWith("search:")) {
      const q = cmd.slice(7).toLowerCase();
      if (!q) { botMsg("🔍 खोज शब्द लिखें / Type what to search: *search honey*"); return; }
      botMsg(`🔍 "${q}" खोजा जा रहा है... / Searching...`, 400);
      const results = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q));
      setFiltered(results); setPage(1);
      setTimeout(() => {
        setTyping(false);
        setMessages(p => [...p, mk("bot", results.length ? fmtPage(results.slice(0, PAGE_SIZE), 1, results.length) : B.noProducts)]);
      }, 1400);
    } else {
      botMsg(B.unknown);
    }
  }, [allProducts, filtered, page, flowStep, activeFilter, activeSort, botMsg, handleFlow]);

  const send = () => {
    const text = input.trim(); if (!text) return;
    setMessages(p => [...p, mk("user", text)]); setInput("");
    setTimeout(() => handleCommand(text), 100);
  };

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported. Use Chrome or Edge."); return; }
    const rec = new SR(); rec.lang = "hi-IN";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setMessages(p => [...p, mk("user", `🎤 ${t}`)]); setTimeout(() => handleCommand(t), 100); };
    rec.onerror = () => setListening(false);
    rec.start();
  };

  const chips = flowStep
    ? [{ label: "cancel", display: "❌ Cancel / रद्द" }, { label: "skip", display: "⏭️ Skip" }]
    : [
        { label: "list", display: "📦 List / सूची" },
        { label: "add", display: "➕ Add / जोड़ें" },
        { label: "next", display: "➡️ Next / अगला" },
        { label: "help", display: "❓ Help / मदद" },
      ];

  const stepLabels: Record<string, string> = {
    name: "Step 1/7 — नाम / Name", price: "Step 2/7 — कीमत / Price",
    mrp: "Step 3/7 — MRP", category: "Step 4/7 — श्रेणी / Category",
    stock: "Step 5/7 — स्टॉक / Stock", description: "Step 6/7 — विवरण / Description",
    image: "Step 7/7 — फोटो / Image",
    confirm: "✅ Confirm / पुष्टि करें",
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#111b21]">
      <div className="relative w-full max-w-sm h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border-4 border-[#2a3942]">

        {/* Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-xl font-bold text-white">B</div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">BiharEKart Bot</p>
            <p className="text-[#8696a0] text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-[#00a884] rounded-full inline-block" />
              {flowStep ? `🏪 ${stepLabels[flowStep] ?? "Adding product..."}` : `online · ${allProducts.length} products`}
            </p>
          </div>
          {flowStep && (
            <div className="text-xs bg-[#00a884]/20 text-[#00a884] px-2 py-1 rounded-full border border-[#00a884]/30">
              🏪 Seller Mode
            </div>
          )}
        </div>

        {/* Progress bar for add flow */}
        {flowStep && flowStep !== "confirm" && (
          <div className="bg-[#202c33] px-4 pb-2 flex-shrink-0">
            <div className="w-full bg-[#2a3942] rounded-full h-1.5">
              <div
                className="bg-[#00a884] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(["name","price","mrp","category","stock","description","image"].indexOf(flowStep)+1)/7*100}%` }}
              />
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2"
          style={{ backgroundColor: "#0b141a", backgroundImage: "radial-gradient(circle at 1px 1px, #1a2530 1px, transparent 0)", backgroundSize: "32px 32px" }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[82%] rounded-lg px-3 py-2 text-sm shadow ${msg.sender==="user"?"bg-[#005c4b] text-white rounded-tr-none":"bg-[#202c33] text-[#e9edef] rounded-tl-none"}`}>
                <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMd(msg.text) }} />
                <p className={`text-[10px] mt-1 text-right ${msg.sender==="user"?"text-[#9de1d7]":"text-[#8696a0]"}`}>
                  {msg.time}{msg.sender==="user" && <span className="ml-1 text-[#53bdeb]">✓✓</span>}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-3 shadow flex gap-1 items-center">
                {[0,0.2,0.4].map((d,i) => <span key={i} className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" style={{animationDelay:`${d}s`}} />)}
              </div>
            </div>
          )}

          {/* Inline image picker — appears only during the image step */}
          {flowStep === "image" && !uploading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] border border-[#00a884]/40 rounded-xl p-3 max-w-[85%] space-y-2">
                <p className="text-[#e9edef] text-xs font-semibold">🖼️ फोटो अपलोड करें / Upload Photo</p>
                {previewUrl && (
                  <img src={previewUrl} alt="preview" className="w-full h-28 object-cover rounded-lg border border-[#2a3942]" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-[#00a884] hover:bg-[#017a63] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  📁 फाइल चुनें / Choose File
                </button>
                <button
                  onClick={() => { setMessages(p => [...p, mk("user","skip")]); setTimeout(() => handleCommand("skip"), 100); }}
                  className="w-full text-center text-xs text-[#8696a0] hover:text-[#e9edef] py-1 transition-colors"
                >
                  ⏭️ छोड़ें / Skip Image
                </button>
              </div>
            </div>
          )}
          {flowStep === "image" && uploading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] rounded-lg px-4 py-3 text-xs text-[#00a884] flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin" />
                अपलोड हो रहा है... / Uploading...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick chips */}
        <div className="bg-[#111b21] px-3 pt-1.5 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1.5">
            {chips.map(c => (
              <button key={c.label} onClick={() => { setMessages(p => [...p, mk("user", c.label)]); setTimeout(() => handleCommand(c.label), 100); }}
                className="flex-shrink-0 bg-[#2a3942] hover:bg-[#3b4a54] text-[#e9edef] text-xs rounded-full px-3 py-1.5 transition-colors border border-[#3b4a54]">
                {c.display}
              </button>
            ))}
            {!flowStep && (
              <button onClick={() => setShowFilters(f => !f)}
                className={`flex-shrink-0 text-xs rounded-full px-3 py-1.5 transition-colors border ${
                  showFilters ? "bg-[#00a884] text-white border-[#00a884]" : "bg-[#2a3942] text-[#e9edef] border-[#3b4a54] hover:bg-[#3b4a54]"
                }`}>
                🎛️ Filter
              </button>
            )}
          </div>

          {/* Filter + Sort panel */}
          {showFilters && !flowStep && (
            <div className="pb-2 space-y-2">
              {/* Category chips */}
              <div className="flex gap-1.5 overflow-x-auto">
                {FILTER_CATS.map(cat => (
                  <button key={cat}
                    onClick={() => { setMessages(p => [...p, mk("user", `filter:${cat}`)]); setTimeout(() => handleCommand(`filter:${cat}`), 100); }}
                    className={`flex-shrink-0 text-[11px] rounded-full px-2.5 py-1 border transition-colors ${
                      activeFilter === cat
                        ? "bg-[#00a884] text-white border-[#00a884]"
                        : "bg-[#2a3942] text-[#8696a0] border-[#3b4a54] hover:text-[#e9edef]"
                    }`}>
                    {cat === "All" ? "🌐 All / सभी" : cat}
                  </button>
                ))}
              </div>
              {/* Sort chips */}
              <div className="flex gap-1.5 overflow-x-auto">
                {SORT_OPTS.map(opt => (
                  <button key={opt.val}
                    onClick={() => { setMessages(p => [...p, mk("user", `sort:${opt.val}`)]); setTimeout(() => handleCommand(`sort:${opt.val}`), 100); }}
                    className={`flex-shrink-0 text-[11px] rounded-full px-2.5 py-1 border transition-colors ${
                      activeSort === opt.val
                        ? "bg-[#005c4b] text-white border-[#005c4b]"
                        : "bg-[#2a3942] text-[#8696a0] border-[#3b4a54] hover:text-[#e9edef]"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-[#111b21] px-3 pb-4 pt-2 flex items-end gap-2 flex-shrink-0">
          <div className="flex-1 bg-[#2a3942] rounded-full flex items-center px-4 py-2.5 gap-2">
            <span className="text-lg cursor-pointer select-none">😀</span>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && send()}
              placeholder={flowStep ? "अपना जवाब लिखें / Type your answer..." : "list / सूची / add / जोड़ें..."}
              className="flex-1 bg-transparent text-[#e9edef] text-sm outline-none placeholder-[#8696a0]" />
          </div>
          {input.trim() ? (
            <button onClick={send} className="w-12 h-12 bg-[#00a884] hover:bg-[#017a63] rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0">
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          ) : (
            <button onClick={handleVoice} className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all flex-shrink-0 ${listening?"bg-red-500 animate-pulse":"bg-[#00a884] hover:bg-[#017a63]"}`}>
              🎤
            </button>
          )}
        </div>
      </div>

      {/* Side panel */}
      <div className="hidden lg:flex flex-col gap-4 ml-8 w-72">
        <div className="bg-[#202c33] rounded-2xl p-5 border border-[#2a3942]">
          <h2 className="text-[#00a884] font-bold text-base mb-3">🤖 BiharEKart Bot</h2>
          <p className="text-[#8696a0] text-xs mb-4">Bilingual bot — Hindi & English. Live data from database.</p>
          <div className="space-y-3">
            <div>
              <p className="text-[#e9edef] text-xs font-semibold mb-1">🛒 Buyer Commands</p>
              <div className="flex flex-wrap gap-1">
                {["list / सूची","search x / खोज x","next / अगला","prev / पिछला"].map(c => (
                  <code key={c} className="bg-[#111b21] text-[#00a884] text-[11px] px-2 py-0.5 rounded border border-[#2a3942]">{c}</code>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#e9edef] text-xs font-semibold mb-1">🏪 Seller Commands</p>
              <div className="flex flex-wrap gap-1">
                {["add / जोड़ें","cancel / रद्द","skip (for MRP)"].map(c => (
                  <code key={c} className="bg-[#111b21] text-[#00a884] text-[11px] px-2 py-0.5 rounded border border-[#2a3942]">{c}</code>
                ))}
              </div>
            </div>
          </div>
        </div>
        {flowStep && (
          <div className="bg-[#1a2530] rounded-2xl p-4 border border-[#00a884]/30">
            <p className="text-[#00a884] font-semibold text-xs mb-2">🏪 Adding Product...</p>
            <div className="space-y-1 text-[11px] text-[#8696a0]">
              {draft.name && <p>📝 {draft.name}</p>}
              {draft.price && <p>💰 ₹{draft.price}{draft.mrp ? ` (MRP ₹${draft.mrp})` : ""}</p>}
              {draft.category && <p>📂 {draft.category}</p>}
              {draft.stock && <p>📦 Stock: {draft.stock}</p>}
              {previewUrl && <img src={previewUrl} alt="preview" className="w-full h-20 object-cover rounded-lg mt-1 border border-[#2a3942]" />}
              {!previewUrl && draft.desc && <p>📄 {draft.desc.slice(0,40)}{draft.desc.length>40?"...":""}</p>}
            </div>
          </div>
        )}
        <div className="bg-[#1a2530] rounded-2xl p-4 border border-[#2a3942] text-xs text-[#8696a0]">
          <p className="text-[#e9edef] font-semibold mb-1">📡 Data Source</p>
          <p>Live from <code className="text-[#00a884]">dev.db</code> via <code className="text-[#00a884]">/api/products</code></p>
          <p className="mt-2">{allProducts.length} products loaded.</p>
        </div>
      </div>
    </div>
  );
}
