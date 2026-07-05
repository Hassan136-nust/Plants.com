import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { usePrefersReducedMotion, useIsTouch } from './useReducedMotion';

// Pointer-driven 3D tilt with a moving glare highlight. Spring-damped so it
// feels premium rather than jittery. Falls back to a plain div on touch /
// reduced-motion so phones and accessibility users get a static card.
export default function TiltCard({
    children,
    className,
    style,
    max = 10,
    glare = true,
    scale = 1.02,
    ...rest
}) {
    const reduced = usePrefersReducedMotion();
    const touch = useIsTouch();
    const ref = useRef(null);

    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);

    const springCfg = { stiffness: 220, damping: 20, mass: 0.4 };
    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), springCfg);
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), springCfg);

    const glareX = useTransform(px, [0, 1], ['0%', '100%']);
    const glareY = useTransform(py, [0, 1], ['0%', '100%']);

    if (reduced || touch) {
        return (
            <div className={className} style={style} {...rest}>
                {children}
            </div>
        );
    }

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
    };

    const handleLeave = () => {
        px.set(0.5);
        py.set(0.5);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{
                ...style,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                transformPerspective: 900,
                position: 'relative',
            }}
            whileHover={{ scale }}
            transition={{ scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            {...rest}
        >
            {children}
            {glare && (
                <motion.span
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        pointerEvents: 'none',
                        background: useTransform(
                            [glareX, glareY],
                            ([gx, gy]) =>
                                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 45%)`
                        ),
                        mixBlendMode: 'soft-light',
                    }}
                />
            )}
        </motion.div>
    );
}
