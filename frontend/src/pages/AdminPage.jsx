import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const API = `${API_URL}/api`;
const HOST = API_URL;

const resolveImageSrc = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${HOST}${url}`;
    return `${HOST}/uploads/plants/${url}`;
};

export default function AdminPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    const [orders, setOrders] = useState([]);
    const [plants, setPlants] = useState([]);

    const [newPlant, setNewPlant] = useState({ name: '', scientificName: '', price: '', category: '', isCarousel: false });
    const [plantFile, setPlantFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = React.useRef(null);
    const [updatingPlantId, setUpdatingPlantId] = useState(null);
    // Map of plantId -> draft price being edited
    const [editingPrices, setEditingPrices] = useState({});

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate('/');
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (err) { console.error(err); }
    };

    const fetchPlants = async () => {
        try {
            const res = await fetch(`${API_URL}/api/plants`);
            const data = await res.json();
            if (res.ok) setPlants(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            if (activeTab === 'orders') fetchOrders();
            if (activeTab === 'plants') fetchPlants();
        }
    }, [activeTab, user, token]);

    const handleConfirmOrder = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: 'confirmed' })
            });
            if (res.ok) fetchOrders();
        } catch (err) { console.error(err); }
    };

    const handleAddPlant = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!plantFile) return setError('Image file is required');
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('name', newPlant.name);
            formData.append('scientificName', newPlant.scientificName);
            formData.append('price', newPlant.price);
            formData.append('category', newPlant.category);
            formData.append('isCarousel', newPlant.isCarousel);
            formData.append('image', plantFile);

            const res = await fetch(`${API_URL}/api/plants`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setNewPlant({ name: '', scientificName: '', price: '', category: '', isCarousel: false });
                setPlantFile(null);
                setSuccess('Plant added successfully!');
                setTimeout(() => setSuccess(''), 3000);
                fetchPlants();
            } else {
                setError(data.message || 'Error adding plant');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdatePic = async (e) => {
        const file = e.target.files[0];
        if (!file || !updatingPlantId) return;
        setError(''); setSuccess('');
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_URL}/api/plants/${updatingPlantId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setPlants(plants.map(p => p._id === updatingPlantId ? { ...p, imageUrl: data.imageUrl } : p));
            setSuccess('Picture updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingPlantId(null);
            e.target.value = null;
        }
    };

    const triggerFileInput = (id) => {
        setUpdatingPlantId(id);
        fileInputRef.current.click();
    };

    const handleSavePrice = async (id) => {
        const newPrice = editingPrices[id];
        if (!newPrice || !newPrice.trim()) return;
        setError(''); setSuccess('');
        try {
            const formData = new FormData();
            formData.append('price', newPrice.trim());
            const res = await fetch(`${API}/plants/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setPlants(plants.map(p => p._id === id ? { ...p, price: data.price } : p));
            setEditingPrices(prev => { const n = { ...prev }; delete n[id]; return n; });
            setSuccess('Price updated for all users!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError(err.message); }
    };

    const handleDeletePlant = async (id) => {
        if (!window.confirm('Delete this plant?')) return;
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
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 className="section-title">Admin Dashboard</h2>

            {(error || success) && (
                <div style={{
                    padding: '12px 20px', borderRadius: '10px', marginBottom: '20px',
                    background: error ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
                    border: `1px solid ${error ? '#ef4444' : '#4ade80'}`,
                    color: error ? '#ef4444' : '#4ade80'
                }}>
                    {error || success}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button onClick={() => setActiveTab('orders')} style={{ background: activeTab === 'orders' ? '#4ade80' : 'rgba(255,255,255,0.1)', color: activeTab === 'orders' ? '#000' : '#fff', border: 'none', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Manage Orders
                </button>
                <button onClick={() => setActiveTab('plants')} style={{ background: activeTab === 'plants' ? '#4ade80' : 'rgba(255,255,255,0.1)', color: activeTab === 'plants' ? '#000' : '#fff', border: 'none', padding: '12px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
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
                                            <a href={`${HOST}${order.receiptUrl}`} target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none' }}>
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
                    {/* Upload New Plant */}
                    <div style={{ flex: '1 1 400px', background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: '#fff', marginBottom: '20px' }}>Upload New Plant</h3>
                        <form onSubmit={handleAddPlant} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input className="contact-input" placeholder="Display Name (e.g. Snake Plant)" required value={newPlant.name} onChange={e => setNewPlant({ ...newPlant, name: e.target.value })} />
                            <input className="contact-input" placeholder="Scientific Name" required value={newPlant.scientificName} onChange={e => setNewPlant({ ...newPlant, scientificName: e.target.value })} />
                            <input className="contact-input" placeholder="Price (e.g. Rs. 2500)" required value={newPlant.price} onChange={e => setNewPlant({ ...newPlant, price: e.target.value })} />
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

                            <button type="submit" disabled={uploading} style={{ background: uploading ? '#2d7a4f' : '#4ade80', color: '#000', border: 'none', padding: '12px', borderRadius: '50px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer', marginTop: '16px', opacity: uploading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {uploading ? (
                                    <>
                                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                        Uploading...
                                    </>
                                ) : 'Upload to Database'}
                            </button>
                        </form>
                    </div>

                    {/* Current Inventory */}
                    <div style={{ flex: '1 1 500px', background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: '#fff', marginBottom: '20px' }}>Current Inventory</h3>

                        {/* Hidden file input for per-plant pic updates */}
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleUpdatePic} />

                        <input
                            type="text"
                            placeholder="🔍 Search inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 16px', width: '100%', marginBottom: '16px',
                                borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', boxSizing: 'border-box'
                            }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
                            {plants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <img
                                            src={resolveImageSrc(p.imageUrl)}
                                            alt={p.name}
                                            loading="lazy"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                try { const parts = e.target.src.split('/'); const f = parts[parts.length - 1]; e.target.src = `${HOST}/uploads/plants/${f}`; } catch { e.target.style.display = 'none'; }
                                            }}
                                        />
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{p.name}</div>
                                            <div style={{ color: '#a0a0a0', fontSize: '12px' }}>{p.category}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                <input
                                                    type="text"
                                                    value={editingPrices[p._id] !== undefined ? editingPrices[p._id] : p.price}
                                                    onChange={(e) => setEditingPrices(prev => ({ ...prev, [p._id]: e.target.value }))}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                                                        color: '#f8db7d', borderRadius: '6px', padding: '3px 8px',
                                                        width: '110px', fontSize: '13px', outline: 'none'
                                                    }}
                                                />
                                                {editingPrices[p._id] !== undefined && editingPrices[p._id] !== p.price && (
                                                    <button
                                                        onClick={() => handleSavePrice(p._id)}
                                                        style={{ background: '#f8db7d', color: '#000', border: 'none', padding: '3px 9px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                    >Save</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        <button onClick={() => triggerFileInput(p._id)} style={{ background: 'transparent', color: '#4ade80', border: '1px solid #4ade80', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Change Pic</button>
                                        <button onClick={() => handleDeletePlant(p._id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
