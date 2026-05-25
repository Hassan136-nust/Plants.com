import React from 'react';
import { Link } from 'react-router-dom';
import { TESTIMONIALS, LeafCheckIcon, EcoGlobalIcon, AwardCareIcon, ServiceConsultationIcon, ServiceLandscapeIcon, ServiceWaterIcon, DirectionArrow } from '../data/constants';
import { useState, useEffect } from 'react';
import PlantCarousel from '../components/PlantCarousel';

export default function HomePage() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="hero" id="home">
                <div className="hero-overlay"></div>
                <div className="hero-fog"></div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        Premium Nursery Farm — Est. 2010
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line">Where Nature</span>
                        <span className="title-line title-italic">Comes Alive</span>
                    </h1>
                    <p className="hero-subtitle">
                        Curated tropical plants, exotic greenery, and nature-inspired collections for your home, garden, and soul.
                    </p>
                    <div className="hero-actions">
                        <Link to="/plants" className="btn-primary">
                            <span>Explore Plants</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/about" className="btn-secondary">
                            <span>Visit Nursery</span>
                        </Link>
                    </div>
                    <div className="hero-stats">
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
                    </div>
                </div>
            </section>

            {/* ABOUT PREVIEW */}
            <section className="about" id="about">
                <div className="about-bg-accent"></div>
                <div className="container">
                    <div className="about-grid">
                        <div className="about-visual">
                            <div className="about-img-frame">
                                <div className="about-img-inner">
                                    <img src="/plants.png" alt="Zia Nursery lush garden" className="about-img" />
                                    <div className="about-img-overlay"></div>
                                </div>
                                <div className="about-badge-floating">
                                    <span className="badge-num">14+</span>
                                    <span className="badge-text">Years Growing</span>
                                </div>
                            </div>
                        </div>
                        <div className="about-content">
                            <div className="section-eyebrow">Our Story</div>
                            <h2 className="section-title">A Passion Rooted<br /><em>in Nature</em></h2>
                            <p className="about-text">
                                Founded in 2010, Zia Nursery Farm was born from a deep love for the natural world. We believe every home deserves the breath of life that only plants can bring.
                            </p>
                            <p className="about-text">
                                From our sprawling 5-acre farm to your doorstep, every plant is nurtured with expert care, sustainable practices, and an unwavering commitment to quality.
                            </p>
                            <div className="about-features">
                                <div className="feature-item">
                                    <LeafCheckIcon />
                                    <div><h4>Sustainably Grown</h4><p>Eco-friendly cultivation methods and healthy organic mediums.</p></div>
                                </div>
                                <div className="feature-item">
                                    <EcoGlobalIcon />
                                    <div><h4>Global Collection</h4><p>Exotic tropical plants and rare flora sourced from 6 continents.</p></div>
                                </div>
                                <div className="feature-item">
                                    <AwardCareIcon />
                                    <div><h4>Expert Guidance</h4><p>Certified horticulturists on staff helping you with plant care plans.</p></div>
                                </div>
                            </div>
                            <Link to="/about" className="btn-primary" style={{ marginTop: '32px', display: 'inline-flex' }}>
                                Learn More About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES PREVIEW */}
            <section className="services" id="services">
                <div className="container">
                    <div className="section-header">
                        <div className="section-eyebrow">What We Offer</div>
                        <h2 className="section-title">Our <em>Services</em></h2>
                        <p className="section-desc">From consultation to installation — we cover every aspect of your green journey.</p>
                    </div>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon-wrap"><ServiceConsultationIcon /></div>
                            <h3>Plant Consultation</h3>
                            <p>One-on-one expert guidance to find the perfect plants for your space, lifestyle, and climate.</p>
                            <DirectionArrow />
                        </div>
                        <div className="service-card featured-service">
                            <div className="service-badge">Most Popular</div>
                            <div className="service-icon-wrap"><ServiceLandscapeIcon /></div>
                            <h3>Garden Installation</h3>
                            <p>Professional landscape design and full garden installation services for homes and commercial spaces.</p>
                            <DirectionArrow />
                        </div>
                        <div className="service-card">
                            <div className="service-icon-wrap"><ServiceWaterIcon /></div>
                            <h3>Plant Care Plans</h3>
                            <p>Scheduled watering, fertilization, pruning, and ongoing plant health maintenance packages.</p>
                            <DirectionArrow />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3D PLANT SHOWCASE CAROUSEL */}
            <PlantCarousel />

            {/* TESTIMONIAL CAROUSEL */}
            <section className="testimonials" id="testimonials">
                <div className="container">
                    <div className="section-header">
                        <div className="section-eyebrow">Customer Love</div>
                        <h2 className="section-title">What People <em>Say</em></h2>
                    </div>
                    <div style={{ position: 'relative', minHeight: '280px' }}>
                        {TESTIMONIALS.map((t, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: idx === 0 ? 'relative' : 'absolute',
                                    top: 0, left: 0, width: '100%',
                                    opacity: activeTestimonial === idx ? 1 : 0,
                                    pointerEvents: activeTestimonial === idx ? 'auto' : 'none',
                                    transition: 'opacity 0.6s ease',
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
                            </div>
                        ))}
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
                    <div className="newsletter-card">
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
                    </div>
                </div>
            </section>
        </>
    );
}
