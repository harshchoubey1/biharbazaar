"use client";
import { useState } from "react";

const WHATSAPP_NUMBER = "919876543210"; // Replace with your actual WhatsApp number

const quickMessages = [
  { label: "➕ उत्पाद जोड़ें / Add Product (Seller)", msg: "__add_product__" },
  { label: "🛍️ उत्पाद देखें / Browse Products", msg: "__browse__" },
  { label: "📦 Track my order", msg: "Hi! I want to track my recent order on Bihar eKart." },
  { label: "💬 Talk to support", msg: "Hi! I need help with my Bihar eKart account." },
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  const openChat = (msg: string) => {
    if (msg === "__add_product__" || msg === "__browse__") {
      window.location.href = "/prototype/whatsapp";
    } else {
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    }
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Quick Message Panel */}
      {open && (
        <div className="mb-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🏪</div>
            <div>
              <p className="text-white font-semibold text-sm">Bihar eKart Support</p>
              <p className="text-green-100 text-xs">Typically replies in minutes</p>
            </div>
          </div>
          {/* Message bubble */}
          <div className="px-4 py-4 bg-[#e5ddd5] dark:bg-zinc-800">
            <div className="bg-white dark:bg-zinc-700 rounded-lg rounded-tl-none px-3 py-2 text-sm text-black/80 dark:text-white/80 shadow-sm max-w-[85%]">
              👋 Hi! How can we help you today?
              <p className="text-xs text-black/30 dark:text-white/30 mt-1 text-right">10:00 AM ✓✓</p>
            </div>
          </div>
          {/* Quick options */}
          <div className="p-3 space-y-2 bg-white dark:bg-zinc-900">
            {quickMessages.map((q, i) => (
              <button
                key={i}
                onClick={() => openChat(q.msg)}
                className="w-full text-left px-3 py-2.5 rounded-xl border border-green-200 dark:border-green-800/40 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        id="whatsapp-fab"
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl shadow-green-500/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>

      {/* Pulse ring when closed */}
      {!open && (
        <span className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-green-400 opacity-40 animate-ping pointer-events-none" />
      )}
    </div>
  );
}
