import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { usePrefersReducedMotion } from './useReducedMotion';

// Counts from 0 up to `value` when scrolled into view. Keeps any non-numeric
// suffix/prefix (e.g. "500+", "15K+") intact.
export default function Counter({ value, duration = 1600, className, style }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const reduced = usePrefersReducedMotion();

    // Split "15K+" -> { num: 15, suffix: "K+" }
    const match = String(value).match(/^(\D*)([\d.,]+)(.*)$/);
    const prefix = match ? match[1] : '';
    const target = match ? parseFloat(match[2].replace(/,/g, '')) : 0;
    const suffix = match ? match[3] : '';
    const decimals = match && match[2].includes('.') ? 1 : 0;

    const [display, setDisplay] = useState(reduced ? target : 0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!inView || reduced || !match) {
            if (reduced || !match) setDisplay(target);
            return;
        }
        let start = null;
        const step = (ts) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setDisplay(target * eased);
            if (p < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [inView, reduced, target, duration, match]);

    const shown = decimals
        ? display.toFixed(1)
        : Math.round(display).toLocaleString();

    return (
        <span ref={ref} className={className} style={style}>
            {prefix}{shown}{suffix}
        </span>
    );
}
