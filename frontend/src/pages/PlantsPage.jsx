import React, { useState } from 'react';
import { PLANTS_DATA, PlusSymbol } from '../data/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function PlantsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [toast, setToast] = useState({ show: false, msg: '', success: true });
    const { user } = useAuth();
    const { addToCart } = useCart();

    const filtered = activeTab === 'all' ? PLANTS_DATA : PLANTS_DATA.filter(p => p.category === activeTab);

    const showToast = (msg, success = true) => {
        setToast({ show: true, msg, success });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
    };

    const handleAddToCart = (plant) => {
        addToCart(plant);
        showToast(`✅ ${plant.name} added to cart!`);
    };

    return (
        <>
            {/* PAGE HERO */}
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

            {/* CATALOGUE */}
            <section className="plants" style={{ paddingTop: '20px' }}>
                <div className="container">
                    <div className="plant-filters">
                        {['all', 'tropical', 'succulents', 'flowering', 'indoor'].map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)} Plants
                            </button>
                        ))}
                    </div>

                    <div className="plant-grid">
                        {filtered.map((plant) => (
                            <div key={plant.id} className="plant-card">
                                <div className="plant-card-visual">
                                    <span className="plant-card-tag">{plant.tag}</span>
                                    {plant.iconComp}
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
                                        >
                                            <PlusSymbol />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TOAST */}
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
