import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Mounts Lenis momentum scrolling once for the whole app and keeps GSAP
// ScrollTrigger perfectly in sync with it. Disabled entirely when the user
// prefers reduced motion so native scrolling is preserved.
export default function SmoothScroll({ children }) {
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.6,
        });

        // Drive Lenis from GSAP's ticker for a single unified RAF loop.
        lenis.on('scroll', ScrollTrigger.update);
        const onTick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        // Expose for anchor links / programmatic scrolls if ever needed.
        window.__lenis = lenis;
        document.documentElement.classList.add('lenis');

        return () => {
            gsap.ticker.remove(onTick);
            lenis.destroy();
            delete window.__lenis;
            document.documentElement.classList.remove('lenis');
        };
    }, [reduced]);

    return children;
}
