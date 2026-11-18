import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (!isOpen) return null;

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingThreshold = 100;
  const isFreeShipping = subtotal >= shippingThreshold;

  const handleCheckout = () => {
    // Trigger celebratory luxury gold & champagne confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dfc08a', '#c97b41', '#f5eedc', '#874921'],
    });

    setCheckoutComplete(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutComplete(false);
      onClose();
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-atelier-surface border-l border-atelier-border p-6 md:p-8 flex flex-col justify-between shadow-2xl relative">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-atelier-border">
              <div>
                <h2 className="font-editorial text-2xl md:text-3xl text-atelier-cream font-medium">
                  YOUR ATELIER BAG
                </h2>
                <span className="text-[10px] tracking-widest uppercase text-atelier-gold font-mono">
                  {cartItems.length} {cartItems.length === 1 ? 'PIECE' : 'PIECES'} RESERVED
                </span>
              </div>

              <button
                onClick={onClose}
                className="text-atelier-sand hover:text-atelier-gold p-1"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="py-4 border-b border-atelier-border/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-atelier-cream flex items-center gap-1.5 font-light">
                  <Sparkles className="w-3.5 h-3.5 text-atelier-gold" />
                  {isFreeShipping ? 'Complimentary Global Courier Unlocked' : 'Add more for Complimentary Shipping'}
                </span>
                <span className="text-atelier-gold font-mono text-[11px]">
                  {isFreeShipping ? '100%' : `${Math.min(100, Math.round((subtotal / shippingThreshold) * 100))}%`}
                </span>
              </div>
              <div className="w-full h-1 bg-atelier-dark overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-atelier-accent to-atelier-gold transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* Checkout Success State */}
            {checkoutComplete ? (
              <div className="py-16 text-center animate-fadeIn">
                <div className="w-16 h-16 bg-atelier-gold/20 text-atelier-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-atelier-gold">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-3xl text-atelier-cream mb-2">
                  GRAZIE MILLE
                </h3>
                <p className="text-sm text-atelier-sand font-light max-w-xs mx-auto">
                  Your bespoke order has been registered at our Florentine bench. A confirmation and tracking dossier have been dispatched.
                </p>
              </div>
            ) : (
              /* Cart Items List */
              <div className="divide-y divide-atelier-border/50 max-h-[46vh] overflow-y-auto my-4 pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center text-atelier-muted">
                    <p className="font-editorial text-2xl text-atelier-sand mb-2">
                      Your bag is currently empty
                    </p>
                    <p className="text-xs">Explore the permanent archive and select your piece.</p>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={`${item.product.id}-${item.color.name}-${idx}`} className="py-4 flex gap-4">
                      {/* Mini Swatch / Thumbnail */}
                      <div
                        className="w-16 h-16 rounded border border-white/10 shrink-0 flex items-center justify-center shadow"
                        style={{ backgroundColor: item.color.hex }}
                      >
                        <div className="w-8 h-2 bg-black/30 rounded-full" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-editorial text-lg text-atelier-cream">
                            {item.product.name}
                          </h4>
                          <span className="font-editorial text-atelier-gold text-base">
                            ${item.product.price * item.quantity}
                          </span>
                        </div>

                        <div className="text-[11px] text-atelier-sand/80 mt-0.5">
                          Finish: <span className="text-atelier-cream">{item.color.name}</span>
                        </div>

                        {item.monogram && (
                          <div className="text-[10px] text-atelier-gold font-mono mt-0.5">
                            Embossed: {item.monogram}
                          </div>
                        )}

                        {/* Quantity and Remove */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-atelier-border text-xs">
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                              className="px-2 py-0.5 text-atelier-sand hover:text-atelier-gold"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-atelier-cream font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="px-2 py-0.5 text-atelier-sand hover:text-atelier-gold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-atelier-muted hover:text-red-400 p-1"
                            title="Remove piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer & Checkout button */}
          {!checkoutComplete && cartItems.length > 0 && (
            <div className="pt-4 border-t border-atelier-border space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-atelier-sand">
                  <span>Subtotal</span>
                  <span className="font-mono text-atelier-cream">${subtotal} USD</span>
                </div>
                <div className="flex justify-between text-atelier-sand">
                  <span>Insured Global Courier</span>
                  <span className="font-mono text-atelier-gold">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-atelier-cream font-medium text-base pt-2 border-t border-atelier-border/60">
                  <span>Estimated Total</span>
                  <span className="font-editorial text-2xl text-atelier-gold">${subtotal} USD</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-atelier-gold text-atelier-dark hover:bg-atelier-cream text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
              >
                Proceed to Secure Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-atelier-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-atelier-gold" />
                <span>Encrypted 256-bit checkout • Lifetime warranty guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
