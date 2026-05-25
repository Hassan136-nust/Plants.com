import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, subtotal, itemsCount, clearCart } = useCart();
    const { user, token, triggerAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: '' });

    const showToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
    };

    const handleCheckout = () => {
        if (!user || !token) {
            triggerAuth(processOrder);
            return;
        }
        processOrder(user, token);
    };

    const processOrder = async (orderUser, orderToken) => {
        setLoading(true);
        try {
            // Send entire cart to backend
            const res = await fetch(`${API}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${orderToken}` },
                body: JSON.stringify({ items: cart }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            showToast('✅ Order placed successfully!');
            clearCart();
            setTimeout(() => setIsCartOpen(false), 2000);
        } catch (err) {
            showToast(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isCartOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none' }}>
            {/* Backdrop */}
            <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', pointerEvents: 'auto', cursor: 'pointer' }}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sliding Drawer */}
            <div style={{
                position: 'relative', width: '100%', maxWidth: '420px', height: '100%',
                background: 'linear-gradient(180deg, #0b2218 0%, #081d14 100%)',
                borderLeft: '1px solid rgba(74,222,128,0.15)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
                display: 'flex', flexDirection: 'column',
                pointerEvents: 'auto', animation: 'slideInRight 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            }}>
                {/* Header */}
                <div style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M9 20a1 1 0 100-2 1 1 0 000 2zM20 20a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                        <h2 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '22px', margin: 0 }}>Your Cart</h2>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', opacity: 0.5 }}>&times;</button>
                </div>

                {/* Items List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '80px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍃</div>
                            <p style={{ fontFamily: 'var(--font-sans)' }}>Your cart is empty.</p>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: '#4ade80', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}>Continue Shopping</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'rgba(74,222,128,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>🌿</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h4 style={{ color: '#fff', fontFamily: 'var(--font-serif)', margin: 0, fontSize: '16px' }}>{item.plant.name}</h4>
                                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8, fontSize: '12px' }}>Remove</button>
                                        </div>
                                        <div style={{ color: '#f8db7d', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>{item.plant.price}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' }}>-</button>
                                            <span style={{ color: '#fff', fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer' }}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Checkout */}
                {cart.length > 0 && (
                    <div style={{ padding: '32px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '8px' }}>
                            <span style={{ opacity: 0.6 }}>Subtotal ({itemsCount} items)</span>
                            <span style={{ fontWeight: 'bold' }}>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '24px' }}>
                            <span style={{ opacity: 0.6 }}>Shipping</span>
                            <span style={{ color: '#4ade80' }}>Free</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            style={{
                                width: '100%', background: '#4ade80', color: '#081d14', border: 'none',
                                padding: '16px', borderRadius: '50px', fontWeight: 'bold', fontSize: '15px',
                                cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s',
                                boxShadow: '0 8px 24px rgba(74,222,128,0.3)'
                            }}
                        >
                            {loading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast.show && (
                <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#16402e', color: '#fff', padding: '14px 28px', borderRadius: '50px', border: '1px solid #4ade80', zIndex: 10000 }}>
                    {toast.msg}
                </div>
            )}

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
