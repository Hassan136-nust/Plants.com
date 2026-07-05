import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TESTIMONIALS, LeafCheckIcon, EcoGlobalIcon, AwardCareIcon, ServiceConsultationIcon, ServiceLandscapeIcon, ServiceWaterIcon, DirectionArrow } from '../data/constants';
import PlantCarousel from '../components/PlantCarousel';
import Reveal, { staggerContainer, staggerItem } from '../components/motion/Reveal';
import TiltCard from '../components/motion/TiltCard';
import { usePrefersReducedMotion } from '../components/motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const reduced = usePrefersReducedMotion();

    const heroRef = useRef(null);
    const heroOverlayRef = useRef(null);
    const heroFogRef = useRef(null);
    const heroContentRef = useRef(null);
    const aboutImgRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // GSAP scroll parallax + pinned 3D about image
    useEffect(() => {
        if (reduced) return;
        const ctx = gsap.context(() => {
            // Hero layers drift at different speeds as you scroll away
            gsap.to(heroFogRef.current, {
                yPercent: 30, ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            gsap.to(heroOverlayRef.current, {
                yPercent: 15, ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            gsap.to(heroContentRef.current, {
                yPercent: 40, opacity: 0.2, ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });

            // About image: rotate + scale on scroll for a 3D reveal
            if (aboutImgRef.current) {
                gsap.fromTo(aboutImgRef.current,
                    { rotateY: 18, scale: 0.92, transformPerspective: 1000 },
                    {
                        rotateY: -6, scale: 1, ease: 'none',
                        scrollTrigger: { trigger: aboutImgRef.current, start: 'top 85%', end: 'center center', scrub: true },
                    }
                );
            }
        });
        return () => ctx.revert();
    }, [reduced]);

    const titleParent = {
        hidden: {},
        show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
    };
    const titleLine = {
        hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <>
            {/* HERO */}
            <section className="hero" id="home" ref={heroRef}>
                <div className="hero-overlay" ref={heroOverlayRef}></div>
                <div className="hero-fog" ref={heroFogRef}></div>
                <div className="hero-content" ref={heroContentRef}>
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="badge-dot"></span>
                        Premium Nursery Farm — Est. 2010
                    </motion.div>
                    <motion.h1 className="hero-title" variants={titleParent} initial="hidden" animate="show">
                        <motion.span className="title-line" variants={titleLine}>Where Nature</motion.span>
                        <motion.span className="title-line title-italic" variants={titleLine}>Comes Alive</motion.span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Curated tropical plants, exotic greenery, and nature-inspired collections for your home, garden, and soul.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link to="/plants" className="btn-primary">
                            <span>Explore Plants</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/about" className="btn-secondary">
                            <span>Visit Nursery</span>
                        </Link>
                    </motion.div>
                    <motion.div
                        className="hero-stats"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="stat">
                            <span className="stat-num">500+</span>
                            <span className="stat-label">Plant Species</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-num">15K+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-num">14</span>
                            <span className="stat-label">Years of Excellence</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ABOUT PREVIEW */}
            <section className="about" id="about">
                <div className="about-bg-accent"></div>
                <div className="container">
                    <div className="about-grid">
                        <Reveal direction="right" className="about-visual">
                            <div className="about-img-frame">
                                <div className="about-img-inner" ref={aboutImgRef} style={{ transformStyle: 'preserve-3d' }}>
                                    <img src="/plants.png" alt="Zia Nursery lush garden" className="about-img" />
                                    <div className="about-img-overlay"></div>
                                </div>
                                <motion.div
                                    className="about-badge-floating"
                                    initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true, amount: 0.6 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}
                                >
                                    <span className="badge-num">14+</span>
                                    <span className="badge-text">Years Growing</span>
                                </motion.div>
                            </div>
                        </Reveal>
                        <Reveal direction="left" delay={0.1} className="about-content">
                            <div className="section-eyebrow">Our Story</div>
                            <h2 className="section-title">A Passion Rooted<br /><em>in Nature</em></h2>
                            <p className="about-text">
                                Founded in 2010, Zia Nursery Farm was born from a deep love for the natural world. We believe every home deserves the breath of life that only plants can bring.
                            </p>
                            <p className="about-text">
                                From our sprawling 5-acre farm to your doorstep, every plant is nurtured with expert care, sustainable practices, and an unwavering commitment to quality.
                            </p>
                            <motion.div
                                className="about-features"
                                variants={staggerContainer(0.14)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <motion.div className="feature-item" variants={staggerItem}>
                                    <LeafCheckIcon />
                                    <div><h4>Sustainably Grown</h4><p>Eco-friendly cultivation methods and healthy organic mediums.</p></div>
                                </motion.div>
                                <motion.div className="feature-item" variants={staggerItem}>
                                    <EcoGlobalIcon />
                                    <div><h4>Global Collection</h4><p>Exotic tropical plants and rare flora sourced from 6 continents.</p></div>
                                </motion.div>
                                <motion.div className="feature-item" variants={staggerItem}>
                                    <AwardCareIcon />
                                    <div><h4>Expert Guidance</h4><p>Certified horticulturists on staff helping you with plant care plans.</p></div>
                                </motion.div>
                            </motion.div>
                            <Link to="/about" className="btn-primary" style={{ marginTop: '32px', display: 'inline-flex' }}>
                                Learn More About Us
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* SERVICES PREVIEW */}
            <section className="services" id="services">
                <div className="container">
                    <Reveal className="section-header">
                        <div className="section-eyebrow">What We Offer</div>
                        <h2 className="section-title">Our <em>Services</em></h2>
                        <p className="section-desc">From consultation to installation — we cover every aspect of your green journey.</p>
                    </Reveal>
                    <motion.div
                        className="services-grid"
                        variants={staggerContainer(0.16)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div variants={staggerItem}>
                            <TiltCard className="service-card" max={8}>
                                <div className="service-icon-wrap"><ServiceConsultationIcon /></div>
                                <h3>Plant Consultation</h3>
                                <p>One-on-one expert guidance to find the perfect plants for your space, lifestyle, and climate.</p>
                                <DirectionArrow />
                            </TiltCard>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <TiltCard className="service-card featured-service" max={8}>
                                <div className="service-badge">Most Popular</div>
                                <div className="service-icon-wrap"><ServiceLandscapeIcon /></div>
                                <h3>Garden Installation</h3>
                                <p>Professional landscape design and full garden installation services for homes and commercial spaces.</p>
                                <DirectionArrow />
                            </TiltCard>
                        </motion.div>
                        <motion.div variants={staggerItem}>
                            <TiltCard className="service-card" max={8}>
                                <div className="service-icon-wrap"><ServiceWaterIcon /></div>
                                <h3>Plant Care Plans</h3>
                                <p>Scheduled watering, fertilization, pruning, and ongoing plant health maintenance packages.</p>
                                <DirectionArrow />
                            </TiltCard>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 3D PLANT SHOWCASE CAROUSEL */}
            <PlantCarousel />

            {/* TESTIMONIAL CAROUSEL */}
            <section className="testimonials" id="testimonials">
                <div className="container">
                    <Reveal className="section-header">
                        <div className="section-eyebrow">Customer Love</div>
                        <h2 className="section-title">What People <em>Say</em></h2>
                    </Reveal>
                    <div style={{ position: 'relative', minHeight: '280px' }}>
                        <AnimatePresence mode="wait">
                            {TESTIMONIALS.map((t, idx) => (
                                idx === activeTestimonial && (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(14, 45, 33, 0.9)',
                                            border: '1px solid rgba(210, 231, 203, 0.3)',
                                            borderRadius: '24px', padding: '44px',
                                            boxSizing: 'border-box', boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        <div style={{ color: 'var(--gold)', fontSize: '18px', letterSpacing: '4px', marginBottom: '20px' }}>★★★★★</div>
                                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: '1.8', color: '#ffffff', fontStyle: 'italic', marginBottom: '32px' }}>"{t.text}"</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '800', fontSize: '16px', border: '2px solid var(--gold)', flexShrink: 0 }}>
                                                {t.initials}
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: '700', color: '#ffffff' }}>{t.author}</div>
                                                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', marginTop: '3px', fontWeight: '600' }}>{t.role}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                        {TESTIMONIALS.map((_, idx) => (
                            <div key={idx} onClick={() => setActiveTestimonial(idx)} style={{ width: activeTestimonial === idx ? '28px' : '8px', height: '8px', borderRadius: '50px', background: activeTestimonial === idx ? 'var(--gold)' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.35s ease' }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWSLETTER CTA */}
            <section className="newsletter">
                <div className="container">
                    <Reveal className="newsletter-card" direction="up" distance={50}>
                        <div className="newsletter-content">
                            <h2>Join the <em>Green Community</em></h2>
                            <p>Get seasonal plant tips, exclusive offers, and first access to new arrivals.</p>
                            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); e.target.reset(); }}>
                                <div className="form-group">
                                    <input type="email" placeholder="Your email address" required className="form-input" />
                                    <button type="submit" className="btn-primary">Subscribe</button>
                                </div>
                            </form>
                            <p className="nl-privacy">No spam, ever. Unsubscribe anytime.</p>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
