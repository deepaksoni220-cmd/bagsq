import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Sparkles } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, onOpenSearch, activePage, onChangePage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: 'MAIN PAGE',
      id: 'main1',
      href: '/',
      onClick: (e) => {
        if (e && e.preventDefault) e.preventDefault();
        onChangePage('main1');
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    },
    {
      name: 'MAIN PAGE 2',
      id: 'main2',
      href: '/main2',
      onClick: (e) => {
        if (e && e.preventDefault) e.preventDefault();
        onChangePage('main2');
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    },
    {
      name: 'PRODUCTS',
      id: 'products',
      onClick: (e) => {
        e.preventDefault();
        const el = document.getElementById('collection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      name: 'ABOUT US',
      id: 'about',
      onClick: (e) => {
        e.preventDefault();
        const el = document.getElementById('heritage');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      name: 'CONTACT US',
      id: 'contact',
      onClick: (e) => {
        e.preventDefault();
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-atelier-dark/95 backdrop-blur-md border-b-0 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-atelier-dark/90 via-atelier-dark/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onChangePage('main1');
              if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="group flex flex-col"
          >
            <span className="font-editorial text-2xl md:text-3xl tracking-[0.2em] text-atelier-cream uppercase font-semibold group-hover:text-atelier-gold transition-colors leading-none">
              AUREVIA
            </span>
            <span className="hidden sm:block text-[8px] uppercase tracking-[0.4em] text-atelier-gold/80 font-mono mt-1 group-hover:text-atelier-cream transition-colors">
              ESPACE NOVICE • SINGAPORE
            </span>
          </a>
        </div>

        {/* Center: 5 Button Navigation Layout */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-atelier-card/50 backdrop-blur-md border border-atelier-border/60 rounded-full">
          {navLinks.map((link) => {
            const isActive =
              (link.id === 'main1' && activePage === 'main1') ||
              (link.id === 'main2' && activePage === 'main2');

            return (
              <a
                key={link.name}
                href={link.href || `#${link.id}`}
                onClick={link.onClick}
                className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300 rounded-full flex items-center justify-center whitespace-nowrap ${
                  isActive
                    ? 'text-atelier-dark bg-atelier-gold font-semibold shadow-md shadow-atelier-gold/20'
                    : 'text-atelier-cream/80 hover:text-atelier-cream hover:bg-atelier-surface/60'
                }`}
              >
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Utility Buttons (Search, Profile, Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
          <button
            onClick={onOpenSearch}
            className="p-1.5 sm:p-2.5 text-atelier-cream/80 hover:text-atelier-gold hover:bg-atelier-card/60 rounded-full transition-all border border-transparent hover:border-atelier-border"
            aria-label="Search archive"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            className="hidden sm:flex p-2.5 text-atelier-cream/80 hover:text-atelier-gold hover:bg-atelier-card/60 rounded-full transition-all border border-transparent hover:border-atelier-border"
            aria-label="Account"
            title="Patron Profile"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-atelier-card hover:bg-atelier-cardHover border border-atelier-border hover:border-atelier-gold/50 rounded-full text-atelier-cream hover:text-atelier-gold transition-all flex items-center gap-1.5 sm:gap-2 group shadow-sm"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-mono font-medium hidden sm:inline">BAG</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 bg-atelier-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-atelier-cream hover:text-atelier-gold transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-atelier-surface/98 backdrop-blur-2xl border-b border-atelier-border p-6 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link, idx) => {
              const isActive =
                (link.id === 'main1' && activePage === 'main1') ||
                (link.id === 'main2' && activePage === 'main2');

              return (
                <a
                  key={link.name}
                  href={link.href || `#${link.id}`}
                  onClick={(e) => {
                    link.onClick(e);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3.5 rounded-lg text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-between border transition-all ${
                    isActive
                      ? 'bg-atelier-gold text-atelier-dark font-semibold border-atelier-gold'
                      : 'bg-atelier-card/40 text-atelier-cream border-atelier-border/60 hover:bg-atelier-card'
                  }`}
                >
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
