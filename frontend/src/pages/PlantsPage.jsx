import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

export default function PlantsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: '', success: true });
    const { user } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`${API}/api/plants`)
            .then(r => r.json())
            .then(data => { setPlants(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const categories = ['All', ...new Set(plants.map(p => p.category))];
    const filtered = activeTab === 'All' ? plants : plants.filter(p => p.category === activeTab);

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
                                            src={plant.imageUrl.startsWith('/') ? `${API}${plant.imageUrl}` : plant.imageUrl}
                                            alt={plant.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
