import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  let cleanNumber = (settings.whatsappNumber || '01783769261').replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('01')) {
    cleanNumber = '88' + cleanNumber;
  } else if (cleanNumber.length === 10 && cleanNumber.startsWith('1')) {
    cleanNumber = '880' + cleanNumber;
  }
  const message = encodeURIComponent('Hello Ayesha Cotton! I am inquiring about your 3-piece collections and ordering options.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <aside aria-label="WhatsApp Quick Support" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Floating Prompt Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#1b1c1c] text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-[#ede8e4] animate-in fade-in slide-in-from-right duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Need styling advice? Chat on WhatsApp!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#8f8287] hover:text-[#1b1c1c] ml-1 p-0.5 rounded cursor-pointer"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ayesha Cotton on WhatsApp"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 border-2 border-white cursor-pointer"
      >
        <svg
          fill="currentColor"
          height="28"
          viewBox="0 0 16 16"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </a>
    </aside>
  );
};
