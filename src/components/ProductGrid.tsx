import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ShoppingBag, Eye, SlidersHorizontal } from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  currencySymbol: string;
  searchQuery: string;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  currencySymbol,
  searchQuery,
  onBuyNow,
  onAddToCart,
  onViewDetails,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = [
    { id: 'All', label: 'All Products' },
    { id: 'Stitched', label: 'Stitched 3-Piece' },
    { id: 'Unstitched', label: 'Unstitched 3-Piece' },
    { id: 'Kids', label: 'Kids Wear' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCategory === 'Latest') {
      list = list.filter((p) => p.isLatest || p.badge === 'New Arrival');
    } else if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="shop-catalog" aria-labelledby="catalog-heading" className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
      
      {/* Category Tabs Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        
        {/* Category Pills matching the design system */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-1 px-1" role="tablist" aria-label="Product categories">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap tracking-wide transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#745663] text-white shadow-xs'
                    : 'bg-white text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#f6f4f2] border border-[#e4e0dc]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs sm:text-sm text-[#53434b]">
          <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#745663]" />
          <span className="font-semibold hidden sm:inline text-xs">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort products by"
            className="bg-white border border-[#e4e0dc] rounded-full px-3 py-1.5 text-xs font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#745663] cursor-pointer shadow-2xs"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter notification */}
      {searchQuery && (
        <div className="mb-6 p-3 bg-[#fdebf3] border border-[#fcd4e4] rounded-xl flex items-center justify-between text-xs text-[#53434b]">
          <span>
            Showing results for <strong className="text-[#1b1c1c]">"{searchQuery}"</strong> ({filteredProducts.length} items found)
          </span>
          <button
            onClick={() => onSelectCategory('All')}
            className="font-bold underline text-[#745663] hover:text-[#5c434e] cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-3xl border border-[#ede8e4] p-6 sm:p-8 shadow-xs">
          <p className="font-playfair text-lg sm:text-xl font-bold text-[#1b1c1c] mb-2">No matching dresses found</p>
          <p className="text-xs sm:text-sm text-[#53434b] mb-4">
            Try adjusting your search criteria or explore other luxury categories.
          </p>
          <button
            onClick={() => onSelectCategory('All')}
            className="px-6 py-2.5 rounded-full bg-[#745663] hover:bg-[#5c434e] text-white text-xs font-semibold tracking-wide cursor-pointer transition-colors shadow-xs"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              itemScope
              itemType="https://schema.org/Product"
              className="group flex flex-col justify-between rounded-2xl bg-white p-3 sm:p-4 shadow-2xs hover:shadow-xl transition-all duration-300 border border-[#ede8e4] hover:border-[#745663]/30"
            >
              {/* Top Details */}
              <div>
                {/* Image Container with Badge */}
                <div
                  onClick={() => onViewDetails(product)}
                  className="relative rounded-xl overflow-hidden mb-2 sm:mb-3 cursor-pointer bg-[#f2eeeb]"
                >
                  <OptimizedImage
                    src={product.imageUrl}
                    alt={`${product.name} - ${product.category} luxury dress | Ayesha Cotton`}
                    aspectRatio="aspect-[3/4]"
                  />

                  {/* Tag / Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#745663] border border-[#fcd4e4] shadow-2xs">
                    {product.badge || product.category}
                  </div>

                  {/* Stock Indicator if Low */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      Only {product.stock} left
                    </div>
                  )}

                  {/* Overlay Quick Actions on Hover */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(product);
                      }}
                      className="p-2 sm:p-2.5 rounded-full bg-white text-[#1b1c1c] hover:bg-[#745663] hover:text-white transition-colors shadow-md border border-[#ede8e4] cursor-pointer"
                      title="Quick Details"
                      aria-label={`Quick details for ${product.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="p-2 sm:p-2.5 rounded-full bg-white text-[#1b1c1c] hover:bg-[#745663] hover:text-white transition-colors shadow-md border border-[#ede8e4] cursor-pointer"
                      title="Add to Cart"
                      aria-label={`Add ${product.name} to bag`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#8f8287]">
                    <span>{product.fabricDetails || 'Luxury Fabric'}</span>
                    <span className={product.stock > 0 ? 'text-[#006d2f] font-semibold' : 'text-[#ba1a1a] font-semibold'}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                    </span>
                  </div>

                  <h3
                    onClick={() => onViewDetails(product)}
                    itemProp="name"
                    className="font-playfair text-base sm:text-lg font-bold text-[#1b1c1c] line-clamp-1 hover:text-[#745663] cursor-pointer transition-colors"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="priceCurrency" content="BDT" />
                    <meta itemProp="price" content={String(product.price)} />
                    <p className="text-sm sm:text-base font-bold text-[#745663] font-playfair">
                      {currencySymbol}{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-[11px] sm:text-xs text-[#8f8287] line-through font-sans-body">
                        {currencySymbol}{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-3 pt-2 border-t border-[#f5f2f0]">
                <button
                  onClick={() => onAddToCart(product)}
                  className="py-2 sm:py-2.5 px-2 rounded-xl border border-[#e4e0dc] text-[#53434b] text-[11px] sm:text-xs font-semibold hover:bg-[#f6f4f2] hover:text-[#1b1c1c] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#745663]" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => onBuyNow(product)}
                  className="py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#745663] hover:bg-[#5c434e] text-white text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer text-center"
                >
                  Buy Now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
