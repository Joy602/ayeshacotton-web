import React from 'react';
import { Sparkles, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section aria-labelledby="hero-heading" className="w-full bg-[#fcfbfa] relative overflow-hidden flex items-center min-h-[50vh] sm:min-h-[58vh] py-8 sm:py-12 md:py-16 border-b border-[#f0eded]">
      {/* Background Soft Luxury Radiance */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#fdebf3] rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="absolute -bottom-10 left-10 w-64 sm:w-80 h-64 sm:h-80 bg-[#fef8e7] rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="absolute top-1/2 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-[#fdebf3]/60 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col gap-3.5 sm:gap-4 max-w-xl text-[#53434b]">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#fdebf3] text-[#745663] w-fit border border-[#fcd4e4] shadow-2xs">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#745663]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              লাক্সারি কালেকশন • Festive 2026
            </span>
          </div>

          <h1 id="hero-heading" className="font-playfair text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#1b1c1c] leading-[1.2] tracking-tight">
            Premium Stitched &amp; Unstitched 3-Piece Collections
          </h1>

          <p className="font-sans-body text-sm sm:text-base text-[#53434b] leading-relaxed">
            খাঁটি সুইস লন, পিওর সিল্ক ও লাক্সারি অরগাঞ্জা ফ্যাব্রিকের প্রিমিয়াম ড্রেস কালেকশন। সারা বাংলাদেশে হোম ডেলিভারি ও সহজে অর্ডার করার সুবিধা।
          </p>

          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onShopClick}
              className="bg-[#745663] hover:bg-[#5c434e] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-sans-body text-xs sm:text-sm font-semibold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              কালেকশন দেখুন (Shop Now)
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <span className="text-[11px] sm:text-xs font-semibold text-[#745663]">
              ✨ সারা দেশে দ্রুত হোম ডেলিভারি
            </span>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#ede8e4] mt-1 sm:mt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#1b1c1c]">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663] shrink-0" />
              <span>১০০% খাঁটি ফেব্রিক</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#1b1c1c]">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663] shrink-0" />
              <span>ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#1b1c1c] col-span-2 sm:col-span-1">
              <span className="text-[#006d2f] font-bold">হোয়াটসঅ্যাপে</span>
              <span>সহজ অর্ডার</span>
            </div>
          </div>
        </div>

        {/* Right Hero Image Card */}
        <figure className="relative h-[320px] min-[400px]:h-[380px] sm:h-[440px] md:h-[500px] lg:h-[530px] rounded-2xl sm:rounded-[2.2rem] overflow-hidden shadow-xl border border-[#ede8e4] group m-0">
          <OptimizedImage
            alt="Ayesha Cotton - Elegant model wearing luxury pastel blush pink and gold stitched 3-piece lawn suit with pure chiffon dupatta"
            className="w-full h-full"
            imgClassName="group-hover:scale-105 duration-700 transition-transform"
            objectPosition="object-[center_8%]"
            aspectRatio="h-full w-full"
            isHero={true}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAuGd514PKxhQWzGKU_gYiKaDFBRgCkQl6vFz3eoVQ30i-BucqfD3qlp-9keCC7zKr70G1o72bQLnprxsZ7eZ4VlyL5lniqZRSqvufB2Us7xl7J3Gqefk9MPh-lUHhPWz1d7PcX4O3JR9mEIavNZrEAEHKhJfShY_S50buOKsEalL_9o7TesK5tNlzTpU0SOX_6GKBGZhZv5SP0fHUvK5GJgqbi9UF7ci532uR7LXC-ARf1rdTTEZt"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />
          
          <figcaption className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ede8e4] flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#745663] uppercase tracking-wider">Featured Edition</p>
              <p className="font-playfair text-xs sm:text-base font-bold text-[#1b1c1c] line-clamp-1">Blush Petal Luxury Lawn 3-Piece</p>
            </div>
            <button
              onClick={onShopClick}
              className="text-xs font-bold text-[#745663] hover:text-[#5c434e] underline transition-colors cursor-pointer shrink-0 ml-2"
            >
              Explore
            </button>
          </figcaption>
        </figure>

      </div>
    </section>
  );
};
