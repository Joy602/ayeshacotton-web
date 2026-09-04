import React from 'react';
import { StoreSettings } from '../types';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onSelectCategory: (category: string) => void;
  onOpenAdmin: () => void;
  onOpenContact: () => void;
  isAdminUser?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onSelectCategory,
  onOpenAdmin,
  onOpenContact,
  isAdminUser = false,
}) => {
  return (
    <footer className="bg-[#f4f0ec] text-[#1b1c1c] border-t border-[#e8e4df] pt-16 pb-12 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        
        {/* Value Prop Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#e2dcd6]">
          <div className="flex items-center gap-3.5 bg-white/70 p-4 rounded-2xl border border-[#ede8e4]">
            <div className="w-10 h-10 rounded-full bg-[#fdebf3] flex items-center justify-center text-[#745663] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">100% Authentic Quality</p>
              <p className="text-[11px] text-[#53434b]">Premium Swiss Lawn &amp; Pure Silk</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/70 p-4 rounded-2xl border border-[#ede8e4]">
            <div className="w-10 h-10 rounded-full bg-[#fdebf3] flex items-center justify-center text-[#745663] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">Cash on Delivery</p>
              <p className="text-[11px] text-[#53434b]">All 64 districts nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/70 p-4 rounded-2xl border border-[#ede8e4]">
            <div className="w-10 h-10 rounded-full bg-[#fdebf3] flex items-center justify-center text-[#745663] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">Hassle-Free Exchange</p>
              <p className="text-[11px] text-[#53434b]">3-day sizing &amp; defect policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/70 p-4 rounded-2xl border border-[#ede8e4]">
            <div className="w-10 h-10 rounded-full bg-[#fdebf3] flex items-center justify-center text-[#745663] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">WhatsApp Ordering</p>
              <p className="text-[11px] text-[#53434b]">Direct support &amp; fast dispatch</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <button
              onClick={() => onSelectCategory('All')}
              className="group focus:outline-none cursor-pointer text-left block"
              aria-label="Ayesha Cotton - South Asian Designer Luxury"
            >
              <img
                alt="Ayesha Cotton"
                className="h-16 sm:h-20 md:h-24 w-auto max-w-[260px] sm:max-w-[320px] md:max-w-[380px] object-contain mix-blend-multiply bg-transparent transition-transform duration-200 group-hover:scale-102"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgz6pUlYTwN6r_3QOdniN5ictgxACX3qWCRTv_5cMdkiX1laWC07vFWT8M2ngV7Y1M07tyRtv6naptC5AVIuinIAx19ooACI4D4Gi2TSVkRh0wQYvBvinftHb5vxNJfkMXvfB-ilwUoxM32PhIqejCavh4fu6J9XxTpZA43c1N4KgV7TjH4-irMRDBhbBYwcfbDSet_DcAkVpQ4Y1qNU4yFXwAvVttRYUUMuJuCcIANw5AiiFmq-Eu"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            </button>
            <p className="text-xs text-[#53434b] leading-relaxed">
              Curating luxury 3-piece designer ensembles, kids festive wear, and exclusive latest arrivals with delicate handwork and authentic South Asian textile artistry.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Collections navigation" className="space-y-3">
            <p className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
              Collections
            </p>
            <ul className="space-y-2 text-xs text-[#53434b]">
              <li>
                <button
                  onClick={() => onSelectCategory('3 pcs')}
                  className="hover:text-[#745663] transition-colors cursor-pointer"
                >
                  3 pcs Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Kids')}
                  className="hover:text-[#745663] transition-colors cursor-pointer"
                >
                  Kids Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Latest')}
                  className="hover:text-[#745663] transition-colors cursor-pointer"
                >
                  Latest (New Arrivals)
                </button>
              </li>
            </ul>
          </nav>

          {/* Customer Care */}
          <nav aria-label="Customer Care navigation" className="space-y-3">
            <p className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
              Customer Care
            </p>
            <ul className="space-y-2 text-xs text-[#53434b]">
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#745663] transition-colors cursor-pointer"
                >
                  Contact &amp; Sizing Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#745663] transition-colors cursor-pointer"
                >
                  Shipping &amp; Delivery Rates
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#745663] transition-colors cursor-pointer"
                >
                  Return &amp; Exchange Policy
                </button>
              </li>
              {isAdminUser ? (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-[#745663] transition-colors cursor-pointer text-[#745663] font-semibold"
                  >
                    Store Admin Dashboard
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={onOpenContact}
                    className="hover:text-[#745663] transition-colors cursor-pointer"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Contact Details */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
              Store Boutique
            </p>
            <div className="space-y-2 text-xs text-[#53434b]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#745663] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#745663] shrink-0" />
                <span>{settings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#745663] shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e2dcd6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8f8287]">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#745663] fill-[#745663]" />
            <span>for South Asian luxury couture lovers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
