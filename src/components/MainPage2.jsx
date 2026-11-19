import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronRight, FolderOpen, Folder } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const TOTAL_FRAMES = 47;

// Mapping of color hex to transparent PNG paths
const NO_BG_IMAGES = {
  '#955127': {
    closed: '/frames_nobg/bag_closed_cognac.png',
    open: '/frames_nobg/bag_open_cognac.png',
  },
  '#7b2608': {
    closed: '/frames_nobg/bag_closed_rust.png',
    open: '/frames_nobg/bag_open_rust.png',
  },
  '#241b16': {
    closed: '/frames_nobg/bag_closed_noir.png',
    open: '/frames_nobg/bag_open_noir.png',
  },
  '#581c20': {
    closed: '/frames_nobg/bag_closed_oxblood.png',
    open: '/frames_nobg/bag_open_oxblood.png',
  },
};

export default function MainPage2({ onAddToCart, onOpenQuickView }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const activeBag = PRODUCTS[0];

  const [currentColor, setCurrentColor] = useState(activeBag.colors[0]);
  const currentColorRef = useRef(activeBag.colors[0]);
  currentColorRef.current = currentColor;

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const imagesRef = useRef([]);
  const noBgCacheRef = useRef({});
  const currentFrameIndexRef = useRef(0);
  const animTweenRef = useRef(null);

  // Preload all frames and transparent PNGs into memory
  useEffect(() => {
    const images = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/frame_${frameNum}.webp?v=2`;

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === 1) {
          renderFrame(0);
        }
        if (loaded === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    // Preload transparent PNG images for all colorways (closed & open states)
    Object.entries(NO_BG_IMAGES).forEach(([hex, paths]) => {
      const closedImg = new Image();
      closedImg.src = paths.closed;
      const openImg = new Image();
      openImg.src = paths.open;
      noBgCacheRef.current[hex] = { closed: closedImg, open: openImg };
    });

    const handleResize = () => {
      renderFrame(currentFrameIndexRef.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animTweenRef.current) animTweenRef.current.kill();
    };
  }, []);

  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.parentElement.clientWidth;
    const displayHeight = canvas.parentElement.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Fill permanent studio background (NEVER shifts color when changing swatches!)
    ctx.fillStyle = '#322f26';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const isMobile = displayWidth < 768;
    const currentHex = currentColorRef.current.hex;

    // 2. Select image:
    // If at frame 0 (closed) or last frame (open), use the transparent cutout PNG in that chosen colorway!
    // If in mid-animation, use the sequence frame with soft overlay
    let img = null;
    if (index === 0 && noBgCacheRef.current[currentHex]?.closed?.complete) {
      img = noBgCacheRef.current[currentHex].closed;
    } else if (index === TOTAL_FRAMES - 1 && noBgCacheRef.current[currentHex]?.open?.complete) {
      img = noBgCacheRef.current[currentHex].open;
    } else {
      img = imagesRef.current[index];
    }

    if (!img || !img.complete || img.naturalWidth === 0) {
      ctx.restore();
      return;
    }

    let drawW, drawH, drawX, drawY;

    if (isMobile) {
      const scale = Math.max(displayWidth / img.naturalWidth, displayHeight / img.naturalHeight);
      drawW = img.naturalWidth * scale;
      drawH = img.naturalHeight * scale;
      drawX = (displayWidth - drawW) / 2;
      drawY = (displayHeight - drawH) / 2;
    } else {
      const maxH = displayHeight * 0.68;
      const maxW = Math.min(displayWidth * 0.65, 750);
      const imgRatio = img.naturalWidth / img.naturalHeight;

      if (maxW / maxH < imgRatio) {
        drawW = maxW;
        drawH = drawW / imgRatio;
      } else {
        drawH = maxH;
        drawW = drawH * imgRatio;
      }

      drawX = (displayWidth - drawW) / 2;
      drawY = (displayHeight - drawH) / 2 + 20;
    }

    ctx.filter = 'none';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  };

  // Toggle Open/Close Bag: smoothly plays the sequence forward or backward to open/close
  const handleToggleOpenBag = () => {
    if (animTweenRef.current) animTweenRef.current.kill();

    const nextState = !isBagOpen;
    setIsBagOpen(nextState);
    setIsPlaying(true);

    const targetFrame = nextState ? TOTAL_FRAMES - 1 : 0;
    const currentFrame = currentFrameIndexRef.current;
    const distance = Math.abs(targetFrame - currentFrame);
    const duration = Math.max(0.6, (distance / TOTAL_FRAMES) * 1.8);

    const progressObj = { frame: currentFrame };

    animTweenRef.current = gsap.to(progressObj, {
      frame: targetFrame,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const f = Math.round(progressObj.frame);
        if (f !== currentFrameIndexRef.current) {
          currentFrameIndexRef.current = f;
          renderFrame(f);
        }
      },
      onComplete: () => {
        setIsPlaying(false);
      },
    });
  };

  // Continuous Play/Pause toggle
  const handleTogglePlay = () => {
    if (isPlaying) {
      if (animTweenRef.current) animTweenRef.current.kill();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const targetFrame = currentFrameIndexRef.current >= TOTAL_FRAMES - 1 ? 0 : TOTAL_FRAMES - 1;
      const progressObj = { frame: currentFrameIndexRef.current };

      animTweenRef.current = gsap.to(progressObj, {
        frame: targetFrame,
        duration: 1.8,
        ease: 'power1.inOut',
        onUpdate: () => {
          const f = Math.round(progressObj.frame);
          if (f !== currentFrameIndexRef.current) {
            currentFrameIndexRef.current = f;
            renderFrame(f);
          }
        },
        onComplete: () => {
          setIsBagOpen(targetFrame === TOTAL_FRAMES - 1);
          setIsPlaying(false);
        },
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#322f26] select-none"
    >
      {/* Background Lighting Aura matching leather tone */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[750px] rounded-full bg-gradient-to-tr from-[#955127]/30 via-[#322f26]/40 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-atelier-gold/15 blur-[140px]" />
      </div>

      {/* Frame Sequence HTML5 Canvas (Button controlled) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full block drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* HERO BANNER CONTENT */}
      <div className="absolute inset-0 z-20 flex flex-col justify-start pt-28 sm:pt-32 md:pt-0 md:justify-center px-6 md:px-16 lg:px-24 pointer-events-none">
        <div className="max-w-xl">
          <h1 className="font-editorial text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-atelier-cream leading-[0.98] mb-2 sm:mb-4">
            UNFOLD THE CRAFT.
            <span className="block text-focus-rust font-semibold mt-1">
              INSIDE THE BAG.
            </span>
          </h1>

          <p className="text-atelier-sand text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-md font-light">
            Watch the unboxing sequence unfold with instant frame precision. Release the roller buckle and explore the handcrafted interior.
          </p>

          {/* Action Buttons: OPEN BAG */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 pointer-events-auto">
            <button
              onClick={handleToggleOpenBag}
              className={`px-6 md:px-8 py-3 md:py-3.5 transition-all duration-300 rounded-none text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase flex items-center gap-2.5 md:gap-3 shadow-lg ${
                isBagOpen
                  ? 'bg-atelier-gold text-atelier-dark shadow-atelier-gold/30'
                  : 'bg-atelier-cream text-atelier-dark hover:bg-atelier-gold hover:shadow-atelier-gold/20'
              }`}
            >
              {isBagOpen ? (
                <Folder className="w-3.5 h-3.5 md:w-4 md:h-4" />
              ) : (
                <FolderOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
              )}
              <span>{isBagOpen ? 'CLOSE BAG' : 'OPEN BAG'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS & COLORWAYS BAR */}
      <div className="absolute inset-x-0 bottom-3 sm:bottom-6 md:bottom-10 z-20 px-3 sm:px-6 md:px-16 pointer-events-auto">
        <div className="max-w-4xl mx-auto luxury-glass p-3.5 sm:p-5 md:p-6 border border-atelier-gold/25 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Left: Product Info */}
          <div className="w-full md:w-auto text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-atelier-gold text-[10px] md:text-xs tracking-widest uppercase mb-0.5">
              <span>CRAFTED MASTERPIECE</span>
            </div>
            <h3 className="font-editorial text-lg sm:text-2xl text-atelier-cream font-medium leading-tight">
              {activeBag.name}
            </h3>
            <p className="text-[11px] text-atelier-sand mt-0.5 font-light">
              <span className="font-mono text-atelier-gold font-normal">${activeBag.price} USD</span> • Full Grain Tuscan Leather
            </p>
          </div>

          {/* Center: Live Colorways */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {activeBag.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setCurrentColor(color);
                    currentColorRef.current = color;
                    renderFrame(currentFrameIndexRef.current);
                  }}
                  title={color.name}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border transition-all flex items-center justify-center ${
                    currentColor.name === color.name
                      ? 'border-atelier-gold scale-110 shadow-lg shadow-atelier-gold/20 ring-2 ring-atelier-gold/30'
                      : 'border-atelier-border/80 hover:border-atelier-sand/60 opacity-80'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Right: Order CTA */}
          <div className="w-full md:w-auto">
            <button
              onClick={() => onAddToCart(activeBag, currentColor)}
              className="w-full md:w-auto px-6 py-3 bg-atelier-gold text-atelier-dark hover:bg-atelier-cream font-semibold tracking-widest text-[10px] md:text-xs uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              Order This Bag
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
