import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const statusConfig = {
    pending: { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', icon: '✅' },
    delivered: { label: 'Delivered', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', icon: '📦' },
};

const fmt = (n) => `Rs. ${Math.round(n || 0).toLocaleString('en-PK')}`;

const parsePriceNum = (val) => {
    if (!val && val !== 0) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
};

export default function MyOrdersPage() {
    const { user, token, triggerAuth } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (!user || !token) { setLoading(false); return; }
        fetch(`${API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setOrders(data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, token]);

    if (!user) {
        return (
            <div style={{ padding: '140px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>🔒</div>
                <h2 style={{ color: '#fff', fontSize: '28px', marginBottom: '12px' }}>Sign In to View Orders</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>You need to be logged in to see your order history.</p>
                <button
                    onClick={() => triggerAuth()}
                    style={{ background: '#4ade80', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
                >
                    Sign In
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '140px 24px', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <section style={{ padding: '120px 24px 80px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '28px', fontFamily: 'var(--font-serif)', fontWeight: '600', marginBottom: '4px' }}>
                            My Orders
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                        </p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px', background: 'rgba(4,12,8,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🌱</div>
                        <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>No orders yet</h3>
                        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>Browse our collection and place your first order!</p>
                        <button
                            onClick={() => navigate('/plants')}
                            style={{ background: '#4ade80', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                        >
                            Shop Plants
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map(order => {
                            const status = statusConfig[order.status] || statusConfig.pending;
                            const isExpanded = expandedId === order._id;

                            const calcTotal = (() => {
                                if (!order.items?.length) return order.totalAmount || 0;
                                const sum = order.items.reduce((s, it) => {
                                    const p = (it.priceNum && it.priceNum > 0) ? it.priceNum : parsePriceNum(it.price);
                                    return s + p * (it.quantity || 1);
                                }, 0);
                                return sum > 0 ? sum : (order.totalAmount || 0);
                            })();

                            return (
                                <div key={order._id} style={{
                                    background: 'rgba(4,12,8,0.82)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.2s',
                                }}>
                                    {/* Order Summary Row */}
                                    <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        {/* Left: Date + ID */}
                                        <div>
                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: 'monospace' }}>
                                                #{order._id.slice(-8).toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Center: Plants summary */}
                                        <div style={{ flex: 1, minWidth: '160px' }}>
                                            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                                                {order.items?.length === 1
                                                    ? order.items[0].plantName
                                                    : `${order.items?.[0]?.plantName} + ${(order.items?.length || 1) - 1} more`}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
                                                {order.items?.reduce((s, i) => s + (i.quantity || 1), 0)} item(s)
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: '#f8db7d', fontSize: '16px', fontWeight: '700' }}>{fmt(calcTotal)}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>70% advance paid</div>
                                        </div>

                                        {/* Status badge */}
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: status.bg, color: status.color, border: `1px solid ${status.color}44`, fontSize: '12px', fontWeight: '600' }}>
                                            {status.icon} {status.label}
                                        </div>

                                        {/* Toggle */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
                                        >
                                            {isExpanded ? '▲ Hide' : '▼ Details'}
                                        </button>
                                    </div>

                                    {/* Progress bar */}
                                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.04)' }}>
                                        <div style={{ height: '100%', background: status.color, width: order.status === 'delivered' ? '100%' : order.status === 'confirmed' ? '60%' : '20%', transition: 'width 0.5s ease' }} />
                                    </div>

                                    {/* Expandable details */}
                                    {isExpanded && (
                                        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                                            {/* Items */}
                                            <div style={{ flex: '1 1 240px' }}>
                                                <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>Items Ordered</div>
                                                {order.items?.map((item, i) => {
                                                    const p = (item.priceNum && item.priceNum > 0) ? item.priceNum : parsePriceNum(item.price);
                                                    return (
                                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '14px' }}>
                                                            <span style={{ color: '#fff' }}>
                                                                <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: '8px' }}>{item.quantity}×</span>
                                                                {item.plantName}
                                                            </span>
                                                            <span style={{ color: '#f8db7d' }}>{fmt(p * item.quantity)}</span>
                                                        </div>
                                                    );
                                                })}
                                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '4px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Total</span>
                                                        <span style={{ color: '#4ade80', fontWeight: '700', fontSize: '15px' }}>{fmt(calcTotal)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>70% Advance Paid</span>
                                                        <span style={{ color: '#fbbf24', fontSize: '12px' }}>{fmt(calcTotal * 0.7)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>30% On Delivery</span>
                                                        <span style={{ color: '#fbbf24', fontSize: '12px' }}>{fmt(calcTotal * 0.3)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delivery Info */}
                                            <div style={{ flex: '0 1 200px' }}>
                                                <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>Delivery Info</div>
                                                {[
                                                    ['Address', order.address],
                                                    ['City', order.city],
                                                    ['Zip', order.zipCode],
                                                    ['Phone', order.phone],
                                                ].map(([label, val]) => (
                                                    <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                                                        <span style={{ color: 'rgba(255,255,255,0.35)', minWidth: '56px', flexShrink: 0 }}>{label}</span>
                                                        <span style={{ color: '#fff' }}>{val || '—'}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Status Timeline */}
                                            <div style={{ flex: '0 1 180px' }}>
                                                <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>Order Status</div>
                                                {[
                                                    { key: 'pending', label: 'Order Placed', icon: '📋' },
                                                    { key: 'confirmed', label: 'Confirmed', icon: '✅' },
                                                    { key: 'delivered', label: 'Delivered', icon: '📦' },
                                                ].map((step, i) => {
                                                    const stepOrder = ['pending', 'confirmed', 'delivered'];
                                                    const currentIdx = stepOrder.indexOf(order.status);
                                                    const stepIdx = stepOrder.indexOf(step.key);
                                                    const done = stepIdx <= currentIdx;
                                                    return (
                                                        <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? statusConfig[step.key]?.bg || 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? statusConfig[step.key]?.color || '#4ade80' : 'rgba(255,255,255,0.1)'}`, fontSize: '13px', transition: 'all 0.3s' }}>
                                                                {done ? step.icon : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'block' }} />}
                                                            </div>
                                                            <span style={{ color: done ? '#fff' : 'rgba(255,255,255,0.25)', fontSize: '13px', fontWeight: done ? '500' : '400' }}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
