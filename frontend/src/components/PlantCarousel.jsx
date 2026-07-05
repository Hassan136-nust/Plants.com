import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupee } from '../utils/price';
import API_URL from '../config';
import Reveal from './motion/Reveal';
import { CarouselSkeleton } from './motion/Skeleton';

const CAROUSEL_STYLES = [
    { bgColor: '#ffffff', accentColor: '#16a34a', shadowColor: 'rgba(22, 163, 74, 0.15)' },
    { bgColor: '#ffffff', accentColor: '#0891b2', shadowColor: 'rgba(8, 145, 178, 0.15)' },
    { bgColor: '#ffffff', accentColor: '#d97706', shadowColor: 'rgba(217, 119, 6, 0.15)' },
    { bgColor: '#ffffff', accentColor: '#db2777', shadowColor: 'rgba(219, 39, 119, 0.15)' },
    { bgColor: '#ffffff', accentColor: '#7c3aed', shadowColor: 'rgba(124, 58, 237, 0.15)' },
    { bgColor: '#ffffff', accentColor: '#059669', shadowColor: 'rgba(5, 150, 105, 0.15)' },
];

const API = API_URL;

export default function PlantCarousel() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(0);
    const [sliding, setSliding] = useState(false);
    const intervalRef = useRef(null);
    const stageRef = useRef(null);
    const pointer = useRef({ down: false, startX: 0, deltaX: 0 });
    const [toast, setToast] = useState({ show: false, msg: '' });
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`${API_URL}/api/plants`)
            .then(r => r.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('Error fetching carousel plants: unexpected response', data);
                    return;
                }
                const carouselPlants = data.filter(p => p.isCarousel).map((p, i) => {
                    const style = CAROUSEL_STYLES[i % CAROUSEL_STYLES.length];
                    let url = p.imageUrl || '';
                    if (url.startsWith('http')) url = url.replace(':5000', ':5001');
                    else if (url.startsWith('/')) url = `${API_URL}${url}`;
                    else if (url && (url.endsWith('.jpg') || url.endsWith('.png'))) {
                        if (!url.includes('/uploads/')) url = `${API_URL}/uploads/plants/${url}`;
                    }
                    if (url !== p.imageUrl) console.warn('Carousel normalized imageUrl for', p.name, '->', url);
                    return {
                        id: p._id,
                        name: p.name,
                        scientificName: p.scientificName,
                        subtitle: p.category,
                        price: p.price,
                        tag: 'Featured',
                        imageUrl: url,
                        ...style
                    };
                });
                setPlants(carouselPlants);
                setLoading(false);
            })
            .catch(err => { console.error('Error fetching carousel plants:', err); setLoading(false); });
    }, []);

    const showToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
    };

    const handleAddToCart = (plant) => {
        addToCart({
            id: plant.id,
            name: plant.name,
            price: plant.price,
            imageUrl: plant.imageUrl,
            scientificName: plant.scientificName
        });
        showToast(`✅ ${plant.name} added to cart!`);
    };

    const resetInterval = useCallback(() => {
        if (!plants.length) return;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % plants.length);
        }, 4500);
    }, [plants.length]);

    useEffect(() => {
        if (plants.length > 0) {
            resetInterval();
        }
        return () => clearInterval(intervalRef.current);
    }, [resetInterval, plants.length]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [plants.length, active]);

    // Pause/resume helpers
    const pause = () => clearInterval(intervalRef.current);
    const resume = () => resetInterval();

    // Pointer (touch) handlers for swipe
    const onPointerDown = (e) => {
        pointer.current.down = true;
        pointer.current.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        pointer.current.deltaX = 0;
        pause();
    };
    const onPointerMove = (e) => {
        if (!pointer.current.down) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        pointer.current.deltaX = x - pointer.current.startX;
    };
    const onPointerUp = () => {
        if (!pointer.current.down) return;
        pointer.current.down = false;
        const dx = pointer.current.deltaX;
        if (Math.abs(dx) > 60) {
            if (dx > 0) prev(); else next();
        }
        pointer.current.deltaX = 0;
        resume();
    };

    const goTo = (idx) => {
        if (idx === active || sliding || plants.length === 0) return;
        setSliding(true);
        setActive(idx);
        resetInterval();
        setTimeout(() => setSliding(false), 600);
    };

    const prev = () => goTo((active - 1 + plants.length) % plants.length);
    const next = () => goTo((active + 1) % plants.length);

    // Skeleton while the featured collection loads
    if (loading) {
        return (
            <section style={{
                padding: 'clamp(80px, 12vw, 120px) 0 clamp(40px, 8vw, 80px)',
                background: 'linear-gradient(180deg, #0b2218 0%, #081d14 100%)',
                overflow: 'hidden',
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 70px)' }}>
                        <div className="section-eyebrow">Plant Showcase</div>
                        <h2 className="section-title" style={{ marginBottom: '14px' }}>Our <em>Featured</em> Collection</h2>
                        <p className="section-desc" style={{ maxWidth: '520px', margin: '0 auto' }}>
                            Hand-picked rarities directly from the Nursery. Swipe to explore the best additions.
                        </p>
                    </div>
                    <div className="carousel-skeleton" style={{ minHeight: 'clamp(480px, 72vw, 680px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CarouselSkeleton />
                    </div>
                </div>
            </section>
        );
    }

    if (plants.length === 0) return null;

    const plant = plants[active];

    // Positions: -2 -1 0 1 2 (relative to active)
    const getPos = (idx) => {
        let diff = idx - active;
        if (diff > plants.length / 2) diff -= plants.length;
        if (diff < -plants.length / 2) diff += plants.length;
        return diff;
    };

    return (
        <section style={{
            padding: 'clamp(80px, 12vw, 120px) 0 clamp(40px, 8vw, 80px)',
            background: 'linear-gradient(180deg, #0b2218 0%, #081d14 100%)',
            overflow: 'hidden',
        }}>
            <div className="container">
                {/* Header */}
                <Reveal style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 70px)' }}>
                    <div className="section-eyebrow">Plant Showcase</div>
                    <h2 className="section-title" style={{ marginBottom: '14px' }}>
                        Our <em>Featured</em> Collection
                    </h2>
                    <p className="section-desc" style={{ maxWidth: '520px', margin: '0 auto' }}>
                        Hand-picked rarities directly from the Nursery. Swipe to explore the best additions.
                    </p>
                </Reveal>

                {/* CAROUSEL STAGE */}
                <div ref={stageRef} onMouseEnter={pause} onMouseLeave={resume}
                    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                    onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
                    role="region" aria-label="Featured plants carousel"
                    style={{
                        position: 'relative',
                        height: 'clamp(480px, 72vw, 680px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        perspective: '2000px',
                    }}>
                    {plants.map((p, idx) => {
                        const pos = getPos(idx);
                        const isActive = pos === 0;
                        const visible = Math.abs(pos) <= 1;

                        if (!visible) return null;

                        // On mobile hide side cards entirely — only show active
                        const xOffset = pos * 420;
                        const scale = isActive ? 1 : 0.85;
                        const zDist = isActive ? 0 : -100;
                        const rotY = pos * -12;
                        const opacity = isActive ? 1 : 0.4;

                        return (
                            <div
                                key={p.id}
                                onClick={() => !isActive && goTo(idx)}
                                className={!isActive ? 'carousel-side-card' : ''}
                                style={{
                                    position: 'absolute',
                                    width: 'min(88vw, 400px)',
                                    height: isActive ? 'clamp(420px, 68vw, 620px)' : 'clamp(340px, 56vw, 520px)',
                                    borderRadius: '24px',
                                    cursor: isActive ? 'default' : 'pointer',
                                    background: p.bgColor,
                                    border: isActive ? `3px solid ${p.accentColor}` : '2px solid #e5e7eb',
                                    boxShadow: isActive
                                        ? `0 40px 80px rgba(0,0,0,0.12), 0 12px 32px ${p.shadowColor}`
                                        : '0 8px 16px rgba(0,0,0,0.06)',
                                    transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotY}deg) translateZ(${zDist}px)`,
                                    opacity,
                                    transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    zIndex: isActive ? 10 : 5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                {/* IMAGE */}
                                <div style={{
                                    height: isActive ? 'clamp(240px, 44vw, 420px)' : 'clamp(200px, 36vw, 340px)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#f9fafb',
                                    borderRadius: '20px 20px 0 0',
                                    flexShrink: 0,
                                }}>

                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        loading="lazy"
                                        style={{
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            imageRendering: '-webkit-optimize-contrast',
                                            WebkitFontSmoothing: 'antialiased',
                                            MozOsxFontSmoothing: 'grayscale',
                                            filter: 'none',
                                            opacity: 1,
                                            transition: 'transform 0.6s ease',
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            console.warn('Carousel image failed:', e.target.src);
                                            try {
                                                const parts = (p.imageUrl || e.target.src || '').split('/');
                                                const file = parts[parts.length - 1];
                                                if (file) {
                                                    const fallback = `${API_URL}/uploads/plants/${file}`;
                                                    if (e.target.src !== fallback) {
                                                        e.target.src = fallback;
                                                        return;
                                                    }
                                                }
                                            } catch (err) { /* ignore */ }

                                            const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='420'><rect width='100%' height='100%' fill='#0b2b1a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#7fd08a' font-family='sans-serif' font-size='24'>Image unavailable</text></svg>`);
                                            e.target.src = `data:image/svg+xml;charset=utf-8,${svg}`;
                                        }}
                                    />

                                    {isActive && (
                                        <div style={{
                                            position: 'absolute', top: '20px', left: '20px', zIndex: 10,
                                            background: p.accentColor,
                                            border: 'none',
                                            color: '#ffffff',
                                            fontSize: '11px', fontWeight: '700',
                                            textTransform: 'uppercase', letterSpacing: '1.2px',
                                            padding: '8px 18px', borderRadius: '8px',
                                            boxShadow: `0 4px 12px ${p.shadowColor}`,
                                        }}>
                                            {p.tag}
                                        </div>
                                    )}
                                </div>

                                {/* CARD FOOTER */}
                                {isActive && (
                                    <div style={{
                                        padding: 'clamp(16px, 4vw, 28px) clamp(16px, 4vw, 28px) clamp(20px, 4vw, 32px)',
                                        background: '#ffffff',
                                        borderTop: '1px solid #f3f4f6',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '11px', fontWeight: '700', color: p.accentColor,
                                                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px',
                                            }}>
                                                {p.subtitle}
                                            </div>
                                            <h3 style={{
                                                fontFamily: 'var(--font-serif)',
                                                fontSize: 'clamp(18px, 5vw, 28px)',
                                                color: '#111827', fontWeight: '700',
                                                marginBottom: '0',
                                                lineHeight: '1.2',
                                            }}>
                                                {p.name}
                                            </h3>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: 'clamp(12px, 3vw, 20px)',
                                            marginTop: 'clamp(12px, 3vw, 20px)',
                                            borderTop: '1px solid #e5e7eb',
                                            gap: '10px',
                                        }}>
                                            <span style={{
                                                fontSize: 'clamp(20px, 6vw, 32px)',
                                                fontWeight: '800',
                                                color: '#111827',
                                                fontFamily: 'var(--font-sans)',
                                                letterSpacing: '-0.5px',
                                                flexShrink: 0,
                                            }}>
                                                {formatRupee(p.price)}
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                style={{
                                                    background: p.accentColor,
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 4vw, 28px)',
                                                    borderRadius: '12px',
                                                    fontWeight: '700',
                                                    fontSize: 'clamp(12px, 3.2vw, 14px)',
                                                    cursor: 'pointer',
                                                    letterSpacing: '0.3px',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: `0 4px 12px ${p.shadowColor}`,
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = `0 8px 24px ${p.shadowColor}`;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = `0 4px 12px ${p.shadowColor}`;
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
                    gap: '12px', marginTop: '40px', padding: '0 16px',
                }}>
                    <button
                        onClick={prev}
                        aria-label="Previous"
                        style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s ease', backdropFilter: 'blur(12px)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = plant.accentColor;
                            e.currentTarget.style.borderColor = plant.accentColor;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>

                    <div style={{
                        display: 'flex', gap: '6px', alignItems: 'center',
                        flexWrap: 'wrap', justifyContent: 'center',
                        flex: 1, minWidth: 0, overflow: 'hidden',
                        maxWidth: 'calc(100vw - 140px)',
                    }}>
                        {plants.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                style={{
                                    width: active === idx ? '28px' : '8px',
                                    height: '8px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    background: active === idx ? plant.accentColor : 'rgba(255,255,255,0.25)',
                                    boxShadow: active === idx ? `0 0 12px ${plant.shadowColor}` : 'none',
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        aria-label="Next"
                        style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s ease', backdropFilter: 'blur(12px)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = plant.accentColor;
                            e.currentTarget.style.borderColor = plant.accentColor;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div style={{
                    textAlign: 'center', marginTop: '24px',
                    fontFamily: 'var(--font-sans)', fontSize: '14px',
                    color: 'rgba(255,255,255,0.4)', letterSpacing: '2px',
                    fontWeight: '600',
                }}>
                    {String(active + 1).padStart(2, '0')}&nbsp;&nbsp;/&nbsp;&nbsp;{String(plants.length).padStart(2, '0')}
                </div>
            </div>

            <style>{`
        .carousel-toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px); background:linear-gradient(135deg,#0f3322,#081d14); border:1px solid rgba(74,222,128,0.35); color:#fff; padding:14px 28px; border-radius:50px; font-size:14px; opacity:0; transition:all 0.4s ease; pointer-events:none; z-index:999; white-space:nowrap; }
        .carousel-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
        @media (max-width: 500px) {
            .carousel-side-card { display: none !important; }
        }
      `}</style>
            <div className={`carousel-toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
        </section>
    );
}
