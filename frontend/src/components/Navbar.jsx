import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon } from '../data/constants';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

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

                <div className="btn-nav-wrapper">
                    <Link to="/plants" className="btn-nav">Shop Now</Link>
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
