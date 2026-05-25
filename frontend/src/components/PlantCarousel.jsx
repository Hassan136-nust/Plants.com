import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';

const PLANTS = [
    {
        id: 1,
        name: 'Monstera Deliciosa',
        subtitle: 'Tropical Giant',
        price: '$45',
        tag: 'Best Seller',
        bgGradient: 'linear-gradient(145deg, #1a4d2e 0%, #0d2b1a 100%)',
        accentColor: '#4ade80',
        shadowColor: 'rgba(74, 222, 128, 0.25)',
    },
    {
        id: 2,
        name: 'Snake Plant',
        subtitle: 'Low-Light Air Purifier',
        price: '$28',
        tag: 'Low Light',
        bgGradient: 'linear-gradient(145deg, #2d4a1e 0%, #162810 100%)',
        accentColor: '#86efac',
        shadowColor: 'rgba(134,239,172,0.25)',
    },
    {
        id: 3,
        name: 'Golden Pothos',
        subtitle: 'Hanging Vine',
        price: '$22',
        tag: 'Easy Care',
        bgGradient: 'linear-gradient(145deg, #3d5a1c 0%, #1e2e0e 100%)',
        accentColor: '#bef264',
        shadowColor: 'rgba(190,242,100,0.25)',
    },
    {
        id: 4,
        name: 'Blue Succulent',
        subtitle: 'Desert Rose',
        price: '$18',
        tag: 'Drought Tolerant',
        bgGradient: 'linear-gradient(145deg, #1b3a4b 0%, #0d1f2d 100%)',
        accentColor: '#67e8f9',
        shadowColor: 'rgba(103,232,249,0.25)',
    },
    {
        id: 5,
        name: 'Paradise Lily',
        subtitle: 'Peace Bloom',
        price: '$35',
        tag: 'Air Purifier',
        bgGradient: 'linear-gradient(145deg, #3b1f4b 0%, #1e0e28 100%)',
        accentColor: '#e879f9',
        shadowColor: 'rgba(232,121,249,0.25)',
    },
    {
        id: 6,
        name: 'Calathea Orbifolia',
        subtitle: 'Rare Exotic',
        price: '$38',
        tag: 'Rare',
        bgGradient: 'linear-gradient(145deg, #1a3a2a 0%, #0a1e15 100%)',
        accentColor: '#34d399',
        shadowColor: 'rgba(52,211,153,0.25)',
    },
];

