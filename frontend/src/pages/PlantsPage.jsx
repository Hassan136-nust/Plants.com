import React, { useState } from 'react';
import { PLANTS_DATA, PlusSymbol } from '../data/constants';

export default function PlantsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [toast, setToast] = useState({ show: false, msg: '' });

    const triggerToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: '' }), 3500);
    };

    const filtered = activeTab === 'all' ? PLANTS_DATA : PLANTS_DATA.filter(p => p.category === activeTab);

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
                                        <button className="plant-card-btn" onClick={() => triggerToast(`Added ${plant.name} to Cart`)}>
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
            <div className={`toast ${toast.show ? 'show' : ''}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {toast.msg}
            </div>
        </>
    );
}
