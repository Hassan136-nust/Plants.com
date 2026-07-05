import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import SmoothScroll from './motion/SmoothScroll';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
    const [particles, setParticles] = useState([]);
    const { showAuthModal, closeAuth, user } = useAuth();

    useEffect(() => {
        const generated = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: `${5 + Math.random() * 90}%`,
            delay: `${Math.random() * 6}s`,
            duration: `${20 + Math.random() * 15}s`,
            size: `${3 + Math.random() * 5}px`,
        }));
        setParticles(generated);
    }, []);

    return (
        <SmoothScroll>
            {/* Fixed background */}
            <div className="app-root-bg">
                <div className="bg-image-layer"></div>
                <div className="depth-fog"></div>
                <div className="light-rays"></div>
            </div>

            {/* Ambient particles */}
            {particles.map(p => (
                <span
                    key={p.id}
                    className="particle"
                    style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }}
                />
            ))}

            <Navbar />

            <main>{children}</main>

            <Footer />

            <CartDrawer />

            <AnimatePresence>
                {showAuthModal && (
                    <AuthModal
                        key="auth-modal"
                        actionLabel="continue"
                        onClose={closeAuth}
                    />
                )}
            </AnimatePresence>
        </SmoothScroll>
    );
}
