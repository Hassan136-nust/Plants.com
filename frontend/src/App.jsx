import React, { useState, useEffect } from 'react';
import './App.css';

// --- PROFESSIONAL CUSTOM SVG ICONS ---

// Logo Twin Leaf Icon
const LogoIcon = () => (
  <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 22 2c0 5-1 7.5-6.1 11.8A7 7 0 0 1 11 20z" />
    <path d="M9 22a5 5 0 0 1-5-5c0-4.25 3.75-6 8-8" />
  </svg>
);

// Monstera SVG
const MonsteraIcon = () => (
  <svg className="plant-card-svg-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M12 2c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z" />
    <path d="M12 6s3-1 5 1M12 10s4-1.5 6 1M12 14s4-1 5.5 2M12 6s-3-1-5 1M12 10s-4-1.5-6 1M12 14s-4-1-5.5 2" />
  </svg>
);

// Snake Plant SVG
const SnakePlantIcon = () => (
  <svg className="plant-card-svg-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22C6 14 6 8 8 2c2 6 2 12 0 20z" />
    <path d="M12 22c-2.5-7-2.5-13 0-20 2.5 7 2.5 13 0 20z" />
    <path d="M16 22c-2-6-2-12 0-20 2 6 2 12 0 20z" />
  </svg>
);

// Hanging Pothos SVG
const PothosIcon = () => (
  <svg className="plant-card-svg-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M12 6c3 0 5 2 5 5 0 4-5 7-5 7s-5-3-5-7c0-3 2-5 5-5z" />
    <path d="M7 12c-2 0-3 1.5-3 3 0 2.5 3 4.5 3 4.5s3-2 3-4.5c0-1.5-1-3-3-3z" />
    <path d="M17 14c-1.5 0-2.5 1-2.5 2.5 0 2 2.5 3.5 2.5 3.5s2.5-1.5 2.5-3.5c0-1.5-1-2.5-2.5-2.5z" />
  </svg>
);

// Succulent SVG
const SucculentIcon = () => (
  <svg className="plant-card-svg-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2s-3 3.5-3 6.5S10.5 13 12 13s3-1.5 3-4.5S12 2 12 2z" />
    <path d="M12 22s-3-3.5-3-6.5s1.5-4.5 3-4.5s3 1.5 3 4.5s-3 6.5-3 6.5z" />
    <path d="M22 12s-3.5-3-6.5-3S11 10.5 11 12s1.5 3 4.5 3s6.5-3 6.5-3z" />
    <path d="M2 12s3.5-3 6.5-3S13 10.5 13 12s-1.5 3-4.5 3S2 12 2 12z" />
  </svg>
);

// Lily/Flower SVG
const LilyIcon = () => (
  <svg className="plant-card-svg-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12" />
    <path d="M12 12c-3-2-5-5-5-8 0 4 3 6 5 8zm0 0c3-2 5-5 5-8 0 4-3 6-5 8z" />
    <circle cx="12" cy="4" r="1.5" fill="var(--accent)" />
  </svg>
);

// Calathea/Leaf SVG
const CalatheaIcon = () => (
  <svg className="plant-card-svg-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
    <path d="M12 2v20" />
    <path d="M22 12c-4-3-6-3-10 0M2 12c4-3 6-3 10 0M20 7c-3-2-5-2-8 1M4 7c3-2 5-2 8 1" />
  </svg>
);

