import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import HeroScrollScene from './components/HeroScrollScene';
import MainPage2 from './components/MainPage2';
import ProductCatalog from './components/ProductCatalog';
import ArtisanalStory from './components/ArtisanalStory';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import { PRODUCTS } from './data/products';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cartItems, setCartItems] = useState([
    {
      product: PRODUCTS[0],
      color: PRODUCTS[0].colors[0],
      monogram: 'A.N. (Gold Foil)',
      quantity: 1,
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('main2') || hash.includes('main2')) {
        return 'main2';
      }
    }
    return 'main1';
  });

  // Handle URL route changes (/main2, #main2, /)
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('main2') || hash.includes('main2')) {
        setActivePage('main2');
      } else {
        setActivePage('main1');
      }
    };
    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  // When switching between Main Page 1 and Main Page 2, reset scroll position completely
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [activePage]);

  // Initialize Lenis Smooth Scroll and sync with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      window.__lenis = null;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToCart = (product, color, monogram = null) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.color.name === color.name && item.monogram === monogram
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      } else {
        return [...prev, { product, color, monogram, quantity: 1 }];
      }
    });

    showToast(`Added ${product.name} (${color.name}) to your bag`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const next = [...prev];
      next[index].quantity = newQuantity;
      return next;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-atelier-dark text-atelier-cream">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-atelier-card border border-atelier-gold text-atelier-gold text-xs font-mono tracking-wider flex items-center gap-3 shadow-2xl animate-bounce">
          <Check className="w-4 h-4 text-atelier-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation */}
      <Navbar
        cartCount={totalCartCount}
        activePage={activePage}
        onChangePage={(page) => {
          setActivePage(page);
          const targetUrl = page === 'main2' ? '/main2' : '/';
          window.history.pushState(null, '', targetUrl);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Pages: Main Page 1 (Heritage Hero) or Main Page 2 (Rigged Open Studio) */}
      <main id="hero">
        {activePage === 'main1' ? (
          <HeroScrollScene
            key="main1-scene"
            onAddToCart={handleAddToCart}
            onOpenQuickView={(product) => setQuickViewProduct(product)}
          />
        ) : (
          <MainPage2
            key="main2-scene"
            onAddToCart={handleAddToCart}
            onOpenQuickView={(product) => setQuickViewProduct(product)}
          />
        )}

        {/* Product Archive Catalog */}
        <ProductCatalog
          onAddToCart={handleAddToCart}
          onOpenQuickView={(product) => setQuickViewProduct(product)}
        />

        {/* Tuscan Heritage & Artisanal Narrative */}
        <ArtisanalStory />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Floating WhatsApp Message Button */}
      <a
        href="https://wa.me/?text=Hello%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20leather%20bags."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0d3b66] hover:bg-[#092b4d] text-white shadow-[0_8px_24px_rgba(13,59,102,0.6)] border border-atelier-gold/30 hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.9-1.026-3.13-2.955-3.225-3.083-.095-.127-.775-1.031-.775-1.966 0-.934.488-1.392.663-1.583.174-.191.381-.239.508-.239.127 0 .254.002.365.007.119.006.278-.045.435.334.16.386.549 1.341.597 1.437.048.096.08.209.016.335-.064.127-.096.206-.191.318-.096.111-.202.249-.289.334-.096.096-.197.2-.085.392.112.192.499.824 1.07 1.334.736.657 1.357.86 1.549.956.191.096.303.08.414-.048.112-.127.477-.557.604-.748.127-.191.254-.159.429-.096.175.064 1.112.524 1.303.62.191.096.318.143.365.223.047.079.047.461-.097.866zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.981-1.399C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-atelier-card text-atelier-cream text-xs font-medium tracking-wide shadow-xl border border-atelier-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />
    </div>
  );
}
