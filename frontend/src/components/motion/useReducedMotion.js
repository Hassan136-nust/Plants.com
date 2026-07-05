import { useEffect, useState } from 'react';

// Single source of truth for honoring the user's OS-level "reduce motion" setting.
// Every animated primitive in the app gates on this so we never fight accessibility.
export function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(mq.matches);
        update();
        // Safari <14 uses addListener
        if (mq.addEventListener) mq.addEventListener('change', update);
        else mq.addListener(update);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', update);
            else mq.removeListener(update);
        };
    }, []);

    return reduced;
}

// Coarse-pointer / small-screen check — used to soften or disable tilt & parallax on phones.
export function useIsTouch() {
    const [touch, setTouch] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 640px)');
        const update = () => setTouch(mq.matches);
        update();
        if (mq.addEventListener) mq.addEventListener('change', update);
        else mq.addListener(update);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', update);
            else mq.removeListener(update);
        };
    }, []);
    return touch;
}
