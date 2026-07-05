import React from 'react';

// Base shimmer block. Uses the .skeleton class defined in index.css so the
// animation is a single shared keyframe (no per-instance JS).
export function Skeleton({ width = '100%', height = 16, radius = 8, style, className = '' }) {
    return (
        <span
            className={`skeleton ${className}`}
            style={{
                display: 'block',
                width,
                height,
                borderRadius: radius,
                ...style,
            }}
        />
    );
}

// Matches the .plant-card layout so the grid doesn't shift when real data lands.
export function PlantCardSkeleton() {
    return (
        <div className="plant-card" style={{ pointerEvents: 'none' }}>
            <div className="plant-card-visual" style={{ padding: 0, overflow: 'hidden' }}>
                <Skeleton width="100%" height="100%" radius={0} />
            </div>
            <div className="plant-card-info">
                <Skeleton width="38%" height={11} radius={50} style={{ marginBottom: 14 }} />
                <Skeleton width="75%" height={20} radius={6} style={{ marginBottom: 10 }} />
                <Skeleton width="55%" height={12} radius={6} style={{ marginBottom: 22 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton width={80} height={22} radius={6} />
                    <Skeleton width={40} height={40} radius={12} />
                </div>
            </div>
        </div>
    );
}

// Big centered card used inside the featured carousel while it loads.
export function CarouselSkeleton() {
    return (
        <div
            style={{
                width: 'min(88vw, 400px)',
                height: 'clamp(420px, 68vw, 620px)',
                borderRadius: 24,
                background: '#ffffff',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
                margin: '0 auto',
            }}
        >
            <Skeleton width="100%" height="60%" radius={0} />
            <div style={{ padding: 26 }}>
                <Skeleton width="40%" height={12} radius={50} style={{ marginBottom: 16 }} />
                <Skeleton width="70%" height={26} radius={6} style={{ marginBottom: 26 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton width={100} height={30} radius={6} />
                    <Skeleton width={130} height={46} radius={12} />
                </div>
            </div>
        </div>
    );
}

// Order row placeholder for MyOrdersPage.
export function OrderSkeleton() {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18,
                padding: 24,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Skeleton width={140} height={18} radius={6} />
                <Skeleton width={90} height={26} radius={50} />
            </div>
            <Skeleton width="100%" height={12} radius={6} style={{ marginBottom: 12 }} />
            <Skeleton width="80%" height={12} radius={6} style={{ marginBottom: 12 }} />
            <Skeleton width="60%" height={12} radius={6} />
        </div>
    );
}

export default Skeleton;
