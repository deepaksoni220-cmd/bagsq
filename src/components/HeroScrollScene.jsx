import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, RotateCw, Sparkles, ShieldCheck, ChevronRight, Eye, Check } from 'lucide-react';
import { buildLuxuryBag } from '../utils/bag3dBuilder';
import { PRODUCTS } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function HeroScrollScene({ onAddToCart, onOpenQuickView }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const activeBag = PRODUCTS[0]; // Florence Satchel No. 04

  const [currentColor, setCurrentColor] = useState(activeBag.colors[0]);
  const [activeStage, setActiveStage] = useState(1);
  const activeStageRef = useRef(1);
  activeStageRef.current = activeStage;

  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const isBagOpenRef = useRef(false);
  isBagOpenRef.current = isBagOpen;

  // References for Three.js objects
  const sceneRef = useRef(null);
  const bagModelRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });

  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const isHoveringBagRef = useRef(false);

  // WebGL & GSAP Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 2. Studio Lighting Setup
    // Warm Key Light (Luxury spotlight)
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.4);
    keyLight.position.set(5, 6, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0x36251b, 1.8);
    scene.add(ambientLight);

    // Rim/Back Light (Highlights leather silhouette & handle)
    const rimLight = new THREE.DirectionalLight(0xd9b582, 2.0);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // Subtle front fill light
    const fillLight = new THREE.DirectionalLight(0xc27845, 0.9);
    fillLight.position.set(0, -3, 5);
    scene.add(fillLight);

    // 3. Build the 3D Bag
    const bagData = buildLuxuryBag(parseInt(currentColor.hex.replace('#', '0x')));
    const bagGroup = bagData.group;
    bagModelRef.current = bagData;

    // Initial position matching the user's reference image
    // Slightly to the right, angled gently forward and left
    bagGroup.position.set(1.4, -0.15, 0);
    bagGroup.rotation.set(0.12, -0.32, 0.04);
    bagGroup.scale.set(1.08, 1.08, 1.08);
    scene.add(bagGroup);

    // 4. Subtle Particle Atmosphere (luxury dust motes in studio light)
    const particlesCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xdfc08a,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Responsive Resize Handler
    const handleResize = () => {
      if (!canvas || !renderer || !camera) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      camera.aspect = width / height;

      // Adjust camera distance and position for mobile screens so the bag sits below the text
      if (width < 768) {
        camera.position.z = 9.8;
        bagGroup.position.set(0, -1.35, 0);
        bagGroup.scale.set(0.9, 0.9, 0.9);
      } else {
        camera.position.z = 7.8;
        bagGroup.position.set(1.4, -0.15, 0);
        bagGroup.scale.set(1.08, 1.08, 1.08);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // 6. GSAP ScrollTrigger Master Timeline
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const flapScrollAnim = { progress: 0 };

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3200",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const prog = self.progress;
            if (prog < 0.28) {
              setActiveStage(1);
            } else if (prog < 0.60) {
              setActiveStage(2);
            } else if (prog < 0.85) {
              setActiveStage(3);
            } else {
              setActiveStage(4);
            }
          }
        }
      });

      // SECTION 1 -> SECTION 2: Transition from Hero shot to Side-angle craftsmanship showcase
      scrollTimeline
        .to(bagGroup.position, {
          x: -1.6,
          y: -0.1,
          z: 0.4,
          ease: "power2.inOut",
          duration: 1.5,
        }, 0)
        .to(bagGroup.rotation, {
          x: 0.05,
          y: 0.75, // Rotates to show rich 3D depth and side gusset
          z: -0.05,
          ease: "power2.inOut",
          duration: 1.5,
        }, 0)
        .to(bagGroup.scale, {
          x: 1.15,
          y: 1.15,
          z: 1.15,
          ease: "power2.inOut",
          duration: 1.5,
        }, 0)

        // SECTION 2 -> SECTION 3: Dramatic angle showcasing forged brass hardware & leather contour (bag stays closed)
        .to(bagGroup.position, {
          x: 0.9,
          y: -0.25,
          z: 0.8,
          ease: "power2.inOut",
          duration: 1.5,
        }, 1.5)
        .to(bagGroup.rotation, {
          x: 0.12,
          y: -0.42,
          z: 0.02,
          ease: "power2.inOut",
          duration: 1.5,
        }, 1.5)

        // SECTION 3 -> SECTION 4: Final showcase & interactive pedestal center
        .to(bagGroup.position, {
          x: 0,
          y: -0.3,
          z: 0.2,
          ease: "power3.out",
          duration: 1.5,
        }, 3.0)
        .to(bagGroup.rotation, {
          x: 0.08,
          y: -0.22,
          z: 0,
          ease: "power3.out",
          duration: 1.5,
        }, 3.0)
        .to(bagGroup.scale, {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          ease: "power3.out",
          duration: 1.5,
        }, 3.0);
    });

    // Mobile scroll animation: Bag remains closed in iconic silhouette
    mm.add("(max-width: 767px)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2200",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.3) {
              setActiveStage(1);
            } else if (p < 0.65) {
              setActiveStage(2);
            } else if (p < 0.88) {
              setActiveStage(3);
            } else {
              setActiveStage(4);
            }
          }
        }
      })
      .to(bagGroup.position, { y: -1.35, x: 0, duration: 1 }, 0)
      .to(bagGroup.rotation, { y: Math.PI * 0.7, x: 0.1, duration: 1 }, 0)
      // Section 3: Closed bag showcase from reverse angle
      .to(bagGroup.position, { y: -1.15, x: 0, duration: 1 }, 1)
      .to(bagGroup.rotation, { y: -0.35, x: 0.12, duration: 1 }, 1)
      // Stage 4 settling
      .to(bagGroup.position, { y: 0.75, x: 0, duration: 1 }, 2)
      .to(bagGroup.scale, { x: 0.82, y: 0.82, z: 0.82, duration: 1 }, 2)
      .to(bagGroup.rotation, { y: -0.2, x: 0.05, duration: 1 }, 2);
    });

    // 7. Mouse Parallax & Smooth Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating breathing animation when not manually dragging
      if (!isDraggingRef.current && activeStage !== 4) {
        bagGroup.position.y += Math.sin(elapsedTime * 1.5) * 0.0006;
      }

      // Smooth mouse lerp when on Stage 1
      if (activeStage === 1 && !isDraggingRef.current) {
        bagGroup.rotation.y += (mouseTargetRef.current.x * 0.15 - (bagGroup.rotation.y - -0.32)) * 0.04;
        bagGroup.rotation.x += (mouseTargetRef.current.y * 0.08 - (bagGroup.rotation.x - 0.12)) * 0.04;
      }

      // Slowly rotate dust particles
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };
    renderLoop();

    // Mouse Move Listener for subtle parallax
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseTargetRef.current.x = (e.clientX / innerWidth - 0.5) * 2;
      mouseTargetRef.current.y = -(e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      mm.revert();
      renderer.dispose();
    };
  }, []);

  // Update color dynamically in WebGL
  const handleColorChange = (color) => {
    setCurrentColor(color);
    if (bagModelRef.current) {
      bagModelRef.current.setColor(parseInt(color.hex.replace('#', '0x')));
    }
  };

  const handleToggleOpenBag = () => {
    if (!bagModelRef.current) return;
    const nextState = !isBagOpenRef.current;
    setIsBagOpen(nextState);
    isBagOpenRef.current = nextState;

    const flapObj = { val: bagModelRef.current.getFlapProgress() };
    gsap.to(flapObj, {
      val: nextState ? 1.0 : 0.0,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        bagModelRef.current.setFlapOpenProgress(flapObj.val);
      }
    });

    // Gentle forward tilt when opened so user can see inside
    if (bagModelRef.current.group) {
      gsap.to(bagModelRef.current.group.rotation, {
        x: nextState ? 0.38 : 0.12,
        duration: 1.0,
        ease: "power2.inOut",
      });
    }
  };

  // Helper to detect if mouse/touch point hits the 3D bag mesh
  const checkBagHit = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || !cameraRef.current || !bagModelRef.current) return false;
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(bagModelRef.current.group.children, true);
    // Ignore ground plane shadow
    const hits = intersects.filter(hit => hit.object.geometry?.type !== 'PlaneGeometry');
    return hits.length > 0;
  };

  // Pointer interactions (Hover cursor, tap/click on bag to open, and stage 4 360-drag)
  const handlePointerDown = (e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    isPointerDownRef.current = true;
    if (activeStageRef.current === 4) {
      isDraggingRef.current = true;
      setIsDragging(true);
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerMove = (e) => {
    if (activeStageRef.current === 4 && isDraggingRef.current && bagModelRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      const bag = bagModelRef.current.group;
      bag.rotation.y += deltaX * 0.008;
      bag.rotation.x += deltaY * 0.005;
      bag.rotation.x = Math.max(-0.6, Math.min(0.6, bag.rotation.x));
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Check if cursor is hovering over the 3D bag
    const isHit = checkBagHit(e.clientX, e.clientY);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = isHit
        ? 'pointer'
        : (activeStageRef.current === 4 ? 'grab' : 'default');
    }
  };

  const handlePointerUp = (e) => {
    if (isPointerDownRef.current) {
      const dx = e.clientX - pointerDownPosRef.current.x;
      const dy = e.clientY - pointerDownPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      // If minimal pointer travel (< 10px), treat as tap/click on the bag
      if (dist < 10) {
        if (checkBagHit(e.clientX, e.clientY)) {
          handleToggleOpenBag();
        }
      }
    }
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-atelier-dark select-none"
    >
      {/* Background Luxury Atmosphere Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Warm central leather glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-gradient-to-tr from-[#3a2012]/40 via-[#26150d]/30 to-transparent blur-3xl" />
        {/* Golden accent ambient pool */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] rounded-full bg-[#dfc08a]/5 blur-[120px]" />
        {/* Subtle grid grain */}
        <div className="absolute inset-0 bg-grain opacity-40" />
      </div>

      {/* 3D WebGL Canvas Layer (Click directly on bag to open/close) */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ touchAction: activeStage === 4 ? 'none' : 'pan-y' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Click bag to open or close"
        />
      </div>

      {/* STAGE 1: HERO VIEW — Exactly matches user's screenshot */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-start pt-28 md:pt-0 md:justify-center px-6 md:px-16 lg:px-24 transition-all duration-700 pointer-events-none ${
          activeStage === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        <div className="max-w-xl">
          {/* Main Banner Headline */}
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-atelier-cream leading-[0.98] mb-3 md:mb-5">
            YOUR STYLE.
            <span className="block text-focus-rust font-semibold mt-1">
              YOUR STATEMENT.
            </span>
          </h1>

          {/* Subtitle editorial text */}
          <p className="text-atelier-sand/90 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md font-light">
            Meet your new favourite companion, crafted for every occasion.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 pointer-events-auto">
            <button
              onClick={() => onOpenQuickView(activeBag)}
              className="px-6 md:px-8 py-3 md:py-3.5 bg-atelier-cream text-atelier-dark hover:bg-atelier-gold transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase flex items-center gap-2.5 shadow-lg"
            >
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
              QUICK VIEW
            </button>

            <button
              onClick={() => {
                const target = document.getElementById('collection');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                } else {
                  const targetScroll = window.innerHeight * 2.8;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
              className="px-5 md:px-6 py-3 md:py-3.5 border border-atelier-border hover:border-atelier-gold/70 text-atelier-cream hover:text-atelier-gold transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase flex items-center gap-2 backdrop-blur-sm"
            >
              EXPLORE CRAFT
            </button>
          </div>
        </div>
      </div>

      {/* Click bag hint badge in Stage 1 */}
      {activeStage === 1 && (
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-85 hover:opacity-100 transition-opacity">
          <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-atelier-gold/30 text-[10px] md:text-xs font-mono uppercase tracking-widest text-atelier-gold shadow-lg flex items-center gap-1.5">
            {isBagOpen ? 'Click bag to close' : 'Click bag to open'}
          </span>
        </div>
      )}

      {/* STAGE 2: GRAIN & TUSCAN LEATHER DETAILS (Scroll 30-60%) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-start pt-28 md:pt-0 md:justify-center items-start md:items-end px-6 md:px-20 lg:px-28 transition-all duration-700 pointer-events-none ${
          activeStage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="max-w-md text-left md:text-right">
          <div className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 bg-atelier-card/80 border border-atelier-border text-atelier-gold text-[10px] md:text-[11px] tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            Full-Grain Vacchetta
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-atelier-cream leading-tight mb-3 md:mb-4">
            ARTISANAL GRAIN
            <span className="block font-script-calligraphy text-3xl sm:text-4xl md:text-5xl text-focus-rust italic font-normal -mt-1">
              nourished with natural oils
            </span>
          </h2>

          <p className="text-atelier-sand text-xs sm:text-sm md:text-base leading-relaxed mb-4 md:mb-6 font-light">
            Every hide absorbs sunlight, gentle handling, and oils differently—developing a deep, lustrous caramel patina that reflects your individual journey over time.
          </p>

          <div className="grid grid-cols-2 gap-3 md:gap-4 text-left p-3 md:p-4 bg-atelier-card/60 backdrop-blur-md border border-atelier-border/80">
            <div>
              <div className="text-xl md:text-2xl font-editorial text-atelier-gold font-bold">1.8 mm</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-atelier-muted">Hide Caliber</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-editorial text-atelier-gold font-bold">60 Days</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-atelier-muted">Bark Tanning</div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 3: HARDWARE & ANATOMY (Scroll 60-85%) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-start pt-28 md:pt-0 md:justify-center px-6 md:px-16 lg:px-24 transition-all duration-700 pointer-events-none ${
          activeStage === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 bg-atelier-card/80 border border-atelier-border text-atelier-gold text-[10px] md:text-[11px] tracking-widest uppercase">
            <ShieldCheck className="w-3 h-3" />
            Solid Sand-Cast Brass
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-atelier-cream leading-tight mb-3 md:mb-4">
            FORGED STYLE
            <span className="block font-script-calligraphy text-3xl sm:text-4xl md:text-5xl text-focus-rust italic font-normal -mt-1">
              never hollow, never plated
            </span>
          </h2>
        </div>
      </div>

      {/* STAGE 4: INTERACTIVE 360 INSPECTION & COLORWAY CONFIGURATOR (Scroll 85-100%) */}
      <div
        className={`absolute inset-x-0 bottom-3 sm:bottom-6 md:bottom-12 z-20 px-3 sm:px-6 md:px-16 transition-all duration-700 ${
          activeStage === 4 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto luxury-glass p-3.5 sm:p-5 md:p-8 border border-atelier-gold/25 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Left: Drag hint & Bag summary */}
          <div className="w-full md:w-auto text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-atelier-gold text-[10px] md:text-xs tracking-widest uppercase mb-0.5">
              <RotateCw className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin-slow" />
              DRAG TO ROTATE
            </div>
            <h3 className="font-editorial text-lg sm:text-2xl md:text-3xl text-atelier-cream font-medium leading-tight">
              {activeBag.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-atelier-sand mt-0.5 font-light">
              <span className="font-mono text-atelier-gold font-normal">${activeBag.price} USD</span> • Free Global Courier
            </p>
          </div>

          {/* Center: Live Colorway Switcher & Rigged Flap Controller */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] md:text-[10px] tracking-widest text-atelier-muted uppercase mb-1.5 hidden sm:block">
              Selected Finish: <strong className="text-atelier-cream">{currentColor.name}</strong>
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              {activeBag.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color)}
                  title={color.name}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border transition-all flex items-center justify-center ${
                    currentColor.name === color.name
                      ? 'border-atelier-gold scale-110 shadow-lg shadow-atelier-gold/20 ring-2 ring-atelier-gold/30'
                      : 'border-atelier-border/80 hover:border-atelier-sand/60 opacity-80'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {currentColor.name === color.name && (
                    <Check className="w-3 h-3 text-white/90 drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Add to Cart CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onAddToCart(activeBag, currentColor)}
              className="w-full md:w-auto px-5 md:px-7 py-2.5 sm:py-3 md:py-3.5 bg-atelier-gold text-atelier-dark hover:bg-atelier-cream font-semibold tracking-widest text-[10px] md:text-xs uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              Order This Finish
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Navigation HUD / Pagination matching the reference image */}
      <div className={`hidden md:flex absolute bottom-8 left-6 md:left-16 z-30 items-center gap-6 pointer-events-auto`}>
        {/* Carousel slide indicators (matching 4 dots in reference screenshot) */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((stageNum) => (
            <button
              key={stageNum}
              onClick={() => {
                const targetScroll = ((stageNum - 1) / 3) * (window.innerHeight * 2.8);
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
              }}
              className={`transition-all duration-300 rounded-full ${
                activeStage === stageNum
                  ? 'w-6 h-1.5 bg-atelier-gold'
                  : 'w-1.5 h-1.5 bg-atelier-cream/30 hover:bg-atelier-cream/60'
              }`}
              aria-label={`Slide ${stageNum}`}
            />
          ))}
        </div>

        <span className="text-[11px] tracking-widest text-atelier-sand/70 font-mono">
          0{activeStage} / 04
        </span>

        {/* Scroll down prompt */}
        <div className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase text-atelier-sand/50 pl-4 border-l border-atelier-border">
          <span>Scroll to explore dimensions</span>
          <span className="w-1.5 h-1.5 rounded-full bg-atelier-accent animate-ping" />
        </div>
      </div>
    </div>
  );
}
