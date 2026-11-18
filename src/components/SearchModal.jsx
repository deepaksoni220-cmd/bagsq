import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.tagline.toLowerCase().includes(query.toLowerCase()) ||
    p.leatherType.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-atelier-surface border border-atelier-border p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-atelier-border mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-atelier-gold" />
            <input
              type="text"
              autoFocus
              placeholder="Search products, leather grades, hardware..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-atelier-cream placeholder:text-atelier-muted text-base focus:outline-none"
            />
          </div>
          <button onClick={onClose} className="text-atelier-sand hover:text-atelier-gold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-atelier-muted py-6 text-center">No pieces found matching "{query}"</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="p-3 bg-atelier-card/40 hover:bg-atelier-card border border-atelier-border/50 hover:border-atelier-gold/40 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="font-editorial text-lg text-atelier-cream">{item.name}</h4>
                  <p className="text-xs text-atelier-sand font-light">{item.tagline} • ${item.price}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-atelier-gold" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
