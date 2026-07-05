import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from './useReducedMotion';

const OFFSETS = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
    none: { x: 0, y: 0 },
};

// Scroll-triggered entrance for any block of markup. Drop-in wrapper that
// fades + slides content into view once, respecting reduced-motion.
export default function Reveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.7,
    distance,
    once = true,
    amount = 0.2,
    as = 'div',
    className,
    style,
    ...rest
}) {
    const reduced = usePrefersReducedMotion();
    const MotionTag = motion[as] || motion.div;

    if (reduced) {
        const Tag = as;
        return (
            <Tag className={className} style={style} {...rest}>
                {children}
            </Tag>
        );
    }

    const off = OFFSETS[direction] || OFFSETS.up;
    const scaled = distance != null
        ? { x: off.x ? Math.sign(off.x) * distance : 0, y: off.y ? Math.sign(off.y) * distance : 0 }
        : off;

    return (
        <MotionTag
            className={className}
            style={style}
            initial={{ opacity: 0, ...scaled }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, amount }}
            transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

// Stagger container + item pair for lists/grids.
export const staggerContainer = (stagger = 0.12, delayChildren = 0.05) => ({
    hidden: {},
    show: {
        transition: { staggerChildren: stagger, delayChildren },
    },
});

export const staggerItem = {
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};
