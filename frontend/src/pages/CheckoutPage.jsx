import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
    const { cart, subtotal, itemsCount, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: '', zipCode: ''
    });
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const advanceAmount = (subtotal * 0.70).toFixed(2);
    const deliveryAmount = (subtotal * 0.30).toFixed(2);

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
            const uploadRes = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

            // 2. Place Order
            const orderRes = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart,
                    ...form,
                    receiptUrl: uploadData.url,
                    advancePaid: true
                })
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.message || 'Order failed');

            // Success!
            clearCart();
            alert('Order placed successfully! We will verify your receipt shortly.');
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
                <h2 style={{ color: '#fff' }}>Your cart is empty.</h2>
                <button
                    onClick={() => navigate('/plants')}
                    style={{ background: '#4ade80', padding: '12px 24px', borderRadius: '50px', marginTop: '20px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
                >
                    Return to Shop
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
                                Please pay <strong style={{ color: '#f8db7d' }}>70% advance (Rs. {advanceAmount})</strong> to confirm your order.
                                The remaining 30% (Rs. {deliveryAmount}) will be collected on delivery.
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
                            style={{ background: '#4ade80', color: '#000', border: 'none', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer', marginTop: '16px' }}
                        >
                            {loading ? 'Processing Order...' : 'Confirm Order'}
                        </button>
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
                                <span style={{ color: '#f8db7d' }}>Rs. {(parseFloat(item.plant.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                            <span style={{ opacity: 0.6 }}>Subtotal ({itemsCount} items)</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                            <span style={{ opacity: 0.6 }}>Shipping</span>
                            <span style={{ color: '#4ade80' }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '20px', fontWeight: 'bold', marginTop: '12px' }}>
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontSize: '16px', fontWeight: 'bold', marginTop: '12px' }}>
                            <span>70% Advance Payable</span>
                            <span>${advanceAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
