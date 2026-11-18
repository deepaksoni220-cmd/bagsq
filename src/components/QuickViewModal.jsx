import React, { useState } from 'react';
import { X, Check, Shield, Truck, Sparkles, ShoppingBag } from 'lucide-react';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [monogram, setMonogram] = useState('');
  const [monogramFoil, setMonogramFoil] = useState('gold');

  const handleAdd = () => {
    onAddToCart(product, selectedColor, monogram ? `${monogram.toUpperCase()} (${monogramFoil})` : null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-atelier-surface border border-atelier-border max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-atelier-sand hover:text-atelier-gold p-2 bg-atelier-dark/60 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Showcase */}
          <div
            className="p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]"
            style={{
              background: `radial-gradient(circle at center, ${selectedColor.hex}33 0%, #120d0a 80%)`
            }}
          >
            {/* Bag Model Representation with Dynamic Color */}
            <div
              className="w-52 h-44 rounded-2xl shadow-2xl relative border border-white/20 flex flex-col items-center justify-center p-4 transition-all duration-500"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <div className="w-24 h-5 border-2 border-white/40 rounded-t-lg -mt-8 mb-2" />
              <div className="w-full h-10 bg-black/30 rounded-md flex items-center justify-center">
                <div className="w-6 h-7 bg-atelier-gold rounded-sm border border-yellow-200/80 shadow" />
              </div>

              {/* Monogram Hot-Stamp Simulation */}
              {monogram && (
                <div
                  className={`absolute bottom-3 right-4 font-serif text-xs font-bold tracking-widest px-2 py-0.5 rounded shadow ${
                    monogramFoil === 'gold'
                      ? 'text-yellow-200 bg-yellow-950/60 border border-yellow-500/40'
                      : 'text-zinc-200 bg-zinc-900/60 border border-zinc-400/40'
                  }`}
                >
                  {monogram.toUpperCase()}
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <span className="text-[11px] uppercase tracking-widest text-atelier-gold font-mono block">
                Finish: {selectedColor.name}
              </span>
              <span className="text-xs text-atelier-muted">
                {product.dimensions} • {product.weight}
              </span>
            </div>
          </div>

          {/* Right Column: Configuration & Details */}
          <div className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-atelier-gold font-mono mb-2">
                {product.badge}
              </div>
              <h2 className="font-editorial text-3xl md:text-4xl text-atelier-cream font-medium mb-1">
                {product.name}
              </h2>
              <div className="font-editorial text-2xl text-atelier-gold mb-4">
                ${product.price} USD
              </div>

              <p className="text-atelier-sand text-xs md:text-sm font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Leather Color Selection */}
              <div className="mb-6">
                <label className="text-[11px] uppercase tracking-widest text-atelier-muted font-mono block mb-2">
                  Select Leather Hide Colorway
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${
                        selectedColor.name === c.name
                          ? 'border-atelier-gold bg-atelier-card text-atelier-gold'
                          : 'border-atelier-border text-atelier-sand hover:border-atelier-muted'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Monogramming Personalization */}
              <div className="mb-6 p-4 bg-atelier-card/60 border border-atelier-border">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] uppercase tracking-widest text-atelier-gold font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Complimentary Monogram (Up to 3 Initials)
                  </label>
                  <span className="text-[10px] text-atelier-muted">Free Service</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="e.g. A.N."
                    value={monogram}
                    onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                    className="w-24 px-3 py-1.5 bg-atelier-dark border border-atelier-border text-atelier-cream font-serif text-sm tracking-widest uppercase focus:outline-none focus:border-atelier-gold"
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => setMonogramFoil('gold')}
                      className={`px-2.5 py-1 text-[11px] border ${
                        monogramFoil === 'gold'
                          ? 'border-atelier-gold text-atelier-gold bg-atelier-dark'
                          : 'border-transparent text-atelier-muted'
                      }`}
                    >
                      Gold Foil
                    </button>
                    <button
                      onClick={() => setMonogramFoil('blind')}
                      className={`px-2.5 py-1 text-[11px] border ${
                        monogramFoil === 'blind'
                          ? 'border-atelier-cream text-atelier-cream bg-atelier-dark'
                          : 'border-transparent text-atelier-muted'
                      }`}
                    >
                      Blind Deboss
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature bullets */}
              <ul className="space-y-1.5 mb-6 text-xs text-atelier-sand/80 font-light">
                {product.details.slice(0, 3).map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-atelier-gold shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Bag Action */}
            <div className="pt-4 border-t border-atelier-border">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 bg-atelier-gold text-atelier-dark hover:bg-atelier-cream text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Atelier Bag • ${product.price} USD
              </button>
              <div className="flex items-center justify-center gap-6 mt-3 text-[10px] text-atelier-muted">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Worldwide Insured Express
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Lifetime Warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
