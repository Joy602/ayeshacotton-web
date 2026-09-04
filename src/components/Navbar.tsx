import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, LayoutDashboard, Store, Menu, X, Sparkles, User, LogIn, LogOut, ShieldCheck, ChevronDown, Lock } from 'lucide-react';
import { CustomerUser } from '../types';

interface NavbarProps {
  activeTab: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdminView: boolean;
  onToggleAdmin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenContact: () => void;
  currentUser: CustomerUser | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onAttemptAdminAccess: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectCategory,
  cartCount,
  onOpenCart,
  isAdminView,
  onToggleAdmin,
  searchQuery,
  onSearchChange,
  onOpenContact,
  currentUser,
  onOpenAuth,
  onLogout,
  onAttemptAdminAccess,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdminUser = currentUser?.email?.toLowerCase() === 'abranjoy2@gmail.com';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', value: 'All' },
    { label: '3 pcs', value: '3 pcs' },
    { label: 'Kids', value: 'Kids' },
    { label: 'Latest', value: 'Latest' },
    { label: 'Contact Us', value: 'contact' },
  ];

  return (
    <header role="banner" className="bg-white/95 backdrop-blur-md text-[#1b1c1c] sticky top-0 z-40 border-b border-[#f0eded] shadow-xs transition-all">
      <nav aria-label="Main Navigation" className="flex justify-between items-center w-full px-3 sm:px-6 md:px-10 max-w-[1280px] mx-auto h-20 sm:h-24 md:h-26 gap-2">
        
        {/* Main Brand Logo */}
        <button
          onClick={() => {
            if (isAdminView) onToggleAdmin();
            onSelectCategory('All');
          }}
          className="flex items-center text-left group focus:outline-none cursor-pointer shrink-0 py-1"
          aria-label="Ayesha Cotton - Home"
        >
          <img
            alt="Ayesha Cotton"
            className="h-14 sm:h-18 md:h-20 lg:h-22 w-auto max-w-[240px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] object-contain mix-blend-multiply bg-transparent transition-transform duration-200 group-hover:scale-102"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgz6pUlYTwN6r_3QOdniN5ictgxACX3qWCRTv_5cMdkiX1laWC07vFWT8M2ngV7Y1M07tyRtv6naptC5AVIuinIAx19ooACI4D4Gi2TSVkRh0wQYvBvinftHb5vxNJfkMXvfB-ilwUoxM32PhIqejCavh4fu6J9XxTpZA43c1N4KgV7TjH4-irMRDBhbBYwcfbDSet_DcAkVpQ4Y1qNU4yFXwAvVttRYUUMuJuCcIANw5AiiFmq-Eu"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
          />
        </button>

        {/* Navigation Links (Desktop) */}
        {!isAdminView && (
          <div className="hidden md:flex items-center gap-5 lg:gap-8 text-xs lg:text-sm font-semibold tracking-wide text-[#53434b]">
            {navLinks.map((link) => {
              if (link.value === 'contact') {
                return (
                  <button
                    key={link.label}
                    onClick={onOpenContact}
                    className="text-[#53434b] hover:text-[#745663] transition-colors py-1 cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              }

              const isActive =
                (link.value === 'All' && activeTab === 'All') ||
                (link.value === 'Latest' && activeTab === 'Latest') ||
                activeTab === link.value;

              return (
                <button
                  key={link.label}
                  onClick={() => onSelectCategory(link.value)}
                  className={`relative py-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#745663] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#745663] after:rounded-full'
                      : 'hover:text-[#1b1c1c]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Search Bar / Trigger */}
          {!isAdminView && (
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#f6f4f2] border border-[#e4e0dc] rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 w-36 min-[400px]:w-48 sm:w-64 transition-all focus-within:border-[#745663] focus-within:bg-white shadow-xs">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search lawn, silk..."
                    autoFocus
                    className="w-full bg-transparent border-none text-xs sm:text-sm text-[#1b1c1c] focus:outline-none ml-1.5 placeholder-[#8f8287]"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#8f8287] hover:text-[#1b1c1c] text-xs font-bold px-1 cursor-pointer"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search catalog"
                  className="text-[#53434b] hover:text-[#745663] transition-colors p-2 sm:p-2.5 rounded-full hover:bg-[#f6f4f2] cursor-pointer"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          )}

          {/* Cart Trigger */}
          {!isAdminView && (
            <button
              onClick={onOpenCart}
              aria-label={`View Shopping Bag, ${cartCount} items`}
              className="text-[#53434b] hover:text-[#745663] transition-colors p-2 sm:p-2.5 rounded-full hover:bg-[#f6f4f2] relative cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-[#745663] text-white text-[9px] sm:text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Customer Login / User Account Menu */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <div>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#fdebf3] hover:bg-[#fcd4e4] text-[#745663] text-xs font-bold transition-all border border-[#fcd4e4] cursor-pointer shadow-xs"
                  aria-label="User account menu"
                >
                  <div className="w-5 h-5 rounded-full bg-[#745663] text-white flex items-center justify-center text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[100px] truncate hidden min-[360px]:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#745663]" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#ede8e4] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-[#ede8e4] mb-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-[#1b1c1c] truncate">{currentUser.name}</p>
                        {isAdminUser && (
                          <span className="text-[10px] font-bold bg-[#745663] text-white px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-[#53434b] truncate">{currentUser.phoneNumber}</p>
                      <p className="text-[10px] text-[#8f8287] truncate">{currentUser.email}</p>
                    </div>

                    <div className="space-y-1">
                      {isAdminUser && !isAdminView && (
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            onToggleAdmin();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#745663] hover:bg-[#fdebf3] transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Store Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#f6f4f2] hover:bg-[#ede8e4] text-[#1b1c1c] text-xs font-bold transition-all border border-[#e4e0dc] cursor-pointer shadow-xs"
                title="লগইন বা রেজিস্ট্রেশন করুন"
              >
                <User className="w-3.5 h-3.5 text-[#745663]" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Mode Switcher: Admin Dashboard (Only visible when logged in as abranjoy2@gmail.com) */}
          {isAdminUser && (
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer ${
                isAdminView
                  ? 'bg-[#745663] text-white hover:bg-[#5c434e]'
                  : 'bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#ede8e4] border border-[#e4e0dc]'
              }`}
              title={isAdminView ? 'Switch to Customer Storefront' : 'Open Store Admin Dashboard'}
            >
              {isAdminView ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Storefront</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#745663]" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              )}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          {!isAdminView && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#53434b] hover:text-[#1b1c1c] p-1.5 sm:p-2 rounded-full hover:bg-[#f6f4f2] cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {!isAdminView && isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#f0eded] px-4 py-3 space-y-1.5 shadow-md">
          {currentUser && (
            <div className="p-3 bg-[#fdebf3] rounded-xl mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1b1c1c]">{currentUser.name}</p>
                <p className="text-[11px] text-[#53434b] font-mono">{currentUser.phoneNumber}</p>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}

          {!currentUser && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth('login');
              }}
              className="block w-full text-center py-2.5 px-3 rounded-xl bg-[#745663] text-white text-xs font-bold shadow-xs mb-2"
            >
              Customer Sign In / Register
            </button>
          )}

          {navLinks.map((link) => {
            if (link.value === 'contact') {
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className="block w-full text-left py-2.5 px-3 rounded-xl text-[#53434b] hover:bg-[#f6f4f2] hover:text-[#1b1c1c] text-xs sm:text-sm font-semibold"
                >
                  {link.label}
                </button>
              );
            }

            const isActive =
              (link.value === 'All' && activeTab === 'All') ||
              (link.value === 'Latest' && activeTab === 'Latest') ||
              activeTab === link.value;

            return (
              <button
                key={link.label}
                onClick={() => {
                  onSelectCategory(link.value);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold ${
                  isActive
                    ? 'bg-[#fdebf3] text-[#745663] font-bold border border-[#fcd4e4]'
                    : 'text-[#53434b] hover:bg-[#f6f4f2] hover:text-[#1b1c1c]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

