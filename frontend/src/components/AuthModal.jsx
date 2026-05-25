import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function AuthModal({ onClose, onSuccess, actionLabel = 'continue' }) {
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
        const body = tab === 'login'
            ? { email: form.email, password: form.password }
            : { name: form.name, email: form.email, password: form.password };

        try {
            const res = await fetch(`${API}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong.');
            login(data.user, data.token);
            onSuccess && onSuccess(data.user, data.token);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        /* Backdrop */
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
            }}
        >
            {/* Modal card */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '440px',
                    background: 'linear-gradient(145deg, #0f3322 0%, #081d14 100%)',
                    border: '1px solid rgba(210,231,203,0.25)',
                    borderRadius: '24px', padding: '44px 40px',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(74,222,128,0.1)',
                    position: 'relative',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
                        cursor: 'pointer', fontSize: '18px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}
                >×</button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '52px', height: '52px', margin: '0 auto 16px',
                        borderRadius: '50%', background: 'rgba(74,222,128,0.15)',
                        border: '1px solid rgba(74,222,128,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 22 2c0 5-1 7.5-6.1 11.8A7 7 0 0 1 11 20z" />
                            <path d="M9 22a5 5 0 0 1-5-5c0-4.25 3.75-6 8-8" />
                        </svg>
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)', fontSize: '26px',
                        color: '#ffffff', fontWeight: '700', marginBottom: '6px',
                    }}>
                        {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                        {tab === 'login'
                            ? `Sign in to ${actionLabel}`
                            : `Join Zia Nursery to ${actionLabel}`}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', background: 'rgba(0,0,0,0.3)',
                    borderRadius: '50px', padding: '4px', marginBottom: '28px',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}>
                    {['login', 'register'].map(t => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setError(''); }}
                            style={{
                                flex: 1, padding: '10px', borderRadius: '50px', border: 'none',
                                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                                fontSize: '13px', fontWeight: '700',
                                textTransform: 'capitalize', letterSpacing: '0.5px',
                                transition: 'all 0.25s ease',
                                background: tab === t ? '#4ade80' : 'transparent',
                                color: tab === t ? '#081d14' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            {t === 'login' ? 'Sign In' : 'Register'}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {tab === 'register' && (
                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: '700', color: 'rgba(210,231,203,0.8)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Full Name</label>
                            <input
                                name="name" type="text" placeholder="Your name"
                                value={form.name} onChange={handleChange} required
                                style={{
                                    width: '100%', padding: '14px 18px', borderRadius: '12px',
                                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(210,231,203,0.2)',
                                    color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '15px',
                                    outline: 'none', boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#4ade80'}
                                onBlur={e => e.target.style.borderColor = 'rgba(210,231,203,0.2)'}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: '700', color: 'rgba(210,231,203,0.8)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Email Address</label>
                        <input
                            name="email" type="email" placeholder="your@email.com"
                            value={form.email} onChange={handleChange} required
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: '12px',
                                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(210,231,203,0.2)',
                                color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '15px',
                                outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#4ade80'}
                            onBlur={e => e.target.style.borderColor = 'rgba(210,231,203,0.2)'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: '700', color: 'rgba(210,231,203,0.8)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Password</label>
                        <input
                            name="password" type="password" placeholder={tab === 'register' ? 'Minimum 6 characters' : 'Your password'}
                            value={form.password} onChange={handleChange} required
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: '12px',
                                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(210,231,203,0.2)',
                                color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '15px',
                                outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#4ade80'}
                            onBlur={e => e.target.style.borderColor = 'rgba(210,231,203,0.2)'}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                            borderRadius: '10px', padding: '12px 16px',
                            fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: '#fca5a5',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '15px', borderRadius: '50px',
                            background: loading ? 'rgba(74,222,128,0.4)' : '#4ade80',
                            border: 'none', color: '#081d14',
                            fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '14px',
                            letterSpacing: '0.5px', cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '4px', transition: 'all 0.25s ease',
                            boxShadow: loading ? 'none' : '0 8px 24px rgba(74,222,128,0.3)',
                        }}
                    >
                        {loading ? 'Please wait…' : (tab === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                {/* Toggle tab */}
                <p style={{
                    textAlign: 'center', marginTop: '24px',
                    fontFamily: 'var(--font-sans)', fontSize: '13.5px',
                    color: 'rgba(255,255,255,0.45)',
                }}>
                    {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
                        style={{ color: '#4ade80', cursor: 'pointer', fontWeight: '700' }}
                    >
                        {tab === 'login' ? 'Register' : 'Sign In'}
                    </span>
                </p>
            </div>
        </div>
    );
}
