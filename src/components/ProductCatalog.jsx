import React, { useState, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { Star, Eye, ShoppingBag, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

export default function ProductCatalog({ onAddToCart, onOpenQuickView }) {
  const [selectedColorMap, setSelectedColorMap] = useState({
    'florence-satchel-04': PRODUCTS[0].colors[0],
    'verona-briefcase-02': PRODUCTS[1].colors[0],
    'siena-weekender-07': PRODUCTS[2].colors[0],
    'lucca-crossbody-01': PRODUCTS[3].colors[0],
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const handleColorPick = (productId, color) => {
    setSelectedColorMap(prev => ({ ...prev, [productId]: color }));
  };

  const scrollToIndex = (idx) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.children[0]?.offsetWidth || 300;
    sliderRef.current.scrollTo({
      left: idx * (cardWidth + 20),
      behavior: 'smooth'
    });
    setActiveSlide(idx);
  };

  const handleScroll = (e) => {
    const cardWidth = e.currentTarget.children[0]?.offsetWidth || 300;
    const scrollPos = e.currentTarget.scrollLeft;
    const currentIdx = Math.round(scrollPos / (cardWidth + 20));
    setActiveSlide(Math.min(PRODUCTS.length - 1, Math.max(0, currentIdx)));
  };

  return (
    <section id="collection" className="py-24 px-6 md:px-16 lg:px-24 bg-atelier-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 md:gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-atelier-gold font-mono block mb-2">
              CURATED LEATHER GOODS
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-atelier-cream font-medium tracking-tight">
              THE PERMANENT ARCHIVE
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <p className="text-atelier-sand text-xs sm:text-sm md:text-base max-w-md font-light">
              Each bag is made in small batches in Florence using traditional saddle-making machinery and hand-set copper and brass rivets.
            </p>

            {/* Mobile swipe hint and nav arrows */}
            <div className="flex items-center justify-between w-full md:hidden pt-2 border-t border-atelier-border/40">
              <span className="text-[10px] uppercase tracking-widest text-atelier-gold font-mono flex items-center gap-1.5">
                <MoveHorizontal className="w-3.5 h-3.5 animate-pulse" />
                Swipe to browse ({activeSlide + 1}/{PRODUCTS.length})
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollToIndex(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="p-1.5 rounded bg-atelier-card border border-atelier-border disabled:opacity-30 text-atelier-cream hover:text-atelier-gold"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToIndex(Math.min(PRODUCTS.length - 1, activeSlide + 1))}
                  disabled={activeSlide === PRODUCTS.length - 1}
                  className="p-1.5 rounded bg-atelier-card border border-atelier-border disabled:opacity-30 text-atelier-cream hover:text-atelier-gold"
                  aria-label="Next product"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards: Swipeable Horizontal Carousel on Mobile • Grid on Desktop */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 pt-2 -mx-6 px-6 scrollbar-none md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PRODUCTS.map((product) => {
            const activeColor = selectedColorMap[product.id] || product.colors[0];

            return (
              <div
                key={product.id}
                className="w-[84vw] max-w-[320px] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none group luxury-glass border border-atelier-border/70 hover:border-atelier-gold/40 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Visual Preview Container with High-Res Bag PNG (No Background) */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-atelier-card to-atelier-surface/90 overflow-hidden p-4 flex items-center justify-center">
                  {/* Badge */}
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-atelier-dark/80 backdrop-blur-md border border-atelier-border text-[9px] tracking-widest text-atelier-gold uppercase font-mono">
                    {product.badge}
                  </span>

                  {/* Real Bag PNG with Dynamic Colorway Switching & No Background */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={activeColor.image || '/products/bag-cognac.png'}
                      alt={`${product.name} - ${activeColor.name}`}
                      className="w-auto h-full max-h-[85%] object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)] transition-all duration-500 transform group-hover:scale-108"
                    />
                  </div>

                  {/* Quick View Button Hover Overlay */}
                  <div className="absolute inset-0 bg-atelier-dark/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
                    <button
                      onClick={() => onOpenQuickView(product)}
                      className="px-4 py-2 bg-atelier-cream text-atelier-dark text-xs uppercase tracking-widest font-semibold flex items-center gap-2 hover:bg-atelier-gold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Rating & Review */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-atelier-gold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-atelier-muted tracking-wider uppercase font-mono">
                        {product.reviewsCount} Patron Reviews
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl sm:text-2xl text-atelier-cream font-medium group-hover:text-atelier-gold transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-atelier-sand/80 font-light mb-4 line-clamp-2">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Bottom: Color Swatches + Price + Add to Cart */}
                  <div className="pt-4 border-t border-atelier-border/60">
                    <div className="flex items-center justify-between mb-4">
                      {/* Color swatches */}
                      <div className="flex items-center gap-2">
                        {product.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => handleColorPick(product.id, c)}
                            className={`w-4 h-4 rounded-full border transition-all ${
                              activeColor.name === c.name
                                ? 'scale-125 border-atelier-gold ring-1 ring-atelier-gold/60'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      {/* Price */}
                      <span className="font-editorial text-xl text-atelier-cream font-semibold">
                        ${product.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenQuickView(product)}
                        className="py-2.5 bg-atelier-card hover:bg-atelier-surface text-atelier-sand hover:text-atelier-cream border border-atelier-border text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 md:hidden"
                      >
                        <Eye className="w-3 h-3" />
                        Inspect
                      </button>

                      <button
                        onClick={() => onAddToCart(product, activeColor)}
                        className="col-span-1 md:col-span-2 py-2.5 bg-atelier-gold hover:bg-atelier-cream text-atelier-dark text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Pagination Dots Indicator */}
        <div className="flex md:hidden items-center justify-center gap-2 pt-4">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === i ? 'w-6 bg-atelier-gold' : 'w-1.5 bg-atelier-cream/20'
              }`}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
