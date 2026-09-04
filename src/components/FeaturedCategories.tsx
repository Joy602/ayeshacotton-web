import React from 'react';
import { ArrowRight, Sparkles, HeartHandshake, Sparkle } from 'lucide-react';
import { Product } from '../types';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
  products?: Product[];
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onSelectCategory,
  selectedCategory,
  products = [],
}) => {
  // Dynamically find Retro Bloom image if available in products list, fallback to optimized local asset
  const retroBloomProduct = products.find((p) =>
    p.name?.toLowerCase().includes('retro bloom')
  );
  const threePcsImage =
    retroBloomProduct?.imageUrl && !retroBloomProduct.imageUrl.startsWith('data:')
      ? retroBloomProduct.imageUrl
      : '/images/retro_bloom.jpg';

  const latestProduct = products.find((p) => p.isLatest || p.category === 'Latest' || p.badge === 'New Arrival') || products[0];
  const latestImage =
    latestProduct?.imageUrl && !latestProduct.imageUrl.startsWith('data:')
      ? latestProduct.imageUrl
      : '/images/rakhi_cotton_unstitched_set.jpg';

  const categories = [
    {
      id: '3 pcs',
      title: '3 pcs Collection',
      tagline: 'Lawn, Silk & Chiffon Ensembles',
      description: 'Exclusive 3-piece luxury sets with intricate schiffli embroidery and digital dupattas.',
      image: threePcsImage,
      badge: 'Signature',
      icon: Sparkles,
      gradient: 'from-[#1b1c1c]/80 via-[#1b1c1c]/40 to-transparent',
    },
    {
      id: 'Kids',
      title: 'Kids Wear',
      tagline: 'Handmade Frocks & Custom Sets',
      description: 'Pure comfortable cotton, delicate lace trimmings, customized sizing from 0 to 6 years.',
      image: '/images/kids_red_floral_dress.jpg',
      badge: 'Handcrafted',
      icon: HeartHandshake,
      gradient: 'from-[#1b1c1c]/80 via-[#1b1c1c]/40 to-transparent',
    },
    {
      id: 'Latest',
      title: 'Latest Arrivals',
      tagline: 'New Season 2026 Drops',
      description: 'Fresh trending designs, limited festive pieces, and newly added handcrafted apparel.',
      image: latestImage,
      badge: 'New Drops',
      icon: Sparkle,
      gradient: 'from-[#1b1c1c]/80 via-[#1b1c1c]/40 to-transparent',
    },
  ];

  const handleCardClick = (catId: string) => {
    onSelectCategory(catId);
    const catalogElement = document.getElementById('shop-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section aria-labelledby="featured-categories-heading" className="max-w-[1280px] mx-auto px-3 sm:px-6 md:px-10 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#745663] uppercase">
            Curated Collections
          </span>
          <h2 id="featured-categories-heading" className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-[#1b1c1c]">
            Explore by Category
          </h2>
        </div>
        <button
          onClick={() => handleCardClick('All')}
          className="text-xs sm:text-sm font-semibold text-[#745663] hover:text-[#5c434e] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat.id)}
              className={`group relative h-64 sm:h-72 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border ${
                isSelected
                  ? 'border-[#745663] ring-2 ring-[#745663]/30 scale-[1.01]'
                  : 'border-[#ede8e4] hover:border-[#745663]/40'
              }`}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c]/90 via-[#1b1c1c]/30 to-transparent transition-opacity" />

              {/* Top Badge */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#745663] border border-white/40 shadow-xs">
                <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#745663]" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase">
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10 flex flex-col justify-end">
                <p className="text-[11px] sm:text-xs text-white/80 font-medium">
                  {cat.tagline}
                </p>
                <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-[#fdebf3] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/70 line-clamp-2 mb-3">
                  {cat.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#fdebf3] transition-colors">
                  <span>Browse Products</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