// Arrow Indicator
const DirectionArrow = () => (
  <svg className="service-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// Check / Globe / Heart replacement SVGs for Features List
const LeafCheckIcon = () => (
  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const EcoGlobalIcon = () => (
  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const AwardCareIcon = () => (
  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Services SVGs
const ServiceConsultationIcon = () => (
  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ServiceLandscapeIcon = () => (
  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ServiceWaterIcon = () => (
  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

// Location Pin
const ContactLocationIcon = () => (
  <svg className="contact-card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Phone Icon
const ContactPhoneIcon = () => (
  <svg className="contact-card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Hours Clock
const ContactClockIcon = () => (
  <svg className="contact-card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Email Envelope
const ContactMailIcon = () => (
  <svg className="contact-card-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// Plus Button SVG
const PlusSymbol = () => (
  <svg className="plant-card-btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Plant Catalog Database mapping to specific premium SVGs
const PLANTS_DATA = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'tropical',
    price: '$45.00',
    tag: 'Popular',
    iconComp: <MonsteraIcon />
  },
  {
    id: 2,
    name: 'Snake Plant Laurentii',
    scientificName: 'Sansevieria trifasciata',
    category: 'indoor',
    price: '$28.00',
    tag: 'Low Light',
    iconComp: <SnakePlantIcon />
  },
  {
    id: 3,
    name: 'Golden Pothos Hanging',
    scientificName: 'Epipremnum aureum',
    category: 'indoor',
    price: '$22.00',
    tag: 'Easy Care',
    iconComp: <PothosIcon />
  },
  {
    id: 4,
    name: 'Blue Star Succulent',
    scientificName: 'Echeveria glauca',
    category: 'succulents',
    price: '$18.00',
    tag: 'Drought Tolerant',
    iconComp: <SucculentIcon />
  },
  {
    id: 5,
    name: 'Paradise Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'flowering',
    price: '$35.00',
    tag: 'Air Purifier',
    iconComp: <LilyIcon />
  },
  {
    id: 6,
    name: 'Calathea Orbifolia',
    scientificName: 'Calathea orbifolia',
    category: 'tropical',
    price: '$38.00',
    tag: 'Rare Exotics',
    iconComp: <CalatheaIcon />
  }
];

const TESTIMONIALS = [
  {
    text: "Zia Nursery completely transformed my apartment. The plants they recommended are thriving and my space feels like a rainforest retreat. Absolutely world-class service!",
    author: "Sarah Lim",
    role: "Interior Designer",
    initials: "SL"
  },
  {
    text: "I ordered 20 plants for my office lobby and every single one arrived in perfect condition. Their garden installation team was professional and the result is breathtaking.",
    author: "Ahmed Malik",
    role: "CEO, TechVenture Co.",
    initials: "AM"
  },
  {
    text: "The rare Monstera I bought here is the crown jewel of my collection. Zia Nursery has plant varieties I've never seen anywhere else. Truly a plant paradise!",
    author: "Fatima Rashid",
    role: "Plant Enthusiast & Blogger",
    initials: "FR"
  },
  {
    text: "Their care plan service is exceptional. My rooftop garden has never looked better and the team is always responsive and knowledgeable. Highly recommended!",
    author: "Hassan Khan",
    role: "Architect & Home Owner",
    initials: "HK"
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom Toast Message state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Optimized Ambient Static Particles (Reduced quantity, completely CSS anims)
  const [particles, setParticles] = useState([]);

  // Toast triggers
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3800);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Instantiate limited set of floating decorative particles once (no re-renders, purely CSS-based loop)
    const generatedParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${20 + Math.random() * 15}s`,
      size: `${3 + Math.random() * 5}px`
    }));
    setParticles(generatedParticles);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-advance testimonial every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredPlants = activeTab === 'all'
    ? PLANTS_DATA
    : PLANTS_DATA.filter(p => p.category === activeTab);

  const handleSubscribe = (e) => {
    e.preventDefault();
    triggerToast("✨ Welcome! You are now subscribed to the Zia Green Newsletter.");
    e.target.reset();
  };

  const handleContact = (e) => {
    e.preventDefault();
    triggerToast("🌿 Form submitted. Our nursery experts will contact you soon!");
    e.target.reset();
  };

  return (
    <>
      {/* CRISPY STATIC BACKGROUND & AMBIENT FOG */}
      <div className="app-root-bg">
        <div className="bg-image-layer"></div>
        <div className="depth-fog"></div>
        <div className="light-rays"></div>
      </div>

      {/* Lightweight Ambient Particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size
          }}
        ></span>
      ))}

      {/* ULTRA LUXURIOUS STICKY GLASSMORPHIC NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>
            <LogoIcon />
            <div className="logo-text">
              <span className="logo-main">Zia Nursery</span>
              <span className="logo-sub">Farm</span>
            </div>
          </a>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#home" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#plants" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Plants</a>
            <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>

          <div className="btn-nav-wrapper">
            <a href="#plants" className="btn-nav">Shop Now</a>
          </div>

          <button
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
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
            <a href="#plants" className="btn-primary">
              <span>Explore Plants</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#about" className="btn-secondary">
              <span>Visit Nursery</span>
            </a>
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
        <div className="hero-scroll-hint">
          <div className="scroll-line"></div>
          {/* <span>Scroll</span> */}
        </div>
      </section>

      {/* ABOUT SECTION */}
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
                Founded in 2010, Zia Nursery Farm was born from a deep love for the natural world. We believe every home deserves the breath of life that only plants can bring — the quiet rustle of leaves, the vibrant palette of blooms, and the calming presence of greenery.
              </p>
              <p className="about-text">
                From our sprawling 5-acre farm to your doorstep, every plant is nurtured with expert care, sustainable practices, and an unwavering commitment to quality.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <LeafCheckIcon />
                  <div>
                    <h4>Sustainably Grown</h4>
                    <p>Eco-friendly cultivation methods and healthy organic mediums.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <EcoGlobalIcon />
                  <div>
                    <h4>Global Collection</h4>
                    <p>Exotic tropical plants and rare flora sourced from 6 continents.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <AwardCareIcon />
                  <div>
                    <h4>Expert Guidance</h4>
                    <p>Certified horticulturists on staff helping you with plant care plans.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PLANTS CATALOG (NO EMOJIS, HIGH-END CARDS) */}
      <section className="plants" id="plants">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Our Collection</div>
            <h2 className="section-title">Featured <em>Plants</em></h2>
            <p className="section-desc">Hand-picked rarities and beloved classics, represented through premium design aesthetics.</p>
          </div>

          <div className="plant-filters">
            {['all', 'tropical', 'succulents', 'flowering', 'indoor'].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} Plants
              </button>
            ))}
          </div>

          <div className="plant-grid">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className="plant-card">
                <div className="plant-card-visual">
                  <span className="plant-card-tag">{plant.tag}</span>
                  {plant.iconComp}
                </div>
                <div className="plant-card-info">
                  <span className="plant-card-cat">{plant.category}</span>
                  <h3 className="plant-card-title">{plant.name}</h3>
                  <p className="plant-card-science">{plant.scientificName}</p>
                  <div className="plant-card-bottom">
                    <span className="plant-card-price">{plant.price}</span>
                    <button className="plant-card-btn" onClick={() => triggerToast(`Added ${plant.name} to Cart`)}>
                      <PlusSymbol />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">What We Offer</div>
            <h2 className="section-title">Our <em>Services</em></h2>
            <p className="section-desc">From consultation to installation — we cover every aspect of your green journey.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrap">
                <ServiceConsultationIcon />
              </div>
              <h3>Plant Consultation</h3>
              <p>One-on-one expert guidance to find the perfect plants for your space, lifestyle, and climate.</p>
              <DirectionArrow />
            </div>

            <div className="service-card featured-service">
              <div className="service-badge">Most Popular</div>
              <div className="service-icon-wrap">
                <ServiceLandscapeIcon />
              </div>
              <h3>Garden Installation</h3>
              <p>Professional landscape design and full garden installation services for homes and commercial spaces.</p>
              <DirectionArrow />
            </div>

            <div className="service-card">
              <div className="service-icon-wrap">
                <ServiceWaterIcon />
              </div>
              <h3>Plant Care Plans</h3>
              <p>Scheduled watering, fertilization, pruning, and ongoing plant health maintenance packages.</p>
              <DirectionArrow />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL FADE CAROUSEL */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Customer Love</div>
            <h2 className="section-title">What People <em>Say</em></h2>
          </div>

          {/* One card visible at a time via opacity fade */}
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
                  borderRadius: '24px',
                  padding: '44px',
                  boxSizing: 'border-box',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ color: 'var(--gold)', fontSize: '18px', letterSpacing: '4px', marginBottom: '20px' }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: '1.8', color: '#ffffff', fontStyle: 'italic', marginBottom: '32px' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--secondary) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)', fontWeight: '800', fontSize: '16px',
                    border: '2px solid var(--gold)', flexShrink: 0
                  }}>
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

          {/* Pill navigation dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
            {TESTIMONIALS.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                style={{
                  width: activeTestimonial === idx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '50px',
                  background: activeTestimonial === idx ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  boxShadow: activeTestimonial === idx ? '0 0 10px var(--gold-glow)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h2>Join the <em>Green Community</em></h2>
              <p>Get seasonal plant tips, exclusive offers, and first access to new arrivals.</p>
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <div className="form-group">
                  <input type="email" placeholder="Your email address" required className="form-input" />
                  <button type="submit" className="btn-primary">Subscribe</button>
                </div>
              </form>
              <p className="nl-privacy">🔒 No spam, ever. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & VISIT CARD */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Get In Touch</div>
            <h2 className="section-title">Visit <em>Us</em></h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <ContactLocationIcon />
                <h4>Our Location</h4>
                <p>Green Valley Farm Road<br />Lahore, Punjab, Pakistan</p>
              </div>

              <div className="contact-card">
                <ContactPhoneIcon />
                <h4>Phone</h4>
                <p>+92 300 123 4567<br />+92 42 3456 7890</p>
              </div>

              <div className="contact-card">
                <ContactClockIcon />
                <h4>Opening Hours</h4>
                <p>Mon – Sat: 8:00 AM – 7:00 PM<br />Sunday: 10:00 AM – 5:00 PM</p>
              </div>

              <div className="contact-card">
                <ContactMailIcon />
                <h4>Email</h4>
                <p>hello@zianurseryfarm.com</p>
              </div>
            </div>

            <div className="contact-form-wrap">
              <form className="contact-form" onSubmit={handleContact}>
                <h3>Send a Message</h3>
                <div className="input-row">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your name" className="form-input" required />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com" className="form-input" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginTop: '20px' }}>
                  <label>Message</label>
                  <textarea placeholder="Tell us about your dream garden..." className="form-input form-textarea" rows={4} required></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '26px' }}>
                  <span>Send Message</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <LogoIcon />
                <div>
                  <span className="footer-logo-main">Zia Nursery</span>
                  <span className="footer-logo-sub">Farm</span>
                </div>
              </div>
              <p className="footer-tagline">Cultivating beauty, one plant at a time. Bringing nature closer to your life since 2010.</p>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg className="social-icon-svg" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" class="social-icon" aria-label="Facebook">
                  <svg className="social-icon-svg" viewBox="0 0 24 24">
                    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V2h-3a5 5 0 0 0-5 5v1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#plants">Our Plants</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Categories</h4>
              <ul>
                <li><a href="#plants" onClick={() => setActiveTab('tropical')}>Tropical</a></li>
                <li><a href="#plants" onClick={() => setActiveTab('succulents')}>Succulents</a></li>
                <li><a href="#plants" onClick={() => setActiveTab('indoor')}>Indoor</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <div className="footer-bottom-inner">
              <p>© 2026 Zia Nursery Farm. All rights reserved. Crafted with 💚 for nature lovers.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Styled Toast Notification Alerts */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <span>{toastMessage}</span>
      </div>
    </>
  );
}

export default App;
