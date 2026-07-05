import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { parsePrice, formatRupee } from '../utils/price';
import { API_URL } from '../config';

export default function CheckoutPage() {
    const { cart, subtotal, itemsCount, clearCart } = useCart();
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: '', zipCode: ''
    });
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const advanceAmountNum = subtotal * 0.70;
    const deliveryAmountNum = subtotal * 0.30;

    const handleInput = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleFile = (e) => setReceipt(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (cart.length === 0) return setError('Your cart is empty');
        if (!receipt) return setError('Please upload your payment receipt');

        setLoading(true);

        try {
            // 1. Upload receipt
            const formData = new FormData();
            formData.append('receipt', receipt);
            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

            // 2. Place Order
            const orderRes = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ items: cart, ...form, receiptUrl: uploadData.url, advancePaid: true })
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.message || 'Order failed');

            // Success!
            clearCart();
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 11001, display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '20px',
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    style={{
                        width: '100%', maxWidth: '460px', textAlign: 'center',
                        background: 'linear-gradient(145deg, #0f3322 0%, #081d14 100%)',
                        border: '1px solid rgba(74,222,128,0.3)', borderRadius: '24px',
                        padding: '48px 40px', boxShadow: '0 40px 90px rgba(0,0,0,0.7), 0 0 70px rgba(74,222,128,0.12)',
                    }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
                        style={{
                            width: 84, height: 84, margin: '0 auto 24px', borderRadius: '50%',
                            background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <motion.svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <motion.path
                                d="M20 6L9 17l-5-5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.4, ease: 'easeInOut' }}
                            />
                        </motion.svg>
                    </motion.div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '28px', marginBottom: '12px' }}>Order Placed! 🌿</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
                        Thank you! We've received your order and will verify your payment receipt shortly. You can track its status any time.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/my-orders')} style={{ background: '#4ade80', color: '#081d14', border: 'none', padding: '13px 26px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 8px 24px rgba(74,222,128,0.3)' }}>
                            View My Orders
                        </button>
                        <button onClick={() => navigate('/plants')} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '13px 26px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                            Keep Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '20px' }}>Your cart is empty.</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Add some plants to your cart to continue shopping.</p>
                <button
                    onClick={() => navigate('/plants')}
                    style={{ background: '#4ade80', padding: '12px 24px', borderRadius: '50px', marginTop: '20px', cursor: 'pointer', border: 'none', fontWeight: 'bold', color: '#000' }}
                >
                    Browse Plants
                </button>
            </div>
        );
    }

    if (!user || !token) {
        return (
            <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '20px' }}>Please Sign In</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>You need to be logged in to proceed to checkout.</p>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: '#4ade80', padding: '12px 24px', borderRadius: '50px', marginTop: '20px', cursor: 'pointer', border: 'none', fontWeight: 'bold', color: '#000' }}
                >
                    Go to Home & Sign In
                </button>
            </div>
        );
    }

    return (
        <section className="container" style={{ padding: '120px 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
                display: 'flex', gap: '40px', flexWrap: 'wrap', width: '100%', maxWidth: '1100px',
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
            }}>
                {/* Form Column */}
                <div style={{ flex: '1 1 500px' }}>
                    <h2 className="section-title" style={{ fontSize: '42px', marginBottom: '8px' }}>Finalize Order</h2>
                    <p style={{ color: '#fff', opacity: 0.6, marginBottom: '40px', fontSize: '15px', fontFamily: 'var(--font-sans)' }}>
                        Please fill out your delivery details carefully.
                    </p>

                    {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input className="contact-input" style={{ flex: 1 }} type="text" name="name" placeholder="Full Name" required value={form.name} onChange={handleInput} />
                            <input className="contact-input" style={{ flex: 1 }} type="email" name="email" placeholder="Email Address" required value={form.email} onChange={handleInput} />
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input className="contact-input" style={{ flex: 1 }} type="tel" name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleInput} />
                        </div>
                        <input className="contact-input" type="text" name="address" placeholder="Street Address" required value={form.address} onChange={handleInput} />
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input className="contact-input" style={{ flex: 2 }} type="text" name="city" placeholder="City" required value={form.city} onChange={handleInput} />
                            <input className="contact-input" style={{ flex: 1 }} type="text" name="zipCode" placeholder="Zip Code" required value={form.zipCode} onChange={handleInput} />
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', marginTop: '16px' }}>
                            <h4 style={{ color: '#4ade80', marginBottom: '16px', fontSize: '18px' }}>Payment Instructions</h4>
                                <p style={{ color: '#fff', fontSize: '14px', lineHeight: 1.6, opacity: 0.9 }}>
                                Please pay <strong style={{ color: '#f8db7d' }}>70% advance ({formatRupee(advanceAmountNum)})</strong> to confirm your order.
                                The remaining 30% ({formatRupee(deliveryAmountNum)}) will be collected on delivery.
                            </p>
                            <div style={{ padding: '16px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px', marginTop: '16px', border: '1px dashed rgba(74,222,128,0.3)' }}>
                                <p style={{ color: '#fff', fontSize: '14px', margin: '0 0 8px' }}>Send funds via Easypaisa or Jazzcash to:</p>
                                <h3 style={{ color: '#4ade80', fontSize: '24px', margin: 0, letterSpacing: '2px' }}>03289082754</h3>
                            </div>
                            <div style={{ marginTop: '24px' }}>
                                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px' }}>Upload Payment Screenshot / Receipt:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={handleFile}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ background: loading ? '#2d7a4f' : '#4ade80', color: '#000', border: 'none', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '16px', opacity: loading ? 0.85 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                        >
                            {loading && (
                                <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                            )}
                            {loading ? 'Uploading & Placing Order...' : 'Confirm Order'}
                        </button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div style={{ flex: '1 1 350px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', height: 'max-content' }}>
                    <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ opacity: 0.6 }}>{item.quantity}x</span>
                                    <span>{item.plant.name}</span>
                                </div>
                                <span style={{ color: '#f8db7d' }}>{(() => {
                                    const price = parsePrice(item.plant?.price);
                                    return `Rs. ${(price * item.quantity).toFixed(0)}`;
                                })()}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                            <span style={{ opacity: 0.6 }}>Subtotal ({itemsCount} items)</span>
                            <span>{formatRupee(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                            <span style={{ opacity: 0.6 }}>Shipping</span>
                            <span style={{ color: '#4ade80' }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '20px', fontWeight: 'bold', marginTop: '12px' }}>
                            <span>Total</span>
                            <span>{formatRupee(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontSize: '16px', fontWeight: 'bold', marginTop: '12px' }}>
                            <span>70% Advance Payable</span>
                            <span>{formatRupee(advanceAmountNum)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
