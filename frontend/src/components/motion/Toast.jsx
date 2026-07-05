import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Unified animated toast used by Plants, Carousel and Cart. Springs up from the
// bottom-center and fades out. `success` toggles the accent color.
export default function Toast({ show, message, success = true }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 24, x: '-50%', scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: 16, x: '-50%', scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    style={{
                        position: 'fixed',
                        bottom: 32,
                        left: '50%',
                        zIndex: 12000,
                        padding: '14px 28px',
                        borderRadius: 50,
                        fontFamily: 'var(--font-sans)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        background: success
                            ? 'linear-gradient(135deg, #0f3322 0%, #081d14 100%)'
                            : 'linear-gradient(135deg, #3b1414 0%, #1e0a0a 100%)',
                        border: `1px solid ${success ? 'rgba(74,222,128,0.45)' : 'rgba(239,68,68,0.45)'}`,
                        boxShadow: '0 18px 44px rgba(0,0,0,0.45)',
                    }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
