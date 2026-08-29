import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Check, ShieldCheck, RefreshCw, Scissors, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  currencySymbol,
  onBuyNow,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <aside aria-label="Product Details Modal" role="dialog" aria-modal="true">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity" />

      <div className="fixed inset-2 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-3xl w-full max-h-[96vh] md:max-h-[90vh] bg-white text-[#1b1c1c] rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row border border-[#ede8e4] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/95 hover:bg-white text-[#53434b] hover:text-[#1b1c1c] shadow-sm backdrop-blur-xs cursor-pointer border border-[#ede8e4] transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 h-64 min-[400px]:h-80 sm:h-96 md:h-auto bg-[#f2eeeb] relative overflow-hidden shrink-0">
          <OptimizedImage
            src={product.imageUrl}
            alt={`${product.name} - ${product.category} high resolution preview`}
            aspectRatio="h-full w-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#745663] border border-[#fcd4e4] shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{product.badge || product.category}</span>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto md:max-h-[90vh] space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-[#745663] tracking-widest uppercase mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span>কোড: {product.sku}</span>
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-[#1b1c1c] leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Price & Stock */}
            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3.5">
              <span className="font-playfair text-2xl sm:text-3xl font-bold text-[#745663]">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-[#8f8287] line-through font-sans-body">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                product.stock > 0 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {product.stock > 0 ? `স্টকে আছে (${product.stock} টি)` : 'স্টক শেষ (Sold Out)'}
              </span>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-[#53434b] leading-relaxed border-t border-b border-[#f3efe9] py-2.5">
              <p className="font-medium text-[#1b1c1c] mb-1">পণ্যের বিবরণ (Product Details):</p>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            {/* Fabric Details & Pieces */}
            <div className="bg-[#fcfbfa] p-3 sm:p-3.5 rounded-2xl border border-[#ede8e4] space-y-2 text-xs text-[#53434b]">
              {product.fabricDetails && (
                <div className="flex items-start gap-2">
                  <Scissors className="w-4 h-4 text-[#745663] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1b1c1c]">কাপড়ের কোয়ালিটি:</strong> {product.fabricDetails}
                  </div>
                </div>
              )}
              {product.pieces && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#745663] shrink-0" />
                  <div>
                    <strong className="text-[#1b1c1c]">ড্রেসের অংশসমূহ:</strong> {product.pieces}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-[#1b1c1c]">ডেলিভারি:</strong> সারা বাংলাদেশে হোম ডেলিভারি (ক্যাশ অন ডেলিভারি)
                </div>
              </div>
            </div>

            {/* Sizes (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1.5">
                  সাইজ নির্বাচন করুন (Select Size):
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        selectedSize === s
                          ? 'bg-[#745663] text-white border-[#745663] shadow-xs scale-105'
                          : 'bg-white text-[#53434b] border-[#e4e0dc] hover:border-[#745663]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee points */}
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-[#53434b] pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span className="truncate">১০০% অরিজিনাল ফেব্রিক</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663] shrink-0" />
                <span className="truncate">৩ দিনের এক্সচেঞ্জ সুবিধা</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 sm:pt-4 mt-2 border-t border-[#ede8e4] flex flex-row gap-2 sm:gap-2.5">
            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isAdded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-[#1b1c1c] border-[#e4e0dc] hover:bg-[#f6f4f2]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">ব্যাগে যোগ হয়েছে!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#745663] shrink-0" />
                  <span className="truncate">ব্যাগে রাখুন</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onBuyNow(product);
              }}
              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-[#745663] hover:bg-[#5c434e] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">সরাসরি অর্ডার করুন</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
