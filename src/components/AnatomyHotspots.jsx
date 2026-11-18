import React, { useState } from 'react';
import { CRAFT_HOTSPOTS } from '../data/products';
import { Sparkles, Layers, ShieldCheck, Hammer, ArrowRight } from 'lucide-react';

export default function AnatomyHotspots() {
  const [selectedHotspot, setSelectedHotspot] = useState(CRAFT_HOTSPOTS[0]);

  return (
    <section id="anatomy" className="relative py-28 px-6 md:px-16 lg:px-24 bg-atelier-surface/90 border-t border-atelier-border">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-atelier-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-atelier-card border border-atelier-border text-atelier-gold text-xs tracking-widest uppercase">
            <Layers className="w-3.5 h-3.5" />
            Bench Craftsmanship
          </div>
          <h2 className="font-editorial text-4xl md:text-6xl text-atelier-cream font-medium tracking-tight mb-4">
            ANATOMY OF AN ICON
          </h2>
          <p className="font-script-calligraphy text-3xl md:text-4xl text-atelier-gold -mt-2 mb-3">
            Every stitch accounted for, every edge burnished by hand
          </p>
          <p className="text-atelier-sand text-sm md:text-base font-light">
            Constructed without synthetic stiffeners or chemical glues. Built according to traditional 19th-century French trunkmaker standards.
          </p>
        </div>

        {/* Interactive Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Hotspot Selection List */}
          <div className="lg:col-span-5 space-y-4">
            {CRAFT_HOTSPOTS.map((spot) => {
              const isActive = selectedHotspot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  className={`p-6 transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-atelier-card border-atelier-gold/60 shadow-xl shadow-atelier-accent/5 translate-x-2'
                      : 'bg-atelier-card/40 border-atelier-border/60 hover:border-atelier-border hover:bg-atelier-card/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-atelier-gold font-mono">
                      0{spot.id} • {spot.category}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-atelier-accent animate-ping" />
                    )}
                  </div>
                  <h3 className="font-editorial text-2xl text-atelier-cream font-medium mb-1">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-atelier-sand/80 font-light line-clamp-2">
                    {spot.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Feature Showcase with visual illustration */}
          <div className="lg:col-span-7">
            <div className="luxury-glass p-8 md:p-12 border border-atelier-border relative overflow-hidden">
              {/* Background watermark number */}
              <span className="absolute -bottom-10 -right-6 font-editorial text-[180px] font-bold text-atelier-card/40 select-none pointer-events-none">
                0{selectedHotspot.id}
              </span>

              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-atelier-gold/15 border border-atelier-gold/30 text-atelier-gold text-xs uppercase tracking-widest font-mono mb-4">
                  {selectedHotspot.category} Excellence
                </div>

                <h3 className="font-editorial text-3xl md:text-5xl text-atelier-cream mb-4 font-normal">
                  {selectedHotspot.title}
                </h3>

                <p className="text-atelier-sand text-base md:text-lg leading-relaxed mb-8 font-light">
                  {selectedHotspot.desc}
                </p>

                {/* Technical Specifications Callout */}
                <div className="p-4 bg-atelier-dark/80 border-l-2 border-atelier-accent mb-8">
                  <div className="text-[10px] uppercase tracking-widest text-atelier-gold mb-1 font-mono">
                    Artisanal Benchmark
                  </div>
                  <div className="text-sm text-atelier-cream font-medium">
                    {selectedHotspot.specs}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-atelier-border text-xs text-atelier-muted">
                  <span>Certified Made in Italy</span>
                  <span className="text-atelier-gold flex items-center gap-1 font-mono">
                    100% Traceable Origin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
