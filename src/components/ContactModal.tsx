import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { X, Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmailOrPhone('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <aside role="dialog" aria-modal="true" aria-label="Contact Customer Care Modal">
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity" />

      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-lg w-full bg-white text-[#1b1c1c] rounded-3xl shadow-2xl z-50 p-6 sm:p-8 border border-[#ede8e4] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#745663] uppercase tracking-wider">Direct Concierge</span>
            <h2 className="font-playfair text-2xl font-bold text-[#1b1c1c]">
              Contact Ayesha Cotton
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
              ✓
            </div>
            <p className="font-playfair text-xl font-bold text-[#1b1c1c]">Thank You!</p>
            <p className="text-sm text-[#53434b]">
              Your inquiry has been received. Our team will contact you via WhatsApp or email promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Phone or Email</label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="017XXXXXXXX or email@example.com"
                className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Your Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about fabric details, custom sizing, or order status..."
                className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none resize-none"
              />
            </div>

            {/* Quick Contact Links */}
            <div className="bg-[#fcfbfa] p-3.5 rounded-2xl border border-[#ede8e4] space-y-2 text-xs text-[#53434b]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#745663]" />
                <span>WhatsApp: <strong>{settings.whatsappNumber}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#745663]" />
                <span>Email: <strong>{settings.supportEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#745663]" />
                <span>Boutique: <strong>{settings.address}</strong></span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#745663] hover:bg-[#5c434e] text-white py-3 rounded-full font-bold text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
