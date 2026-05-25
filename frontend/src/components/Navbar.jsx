import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const { user, triggerAuth, logout } = useAuth();
    const { itemsCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <LogoIcon />
                    <div className="logo-text">
                        <span className="logo-main">Zia Nursery</span>
                        <span className="logo-sub">Farm</span>
                    </div>
                </Link>

                <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                    <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
                    <Link to="/plants" className={`nav-link ${isActive('/plants') ? 'active' : ''}`}>Plants</Link>
                    <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
                </div>

                <div className="btn-nav-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* User Auth Section */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', display: window.innerWidth > 768 ? 'flex' : 'none' }}>
                            <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'var(--font-sans)', opacity: 0.8 }}>
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            <button
                                onClick={logout}
                                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '50px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            className="nav-link"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                            onClick={() => triggerAuth()}
                        >
                            Sign In
                        </button>
                    )}

                    {/* Cart Trigger */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        style={{
                            background: '#4ade80', border: 'none', width: '44px', height: '44px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', position: 'relative', boxShadow: '0 4px 12px rgba(74,222,128,0.3)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#081d14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 20a1 1 0 100-2 1 1 0 000 2zM20 20a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                        </svg>

                        {itemsCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-4px', right: '-4px',
                                background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 'bold',
                                width: '20px', height: '20px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid #081d14'
                            }}>
                                {itemsCount}
                            </span>
                        )}
                    </button>
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
    );
}
