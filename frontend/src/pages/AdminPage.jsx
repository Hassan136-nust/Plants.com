import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

export default function AdminPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'plants'

    const [orders, setOrders] = useState([]);
    const [plants, setPlants] = useState([]);

    const [newPlant, setNewPlant] = useState({ name: '', scientificName: '', price: '', category: '', isCarousel: false });
    const [plantFile, setPlantFile] = useState(null);

    // Protection mapping
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (err) { console.error('Error fetching orders:', err); }
    };

    const fetchPlants = async () => {
        try {
            const res = await fetch(`${API}/plants`);
            const data = await res.json();
            if (res.ok) setPlants(data);
        } catch (err) { console.error('Error fetching plants:', err); }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            if (activeTab === 'orders') fetchOrders();
            if (activeTab === 'plants') fetchPlants();
        }
    }, [activeTab, user, token]);

    const handleConfirmOrder = async (id) => {
        try {
            const res = await fetch(`${API}/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'confirmed' })
            });
            if (res.ok) fetchOrders();
        } catch (err) { console.error(err); }
    };

    const handleAddPlant = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newPlant.name);
            formData.append('scientificName', newPlant.scientificName);
            formData.append('price', newPlant.price);
            formData.append('category', newPlant.category);
            formData.append('isCarousel', newPlant.isCarousel);
            if (plantFile) {
                formData.append('image', plantFile);
            } else {
                return alert('Image file is strictly required');
            }

            const res = await fetch(`${API}/plants`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                setNewPlant({ name: '', scientificName: '', price: '', category: '', isCarousel: false });
                setPlantFile(null);
                fetchPlants();
            } else {
                const data = await res.json();
                alert(data.message || 'Error adding plant');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePlant = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await fetch(`${API}/plants/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchPlants();
        } catch (err) { console.error(err); }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <section className="container" style={{ padding: '120px 20px', minHeight: '80vh' }}>
            <h2 className="section-title">Admin Dashboard</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{ background: activeTab === 'orders' ? '#4ade80' : 'rgba(255,255,255,0.1)', color: activeTab === 'orders' ? '#000' : '#fff', border: 'none', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Manage Orders
                </button>
                <button
                    onClick={() => setActiveTab('plants')}
                    style={{ background: activeTab === 'plants' ? '#4ade80' : 'rgba(255,255,255,0.1)', color: activeTab === 'plants' ? '#000' : '#fff', border: 'none', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Manage Plants (CMS)
                </button>
            </div>

            {activeTab === 'orders' && (
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>Recent Customer Orders</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Customer</th>
                                    <th style={{ padding: '12px' }}>Delivery Details</th>
                                    <th style={{ padding: '12px' }}>Amount</th>
                                    <th style={{ padding: '12px' }}>Receipt</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '20px 12px' }}>
                                            <strong>{order.user?.name || 'Unknown'}</strong><br />
                                            <span style={{ fontSize: '12px', opacity: 0.6 }}>{order.user?.email || ''}</span>
                                        </td>
                                        <td style={{ padding: '20px 12px', fontSize: '14px', opacity: 0.8 }}>
                                            {order.address}, {order.city} {order.zipCode}<br />
                                            Phone: {order.phone}
                                        </td>
                                        <td style={{ padding: '20px 12px', color: '#f8db7d' }}>Rs. {order.totalAmount}</td>
                                        <td style={{ padding: '20px 12px' }}>
                                            <a href={`http://localhost:5000${order.receiptUrl}`} target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none' }}>
                                                View Pic
                                            </a>
                                        </td>
                                        <td style={{ padding: '20px 12px' }}>
                                            {order.status === 'pending' ? (
                                                <button onClick={() => handleConfirmOrder(order._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                                                    Confirm Order
                                                </button>
                                            ) : (
                                                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Confirmed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'plants' && (
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px', background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: '#fff', marginBottom: '20px' }}>Upload New Plant</h3>
                        <form onSubmit={handleAddPlant} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input className="contact-input" placeholder="Display Name (e.g. Snake Plant)" required value={newPlant.name} onChange={e => setNewPlant({ ...newPlant, name: e.target.value })} />
                            <input className="contact-input" placeholder="Scientific Name" required value={newPlant.scientificName} onChange={e => setNewPlant({ ...newPlant, scientificName: e.target.value })} />
                            <input className="contact-input" placeholder="Price (e.g. Rs. 30.00)" required value={newPlant.price} onChange={e => setNewPlant({ ...newPlant, price: e.target.value })} />
                            <input className="contact-input" placeholder="Category (e.g. Indoor)" required value={newPlant.category} onChange={e => setNewPlant({ ...newPlant, category: e.target.value })} list="category-options" />
                            <datalist id="category-options">
                                <option value="Indoor" />
                                <option value="Low Light" />
                                <option value="Flowering" />
                                <option value="Succulent" />
                                <option value="Tree" />
                                <option value="Hanging" />
                                <option value="Vine" />
                                <option value="Outdoor" />
                            </datalist>

                            <label style={{ color: '#fff', fontSize: '14px', marginTop: '8px' }}>
                                <input type="checkbox" checked={newPlant.isCarousel} onChange={e => setNewPlant({ ...newPlant, isCarousel: e.target.checked })} style={{ marginRight: '8px' }} />
                                Feature in 3D Carousel
                            </label>

                            <input type="file" accept="image/*" onChange={e => setPlantFile(e.target.files[0])} style={{ color: '#fff' }} required />

                            <button type="submit" style={{ background: '#4ade80', color: '#000', border: 'none', padding: '12px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' }}>
                                Upload to Database
                            </button>
                        </form>
                    </div>

                    <div style={{ flex: '1 1 500px', background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: '#fff', marginBottom: '20px' }}>Current Inventory</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {plants.map(p => (
                                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <img src={`http://localhost:5000${p.imageUrl}`} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => e.target.src = p.imageUrl} />
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: 'bold' }}>{p.name}</div>
                                            <div style={{ color: '#f8db7d', fontSize: '14px' }}>{p.price}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeletePlant(p._id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