export default function PlantCarousel() {
    const [active, setActive] = useState(0);
    const [sliding, setSliding] = useState(false);
    const intervalRef = useRef(null);
    const [toast, setToast] = useState({ show: false, msg: '' });
    const { addToCart } = useCart();

    const showToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
    };

    const handleAddToCart = (plant) => {
        addToCart(plant);
        showToast(`✅ ${plant.name} added to cart!`);
    };

    const resetInterval = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % PLANTS.length);
        }, 4000);
    }, []);

    useEffect(() => {
        resetInterval();
        return () => clearInterval(intervalRef.current);
    }, [resetInterval]);

    const goTo = (idx) => {
        if (idx === active || sliding) return;
        setSliding(true);
        setActive(idx);
        resetInterval();
        setTimeout(() => setSliding(false), 600);
    };

    const prev = () => goTo((active - 1 + PLANTS.length) % PLANTS.length);
    const next = () => goTo((active + 1) % PLANTS.length);

    const plant = PLANTS[active];

    // Positions: -2 -1 0 1 2 (relative to active)
    const getPos = (idx) => {
        let diff = idx - active;
        if (diff > PLANTS.length / 2) diff -= PLANTS.length;
        if (diff < -PLANTS.length / 2) diff += PLANTS.length;
        return diff;
    };

    return (
        <section style={{
            padding: '120px 0 80px',
            background: 'linear-gradient(180deg, #0b2218 0%, #081d14 100%)',
            overflow: 'hidden',
        }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '70px' }}>
                    <div className="section-eyebrow">Plant Showcase</div>
                    <h2 className="section-title" style={{ marginBottom: '14px' }}>
                        Our <em>Featured</em> Collection
                    </h2>
                    <p className="section-desc" style={{ maxWidth: '520px', margin: '0 auto' }}>
                        Hand-picked rarities. Add your own photos and bring each plant to life.
                    </p>
                </div>

                {/* CAROUSEL STAGE */}
                <div style={{
                    position: 'relative',
                    height: '520px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '1400px',
                }}>
                    {PLANTS.map((p, idx) => {
                        const pos = getPos(idx);
                        const isActive = pos === 0;
                        const visible = Math.abs(pos) <= 1;

                        if (!visible) return null;

                        const xOffset = pos * 310;
                        const scale = isActive ? 1 : 0.72;
                        const zDist = isActive ? 60 : 0;
                        const rotY = pos * -22;
                        const opacity = isActive ? 1 : 0.45;

                        return (
                            <div
                                key={p.id}
                                onClick={() => !isActive && goTo(idx)}
                                style={{
                                    position: 'absolute',
                                    width: '300px',
                                    height: isActive ? '480px' : '360px',
                                    borderRadius: '24px',
                                    cursor: isActive ? 'default' : 'pointer',
                                    background: p.bgGradient,
                                    border: isActive
                                        ? `1px solid ${p.accentColor}66`
                                        : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: isActive
                                        ? `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${p.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`
                                        : '0 20px 40px rgba(0,0,0,0.5)',
                                    transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotY}deg) translateZ(${zDist}px)`,
                                    opacity,
                                    transition: 'all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    zIndex: isActive ? 10 : 5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                {/* IMAGE PLACEHOLDER — ready for real photos */}
                                <div style={{
                                    flex: '1 1 0',
                                    position: 'relative',
                                    background: `radial-gradient(ellipse at 50% 30%, ${p.accentColor}18 0%, rgba(0,0,0,0) 70%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}>
                                    {/* Glowing orb behind icon */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '160px', height: '160px',
                                        borderRadius: '50%',
                                        background: `radial-gradient(circle, ${p.accentColor}30 0%, transparent 70%)`,
                                        top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        animation: isActive ? 'pulseOrb 3s ease-in-out infinite' : 'none',
                                    }} />

                                    {/* Leaf vein pattern — decorative */}
                                    <svg
                                        viewBox="0 0 120 140"
                                        style={{
                                            width: isActive ? '130px' : '90px',
                                            height: 'auto',
                                            color: p.accentColor,
                                            opacity: isActive ? 0.9 : 0.5,
                                            animation: isActive ? 'floatIcon 4s ease-in-out infinite' : 'none',
                                            transition: 'all 0.6s ease',
                                            filter: isActive
                                                ? `drop-shadow(0 8px 24px ${p.accentColor}88)`
                                                : 'none',
                                            zIndex: 1,
                                        }}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Stylized leaf icon */}
                                        <path d="M60 130 L60 50" strokeWidth="3" />
                                        <path d="M60 50 C40 30 10 28 4 50 C10 24 42 18 60 38" />
                                        <path d="M60 50 C80 30 110 28 116 50 C110 24 78 18 60 38" />
                                        <path d="M60 70 C36 58 10 62 6 78 C12 60 40 56 60 66" />
                                        <path d="M60 70 C84 58 110 62 114 78 C108 60 80 56 60 66" />
                                        <path d="M60 90 C40 80 18 84 14 98 C20 82 44 78 60 86" />
                                        <path d="M60 90 C80 80 102 84 106 98 C100 82 76 78 60 86" />
                                        <circle cx="60" cy="38" r="5" fill="currentColor" opacity="0.5" />
                                        {/* Photo icon hint */}
                                        <rect x="20" y="108" width="80" height="26" rx="5" strokeOpacity="0.2" strokeDasharray="4 3" />
                                        <text x="60" y="125" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.3" stroke="none" fontFamily="sans-serif">Add Photo</text>
                                    </svg>

                                    {/* Tag badge */}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute', top: '18px', left: '18px',
                                            background: `${p.accentColor}20`,
                                            border: `1px solid ${p.accentColor}60`,
                                            color: p.accentColor,
                                            fontSize: '10px', fontWeight: '800',
                                            textTransform: 'uppercase', letterSpacing: '1.5px',
                                            padding: '5px 14px', borderRadius: '30px',
                                            backdropFilter: 'blur(8px)',
                                        }}>
                                            {p.tag}
                                        </div>
                                    )}
                                </div>

                                {/* CARD FOOTER */}
                                {isActive && (
                                    <div style={{
                                        padding: '22px 24px 24px',
                                        background: 'rgba(0,0,0,0.3)',
                                        backdropFilter: 'blur(10px)',
                                        borderTop: `1px solid ${p.accentColor}22`,
                                    }}>
                                        <div style={{
                                            fontSize: '10px', fontWeight: '700', color: p.accentColor,
                                            textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '5px',
                                        }}>
                                            {p.subtitle}
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-serif)', fontSize: '21px',
                                            color: '#ffffff', fontWeight: '700', marginBottom: '18px',
                                        }}>
                                            {p.name}
                                        </h3>
                                        <div style={{
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderTop: `1px solid ${p.accentColor}25`,
                                            paddingTop: '16px',
                                        }}>
                                            <span style={{ fontSize: '26px', fontWeight: '900', color: '#f8db7d', fontFamily: 'var(--font-serif)' }}>
                                                {p.price}
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                style={{
                                                    background: p.accentColor,
                                                    color: '#081d14', border: 'none',
                                                    padding: '11px 22px', borderRadius: '50px',
                                                    fontWeight: '800', fontSize: '12px',
                                                    cursor: 'pointer', letterSpacing: '0.5px',
                                                    boxShadow: `0 6px 20px ${p.shadowColor}`,
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                                                    e.currentTarget.style.boxShadow = `0 10px 28px ${p.shadowColor}`;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                    e.currentTarget.style.boxShadow = `0 6px 20px ${p.shadowColor}`;
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CONTROLS */}
                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: '20px', marginTop: '52px',
                }}>
                    {/* Prev */}
                    <button
                        onClick={prev}
                        style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.25s ease', backdropFilter: 'blur(10px)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${plant.accentColor}22`;
                            e.currentTarget.style.borderColor = plant.accentColor;
                            e.currentTarget.style.color = plant.accentColor;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.color = '#fff';
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>

                    {/* Dot strip */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {PLANTS.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                style={{
                                    width: active === idx ? '30px' : '8px', height: '8px',
                                    borderRadius: '50px', border: 'none', padding: 0, cursor: 'pointer',
                                    background: active === idx ? plant.accentColor : 'rgba(255,255,255,0.22)',
                                    boxShadow: active === idx ? `0 0 12px ${plant.accentColor}` : 'none',
                                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        onClick={next}
                        style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.25s ease', backdropFilter: 'blur(10px)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${plant.accentColor}22`;
                            e.currentTarget.style.borderColor = plant.accentColor;
                            e.currentTarget.style.color = plant.accentColor;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.color = '#fff';
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Counter */}
                <div style={{
                    textAlign: 'center', marginTop: '18px',
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'rgba(255,255,255,0.3)', letterSpacing: '3px',
                    fontWeight: '600',
                }}>
                    {String(active + 1).padStart(2, '0')}&nbsp;&nbsp;/&nbsp;&nbsp;{String(PLANTS.length).padStart(2, '0')}
                </div>
            </div>

            <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulseOrb {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.35); opacity: 0.9; }
        }
        .carousel-toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px); background:linear-gradient(135deg,#0f3322,#081d14); border:1px solid rgba(74,222,128,0.35); color:#fff; padding:14px 28px; border-radius:50px; font-size:14px; opacity:0; transition:all 0.4s ease; pointer-events:none; z-index:999; white-space:nowrap; }
        .carousel-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
      `}</style>

            {/* Toast */}
            <div className={`carousel-toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
        </section>
    );
}
