import React from 'react';
import { BRAND_STATS } from '../data/products';
import { Compass, Feather, Award, Heart } from 'lucide-react';

export default function ArtisanalStory() {
  return (
    <section id="heritage" className="py-28 px-6 md:px-16 lg:px-24 bg-atelier-dark relative overflow-hidden border-t border-atelier-border/80">
      {/* Subtle ambient lighting */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-atelier-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Editorial Quote Banner */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono block mb-4">
            MAISON PHILOSOPHY
          </span>
          <blockquote className="font-editorial text-3xl md:text-5xl lg:text-6xl text-atelier-cream leading-[1.15] font-light italic mb-6">
            “We do not design objects for a season. We craft companions that absorb the sun, the rain, and the stories of your life.”
          </blockquote>
          <cite className="block text-xs uppercase tracking-[0.25em] text-atelier-sand not-italic font-mono">
            — Marco Della Rovere, Master Cordwainer & Founder
          </cite>
        </div>

        {/* 4 Pillars Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {BRAND_STATS.map((stat, i) => (
            <div
              key={i}
              className="p-8 luxury-glass border border-atelier-border/60 hover:border-atelier-gold/40 transition-colors text-center"
            >
              <div className="font-editorial text-4xl md:text-5xl text-atelier-gold font-normal mb-2">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-atelier-cream font-medium mb-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-atelier-muted font-light">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Story Two-Column Editorial Layout */}
        <div className="max-w-3xl mx-auto">
          {/* Atmospheric Workshop Panel */}
          <div className="relative p-8 md:p-12 luxury-glass border border-atelier-border/80 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-atelier-gold/10 rounded-full blur-2xl" />

            <span className="text-[10px] uppercase tracking-widest text-atelier-gold font-mono block mb-3">
              THE WORKSHOP • VIA DEI TESSITORI
            </span>
            <h3 className="font-editorial text-3xl md:text-4xl text-atelier-cream font-medium mb-6">
              Generations of Quiet Mastery
            </h3>
            <p className="text-atelier-sand text-sm leading-relaxed mb-4 font-light">
              Within our riverside atelier overlooking the Arno, no assembly lines exist. One artisan cuts, bevels, stitches, and polishes each bag from raw hide to completed piece.
            </p>
            <p className="text-atelier-sand text-sm leading-relaxed font-light mb-8">
              The edges are burnished seven times using raw beeswax melted over an open flame—a traditional technique that bonds the leather fibers permanently against moisture.
            </p>

            <div className="flex items-center gap-6 pt-6 border-t border-atelier-border text-xs text-atelier-cream/80">
              <span className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-atelier-gold" />
                No Plastics or PVC
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-atelier-gold" />
                Vera Pelle Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
