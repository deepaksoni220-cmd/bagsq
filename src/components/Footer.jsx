import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer id="contact" className="bg-atelier-dark text-atelier-cream border-t border-atelier-border/80 pt-24 pb-12 px-6 md:px-16 lg:px-24 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Newsletter & Atelier Gazette */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-atelier-border/60">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono block mb-2">
              THE ATELIER DISPATCH
            </span>
            <h3 className="font-editorial text-3xl md:text-4xl font-medium mb-3">
              Receive Private Bench Releases
            </h3>
            <p className="text-atelier-sand text-sm font-light max-w-md">
              Gain exclusive first invitation to limited batch archive releases, seasonal patina retrospectives, and masterclass invitations.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            {subscribed ? (
              <div className="p-4 bg-atelier-card border border-atelier-gold/40 text-atelier-gold flex items-center gap-2 text-xs font-mono tracking-wider">
                <Check className="w-4 h-4" />
                You are welcomed into our private dispatch list.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-5 py-3.5 bg-atelier-card border border-atelier-border text-atelier-cream text-xs placeholder:text-atelier-muted focus:outline-none focus:border-atelier-gold flex-1"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-atelier-gold text-atelier-dark hover:bg-atelier-cream font-semibold text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
                >
                  Join Gazette
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <span className="text-[10px] text-atelier-muted mt-2 font-mono">
              Zero spam. Dispatched unhurriedly no more than twice per season.
            </span>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 text-xs font-light">
          <div>
            <h4 className="font-editorial text-lg text-atelier-cream font-medium mb-4 uppercase tracking-wider">
              Permanent Archive
            </h4>
            <ul className="space-y-2.5 text-atelier-sand">
              <li><a href="#collection" className="hover:text-atelier-gold transition-colors">The Florence Satchel</a></li>
              <li><a href="#collection" className="hover:text-atelier-gold transition-colors">The Verona Folio</a></li>
              <li><a href="#collection" className="hover:text-atelier-gold transition-colors">The Siena Weekender</a></li>
              <li><a href="#collection" className="hover:text-atelier-gold transition-colors">The Lucca Crossbody</a></li>
              <li><a href="#collection" className="hover:text-atelier-gold transition-colors">Small Leather Goods</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-editorial text-lg text-atelier-cream font-medium mb-4 uppercase tracking-wider">
              Atelier & Craft
            </h4>
            <ul className="space-y-2.5 text-atelier-sand">
              <li><a href="#heritage" className="hover:text-atelier-gold transition-colors">Tuscan Vacchetta</a></li>
              <li><a href="#heritage" className="hover:text-atelier-gold transition-colors">Hand-Forged Brass</a></li>
              <li><a href="#heritage" className="hover:text-atelier-gold transition-colors">Double Saddle Stitching</a></li>
              <li><a href="#heritage" className="hover:text-atelier-gold transition-colors">Patina Guide & Care</a></li>
              <li><a href="#heritage" className="hover:text-atelier-gold transition-colors">Bespoke Monogramming</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-editorial text-lg text-atelier-cream font-medium mb-4 uppercase tracking-wider">
              Concierge Service
            </h4>
            <ul className="space-y-2.5 text-atelier-sand">
              <li><a href="#" className="hover:text-atelier-gold transition-colors">Complimentary Spa Reconditioning</a></li>
              <li><a href="#" className="hover:text-atelier-gold transition-colors">Lifetime Warranty Claim</a></li>
              <li><a href="#" className="hover:text-atelier-gold transition-colors">Global Insured Courier</a></li>
              <li><a href="#" className="hover:text-atelier-gold transition-colors">Certificate of Authenticity</a></li>
              <li><a href="#" className="hover:text-atelier-gold transition-colors">Private Client Appointment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-editorial text-lg text-atelier-cream font-medium mb-4 uppercase tracking-wider">
              Maison
            </h4>
            <p className="text-atelier-sand/80 leading-relaxed mb-4">
              Aurevia Pte. Ltd.<br />
              260 Orchard Road, The Heeren<br />
              #12-01, Singapore 238855
            </p>
            <p className="font-mono text-[11px] text-atelier-gold">
              1° 18' 14.8" N, 103° 50' 16.2" E
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-atelier-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-atelier-muted font-mono">
          <div>
            © AUREVIA ESPACE NOVICE SINGAPORE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-atelier-cream transition-colors">TERMS OF PATRONAGE</a>
            <a href="#" className="hover:text-atelier-cream transition-colors">PRIVACY DOSSIER</a>
            <a href="#" className="hover:text-atelier-cream transition-colors">SUSTAINABILITY CERTIFICATE</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
