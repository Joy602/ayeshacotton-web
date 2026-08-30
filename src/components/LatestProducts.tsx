import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';

interface LatestProductsProps {
  products: Product[];
  currencySymbol: string;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const LatestProducts: React.FC<LatestProductsProps> = ({
  products,
  currencySymbol,
  onBuyNow,
  onAddToCart,
  onViewDetails,
}) => {
  const latestItems = products.filter((p) => p.isLatest || p.badge === 'New Arrival').slice(0, 4);

  if (latestItems.length === 0) return null;

  return (
    <section aria-labelledby="latest-heading" className="max-w-[1280px] mx-auto px-3 sm:px-6 md:px-10 py-6 sm:py-12 md:py-16 bg-[#fbf9f8] border-b border-[#f0eded]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-2 sm:gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#745663] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freshly Tailored Couture</span>
          </div>
          <h2 id="latest-heading" className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1b1c1c]">
            Latest Products
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#53434b] max-w-md leading-relaxed">
          Discover our newest luxury drops crafted in pure silk, velvet, organza, and Swiss lawn with artisanal South Asian craftsmanship.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
        {latestItems.map((product) => (
          <article
            key={product.id}
            itemScope
            itemType="https://schema.org/Product"
            className="group flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white p-2 sm:p-3.5 md:p-4 shadow-2xs hover:shadow-xl transition-all duration-300 border border-[#ede8e4] hover:border-[#745663]/30"
          >
            {/* Top Product Section */}
            <div>
              {/* Image Container with Badge */}
              <div
                onClick={() => onViewDetails(product)}
                className="relative rounded-lg sm:rounded-xl overflow-hidden mb-1.5 sm:mb-3 cursor-pointer bg-[#f2eeeb]"
              >
                <OptimizedImage
                  src={product.imageUrl}
                  alt={`${product.name} - ${product.category} luxury dress | Ayesha Cotton`}
                  aspectRatio="aspect-[3/4]"
                />

                {/* Tag / Badge */}
                <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-white/95 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold text-[#745663] border border-[#fcd4e4] shadow-2xs max-w-[80%] truncate">
                  {product.badge || product.category}
                </div>

                {/* Overlay Quick Actions */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-[1px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(product);
                    }}
                    className="p-1.5 sm:p-2.5 rounded-full bg-white text-[#1b1c1c] hover:bg-[#745663] hover:text-white transition-colors shadow-md border border-[#ede8e4] cursor-pointer"
                    title="Quick View"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="p-1.5 sm:p-2.5 rounded-full bg-white text-[#1b1c1c] hover:bg-[#745663] hover:text-white transition-colors shadow-md border border-[#ede8e4] cursor-pointer"
                    title="Add to Cart"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Product Meta - Title & Price only */}
              <div className="flex flex-col gap-0.5 sm:gap-1 pt-0.5">
                <h3
                  onClick={() => onViewDetails(product)}
                  itemProp="name"
                  className="font-playfair text-xs sm:text-base md:text-lg font-bold text-[#1b1c1c] line-clamp-1 sm:line-clamp-2 hover:text-[#745663] cursor-pointer transition-colors leading-snug"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="priceCurrency" content="BDT" />
                  <meta itemProp="price" content={String(product.price)} />
                  <p className="text-xs sm:text-base md:text-lg font-bold text-[#745663] font-playfair">
                    {currencySymbol}{product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className="text-[10px] sm:text-xs text-[#8f8287] line-through font-sans-body">
                      {currencySymbol}{product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-[#f5f2f0]">
              <button
                onClick={() => onAddToCart(product)}
                className="py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl border border-[#e4e0dc] text-[#53434b] text-[10px] sm:text-xs font-semibold hover:bg-[#f6f4f2] hover:text-[#1b1c1c] transition-colors flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#745663] shrink-0" />
                <span className="truncate">Add</span>
              </button>
              <button
                onClick={() => onBuyNow(product)}
                className="py-1.5 sm:py-2 px-1 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#745663] hover:bg-[#5c434e] text-white text-[10px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer text-center whitespace-nowrap"
              >
                <span className="truncate">Order</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
