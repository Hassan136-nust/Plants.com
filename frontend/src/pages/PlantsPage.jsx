import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function PlantsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: '', success: true });
    const { user } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`${API_URL}/api/plants`)
            .then(r => r.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('Unexpected response from /api/plants:', data);
                    setLoading(false);
                    return;
                }
                const normalized = data.map(p => {
                    let url = p.imageUrl || '';
                    try {
                        // if full http but wrong port (built/bundled value), rewrite to current API port
                        if (url.startsWith('http')) {
                            url = url.replace(':5000', ':5001');
                        } else if (url.startsWith('/')) {
                            url = `${API}${url}`;
                        } else if (url && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg') || url.endsWith('.webp'))) {
                            // bare filename
                            if (!url.includes('/uploads/')) url = `${API}/uploads/plants/${url}`;
                        }
                    } catch (err) { /* ignore */ }
                    if (url !== p.imageUrl) console.warn('Normalized imageUrl for', p.name, '->', url);
                    return { ...p, imageUrl: url };
                });
                setPlants(normalized); setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const categories = ['All', ...new Set(plants.map(p => p.category))];
    let filtered = activeTab === 'All' ? plants : plants.filter(p => p.category === activeTab);
    if (searchQuery.trim()) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.scientificName && p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    const showToast = (msg, success = true) => {
        setToast({ show: true, msg, success });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
    };

    const handleAddToCart = (plant) => {
        addToCart({ id: plant._id, name: plant.name, price: plant.price, imageUrl: plant.imageUrl, scientificName: plant.scientificName });
        showToast(`✅ ${plant.name} added to cart!`);
    };

    return (
        <>
            <section style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center' }}>
                <div className="container">
                    <div className="section-eyebrow">Our Collection</div>
                    <h1 className="section-title" style={{ marginBottom: '16px' }}>Browse Our <em>Plants</em></h1>
                    <p className="section-desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
                        Hand-picked rarities and beloved classics — from tropical giants to delicate succulents.
                    </p>
                    {user && (
                        <p style={{ marginTop: '14px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#4ade80' }}>
                            Welcome back, <strong>{user.name}</strong> 🌿
                        </p>
                    )}
                </div>
            </section>

            <section className="plants" style={{ paddingTop: '20px' }}>
                <div className="container">
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                        <input
                            type="text"
                            placeholder="🔍 Search for plants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '12px 20px', width: '100%', maxWidth: '400px',
                                borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'
                            }}
                        />
                    </div>
                    <div className="plant-filters">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#fff', padding: '80px' }}>Loading plants...</div>
                    ) : (
                        <div className="plant-grid">
                            {filtered.map((plant) => (
                                <div key={plant._id} className="plant-card">
                                    <div className="plant-card-visual" style={{ padding: 0, overflow: 'hidden' }}>
                                        <img
                                            src={plant.imageUrl && plant.imageUrl.startsWith('/') ? `${API}${plant.imageUrl}` : (plant.imageUrl || '')}
                                            alt={plant.name}
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#0b2b1a' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                console.warn('Image load failed, attempting fallback for', e.target.src);
                                                try {
                                                    const parts = (plant.imageUrl || e.target.src || '').split('/');
                                                    const file = parts[parts.length - 1];
                                                    if (file) {
                                                        const fallback = `${API}/uploads/plants/${file}`;
                                                        if (e.target.src !== fallback) {
                                                            e.target.src = fallback;
                                                            return;
                                                        }
                                                    }
                                                } catch (err) { /* ignore */ }

                                                // final inline SVG placeholder so the card isn't empty
                                                const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='420'><rect width='100%' height='100%' fill='#0b2b1a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#7fd08a' font-family='sans-serif' font-size='24'>Image unavailable</text></svg>`);
                                                e.target.src = `data:image/svg+xml;charset=utf-8,${svg}`;
                                            }}
                                        />
                                    </div>
                                    <div className="plant-card-info">
                                        <span className="plant-card-cat">{plant.category}</span>
                                        <h3 className="plant-card-title">{plant.name}</h3>
                                        <p className="plant-card-science">{plant.scientificName}</p>
                                        <div className="plant-card-bottom">
                                            <span className="plant-card-price">{plant.price}</span>
                                            <button
                                                className="plant-card-btn"
                                                title="Add to Cart"
                                                onClick={() => handleAddToCart(plant)}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <div className={`toast ${toast.show ? 'show' : ''}`} style={{
                background: toast.success
                    ? 'linear-gradient(135deg, var(--primary) 0%, #16402e 100%)'
                    : 'linear-gradient(135deg, #3b1414 0%, #1e0a0a 100%)',
                borderColor: toast.success ? 'var(--accent)' : 'rgba(239,68,68,0.4)',
            }}>
                {toast.msg}
            </div>
        </>
    );
}
