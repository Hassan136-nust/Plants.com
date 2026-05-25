import React from 'react';
import { LeafCheckIcon, EcoGlobalIcon, AwardCareIcon, ServiceConsultationIcon, ServiceLandscapeIcon, ServiceWaterIcon, DirectionArrow } from '../data/constants';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <>
            {/* PAGE HERO */}
            <section style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center' }}>
                <div className="container">
                    <div className="section-eyebrow">Our Story</div>
                    <h1 className="section-title"><em>About</em> Zia Nursery Farm</h1>
                    <p className="section-desc" style={{ maxWidth: '620px', margin: '16px auto 0' }}>
                        A family-run nursery born from a deep love for the natural world. We've been bringing nature closer to homes since 2010.
                    </p>
                </div>
            </section>

            {/* ABOUT DETAIL */}
            <section className="about" style={{ paddingTop: '40px' }}>
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
                            <h2 className="section-title">A Passion Rooted<br /><em>in Nature</em></h2>
                            <p className="about-text">
                                Founded in 2010, Zia Nursery Farm was born from a deep love for the natural world. We believe every home deserves the breath of life that only plants can bring — the quiet rustle of leaves, the vibrant palette of blooms, and the calming presence of greenery.
                            </p>
                            <p className="about-text">
                                From our sprawling 5-acre farm to your doorstep, every plant is nurtured with expert care, sustainable practices, and an unwavering commitment to quality. Our certified horticulturists handpick each specimen and ensure it arrives in perfect health.
                            </p>
                            <p className="about-text">
                                We don't just sell plants — we cultivate relationships with nature and with our customers, guiding every step from selection to long-term care.
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
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS ROW */}
            <section style={{ padding: '80px 0', background: 'rgba(8,29,20,0.6)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
                        {[
                            { num: '500+', label: 'Plant Species' },
                            { num: '15K+', label: 'Happy Customers' },
                            { num: '5 Acres', label: 'Farm Size' },
                            { num: '14+', label: 'Years of Excellence' },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="stat-num" style={{ fontSize: '40px' }}>{s.num}</div>
                                <div className="stat-label" style={{ marginTop: '8px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="services">
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

            {/* CTA */}
            <section className="newsletter" style={{ paddingBottom: '60px' }}>
                <div className="container">
                    <div className="newsletter-card" style={{ textAlign: 'center' }}>
                        <div className="newsletter-content">
                            <h2>Ready to <em>Get Started?</em></h2>
                            <p>Browse our premium plant collection or get in touch with our experts today.</p>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
                                <Link to="/plants" className="btn-primary">Browse Plants</Link>
                                <Link to="/contact" className="btn-secondary">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
