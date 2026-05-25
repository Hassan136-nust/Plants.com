import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';

const CAROUSEL_STYLES = [
    { bgGradient: 'linear-gradient(145deg, #1a4d2e 0%, #0d2b1a 100%)', accentColor: '#4ade80', shadowColor: 'rgba(74, 222, 128, 0.25)' },
    { bgGradient: 'linear-gradient(145deg, #2d4a1e 0%, #162810 100%)', accentColor: '#86efac', shadowColor: 'rgba(134,239,172,0.25)' },
    { bgGradient: 'linear-gradient(145deg, #3d5a1c 0%, #1e2e0e 100%)', accentColor: '#bef264', shadowColor: 'rgba(190,242,100,0.25)' },
    { bgGradient: 'linear-gradient(145deg, #1b3a4b 0%, #0d1f2d 100%)', accentColor: '#67e8f9', shadowColor: 'rgba(103,232,249,0.25)' },
    { bgGradient: 'linear-gradient(145deg, #3b1f4b 0%, #1e0e28 100%)', accentColor: '#e879f9', shadowColor: 'rgba(232,121,249,0.25)' },
    { bgGradient: 'linear-gradient(145deg, #1a3a2a 0%, #0a1e15 100%)', accentColor: '#34d399', shadowColor: 'rgba(52,211,153,0.25)' },
];

const API = 'http://localhost:5001';

export default function PlantCarousel() {
    const [plants, setPlants] = useState([]);
    const [active, setActive] = useState(0);
    const [sliding, setSliding] = useState(false);
    const intervalRef = useRef(null);
    const [toast, setToast] = useState({ show: false, msg: '' });
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`${API}/api/plants`)
            .then(r => r.json())
            .then(data => {
                const carouselPlants = data.filter(p => p.isCarousel).map((p, i) => {
                    const style = CAROUSEL_STYLES[i % CAROUSEL_STYLES.length];
                    let url = p.imageUrl || '';
                    if (url.startsWith('http')) url = url.replace(':5000', ':5001');
                    else if (url.startsWith('/')) url = `${API}${url}`;
                    else if (url && (url.endsWith('.jpg') || url.endsWith('.png'))) {
                        if (!url.includes('/uploads/')) url = `${API}/uploads/plants/${url}`;
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
            })
            .catch(err => console.error('Error fetching carousel plants:', err));
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
        }, 4000);
    }, [plants.length]);

    useEffect(() => {
        if (plants.length > 0) {
            resetInterval();
        }
        return () => clearInterval(intervalRef.current);
    }, [resetInterval, plants.length]);

    const goTo = (idx) => {
        if (idx === active || sliding || plants.length === 0) return;
        setSliding(true);
        setActive(idx);
        resetInterval();
        setTimeout(() => setSliding(false), 600);
    };

    const prev = () => goTo((active - 1 + plants.length) % plants.length);
    const next = () => goTo((active + 1) % plants.length);

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
                        Hand-picked rarities directly from the Nursery. Swipe to explore the best additions.
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
                    {plants.map((p, idx) => {
                        const pos = getPos(idx);
                        const isActive = pos === 0;
                        const visible = Math.abs(pos) <= 1;

                        if (!visible) return null;

                        const xOffset = pos * 310;
                        const scale = isActive ? 1 : 0.72;
                        const zDist = isActive ? 40 : 0;
                        const rotY = pos * -18;
                        const opacity = isActive ? 1 : 0.5;

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
                                        ? `1px solid ${p.accentColor}44`
                                        : '1px solid rgba(255,255,255,0.07)',
                                    boxShadow: isActive
                                        ? '0 32px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3)'
                                        : '0 12px 32px rgba(0,0,0,0.4)',
                                    transform: `translateX(${xOffset}px) scale(${scale}) rotateY(${rotY}deg) translateZ(${zDist}px)`,
                                    opacity,
                                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    zIndex: isActive ? 10 : 5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    willChange: 'transform, opacity',
                                }}
                            >
                                {/* IMAGE */}
                                <div style={{
                                    flex: '1 1 0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>

                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        loading="lazy"
                                        style={{
                                            position: 'relative', zIndex: 2,
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            imageRendering: 'auto',
                                            opacity: isActive ? 1 : 0.75,
                                            transition: 'opacity 0.5s ease',
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            console.warn('Carousel image failed:', e.target.src);
                                            try {
                                                const parts = (p.imageUrl || e.target.src || '').split('/');
                                                const file = parts[parts.length - 1];
                                                if (file) {
                                                    const fallback = `${API}/uploads/plants/${file}`;
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
                                            position: 'absolute', top: '18px', left: '18px', zIndex: 10,
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
                                        padding: '20px 22px 22px',
                                        background: 'rgba(0,0,0,0.55)',
                                        borderTop: `1px solid rgba(255,255,255,0.07)`,
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
                                                    fontWeight: '700', fontSize: '13px',
                                                    cursor: 'pointer', letterSpacing: '0.3px',
                                                    transition: 'transform 0.2s ease, filter 0.2s ease',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
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
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {plants.map((p, idx) => (
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
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div style={{
                    textAlign: 'center', marginTop: '18px',
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'rgba(255,255,255,0.3)', letterSpacing: '3px',
                    fontWeight: '600',
                }}>
                    {String(active + 1).padStart(2, '0')}&nbsp;&nbsp;/&nbsp;&nbsp;{String(plants.length).padStart(2, '0')}
                </div>
            </div>

            <style>{`
        .carousel-toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px); background:linear-gradient(135deg,#0f3322,#081d14); border:1px solid rgba(74,222,128,0.35); color:#fff; padding:14px 28px; border-radius:50px; font-size:14px; opacity:0; transition:all 0.4s ease; pointer-events:none; z-index:999; white-space:nowrap; }
        .carousel-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
      `}</style>
            <div className={`carousel-toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
        </section>
    );
}
