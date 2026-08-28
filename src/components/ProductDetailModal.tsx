import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Check, ShieldCheck, RefreshCw, Scissors, Sparkles } from 'lucide-react';
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
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity" />

      <div className="fixed inset-2 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-3xl w-full max-h-[96vh] md:max-h-[90vh] bg-white text-[#1b1c1c] rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row border border-[#ede8e4] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#53434b] hover:text-[#1b1c1c] shadow-sm backdrop-blur-xs cursor-pointer border border-[#ede8e4] transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 h-56 min-[400px]:h-72 sm:h-80 md:h-auto bg-[#f2eeeb] relative overflow-hidden shrink-0">
          <OptimizedImage
            src={product.imageUrl}
            alt={`${product.name} - ${product.category} high resolution preview`}
            aspectRatio="h-full w-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#745663] border border-[#fcd4e4] shadow-xs">
            {product.badge || product.category}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto md:max-h-[90vh]">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-[#745663] tracking-widest uppercase mb-1">
                {product.category} • SKU: {product.sku}
              </p>
              <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-[#1b1c1c] leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Price & Stock */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="font-playfair text-xl sm:text-2xl font-bold text-[#745663]">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-[#8f8287] line-through font-sans-body">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border ${
                product.stock > 5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#53434b] leading-relaxed">
              {product.description}
            </p>

            {/* Fabric Details & Pieces */}
            <div className="bg-[#fcfbfa] p-3 sm:p-3.5 rounded-2xl border border-[#ede8e4] space-y-1.5 sm:space-y-2 text-xs text-[#53434b]">
              {product.fabricDetails && (
                <div className="flex items-start gap-2">
                  <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1b1c1c]">Fabric:</strong> {product.fabricDetails}
                  </div>
                </div>
              )}
              {product.pieces && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663] shrink-0" />
                  <div>
                    <strong className="text-[#1b1c1c]">Pieces:</strong> {product.pieces}
                  </div>
                </div>
              )}
            </div>

            {/* Sizes (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1.5">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        selectedSize === s
                          ? 'bg-[#745663] text-white border-[#745663] shadow-xs'
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
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Original Fabric</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#745663] shrink-0" />
                <span>3-Day Exchange</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-[#ede8e4] flex gap-2 sm:gap-3">
            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isAdded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-[#1b1c1c] border-[#e4e0dc] hover:bg-[#f6f4f2]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663]" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onBuyNow(product);
              }}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <svg
                fill="currentColor"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
              </svg>
              <span>Order via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
