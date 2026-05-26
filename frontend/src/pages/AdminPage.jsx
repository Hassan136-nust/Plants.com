import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const HOST = API_URL;

const resolveImageSrc = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${HOST}${url}`;
    return `${HOST}/uploads/plants/${url}`;
};

// Parse price from any format: "Rs. 2500", 2500, "2500"
const parsePriceNum = (val) => {
    if (!val && val !== 0) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
};

const fmt = (n) => `Rs. ${Math.round(n).toLocaleString('en-PK')}`;

const STYLES = {
    card: { background: 'rgba(4,12,8,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px' },
    th: { padding: '12px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.3)' },
    td: { padding: '16px', color: '#fff', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'middle' },
    badge: (color) => ({ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: `${color}22`, color, border: `1px solid ${color}55` }),
    input: { background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '11px 14px', color: '#fff', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
    btn: (bg, color = '#000') => ({ background: bg, color, border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'opacity 0.2s' }),
};

export default function AdminPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [plants, setPlants] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [newPlant, setNewPlant] = useState({ name: '', scientificName: '', price: '', category: '', isCarousel: false });
    const [plantFile, setPlantFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = React.useRef(null);
    const [updatingPlantId, setUpdatingPlantId] = useState(null);
    const [editingPrices, setEditingPrices] = useState({});

    useEffect(() => { if (!user || user.role !== 'admin') navigate('/'); }, [user, navigate]);

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
            if (res.ok && Array.isArray(data)) setPlants(data);
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
            Object.entries(newPlant).forEach(([k, v]) => formData.append(k, v));
            formData.append('image', plantFile);
            const res = await fetch(`${API_URL}/api/plants`, {
                method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setNewPlant({ name: '', scientificName: '', price: '', category: '', isCarousel: false });
                setPlantFile(null);
                setSuccess('Plant added successfully!');
                setTimeout(() => setSuccess(''), 3000);
                fetchPlants();
            } else { setError(data.message || 'Error adding plant'); }
        } catch (err) { setError(err.message); }
        finally { setUploading(false); }
    };

    const handleUpdatePic = async (e) => {
        const file = e.target.files[0];
        if (!file || !updatingPlantId) return;
        setError(''); setSuccess('');
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_URL}/api/plants/${updatingPlantId}`, {
                method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setPlants(plants.map(p => p._id === updatingPlantId ? { ...p, imageUrl: data.imageUrl } : p));
            setSuccess('Picture updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError(err.message); }
        finally { setUpdatingPlantId(null); e.target.value = null; }
    };

    const handleSavePrice = async (id) => {
        const newPrice = editingPrices[id];
        if (!newPrice?.trim()) return;
        setError(''); setSuccess('');
        try {
            const formData = new FormData();
            formData.append('price', newPrice.trim());
            const res = await fetch(`${API_URL}/api/plants/${id}`, {
                method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setPlants(plants.map(p => p._id === id ? { ...p, price: data.price } : p));
            setEditingPrices(prev => { const n = { ...prev }; delete n[id]; return n; });
            setSuccess('Price updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError(err.message); }
    };

    const handleDeletePlant = async (id) => {
        if (!window.confirm('Delete this plant?')) return;
        try {
            const res = await fetch(`${API_URL}/api/plants/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchPlants();
        } catch (err) { console.error(err); }
    };

    if (!user || user.role !== 'admin') return null;

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + (o.totalAmount || 0), 0);

    return (
        <section style={{ padding: '100px 24px 60px', minHeight: '100vh' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .admin-tab { padding: 10px 22px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .admin-tab.active { background: #4ade80; color: #000; border-color: #4ade80; }
                .admin-tab:hover:not(.active) { background: rgba(255,255,255,0.06); color: #fff; }
                .inv-row:hover { background: rgba(255,255,255,0.04) !important; }
                .order-row:hover td { background: rgba(255,255,255,0.02); }
                .contact-input { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 10px !important; padding: 11px 14px !important; color: #fff !important; font-size: 14px !important; outline: none !important; width: 100% !important; box-sizing: border-box !important; }
                .contact-input:focus { border-color: rgba(74,222,128,0.4) !important; }
            `}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--font-serif)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Admin Dashboard</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Zia Nursery — Management Panel</p>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Orders', value: orders.length, color: '#60a5fa' },
                        { label: 'Pending', value: pendingCount, color: '#f59e0b' },
                        { label: 'Confirmed Revenue', value: fmt(totalRevenue), color: '#4ade80' },
                    ].map(s => (
                        <div key={s.label} style={{ flex: '1 1 160px', background: 'rgba(4,12,8,0.75)', backdropFilter: 'blur(12px)', border: `1px solid ${s.color}33`, borderRadius: '14px', padding: '20px 24px' }}>
                            <div style={{ color: s.color, fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{s.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                    <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        📋 Orders {pendingCount > 0 && <span style={{ background: '#f59e0b', color: '#000', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', marginLeft: '6px' }}>{pendingCount}</span>}
                    </button>
                    <button className={`admin-tab ${activeTab === 'plants' ? 'active' : ''}`} onClick={() => setActiveTab('plants')}>
                        🌿 Manage Plants
                    </button>
                </div>

                {/* Alert */}
                {(error || success) && (
                    <div style={{ padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)', border: `1px solid ${error ? '#ef444466' : '#4ade8066'}`, color: error ? '#fca5a5' : '#86efac', fontSize: '14px' }}>
                        {error || success}
                    </div>
                )}

                {/* ── ORDERS TAB ── */}
                {activeTab === 'orders' && (
                    <div style={STYLES.card}>
                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Recent Orders</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={STYLES.th}>Customer</th>
                                        <th style={STYLES.th}>Address</th>
                                        <th style={STYLES.th}>Total</th>
                                        <th style={STYLES.th}>Receipt</th>
                                        <th style={STYLES.th}>Status</th>
                                        <th style={STYLES.th}>Date</th>
                                        <th style={STYLES.th}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => {
                                        const isExpanded = expandedOrder === order._id;
                                        // Always recalculate from price strings — never trust stored totalAmount from old orders
                                        const calcTotal = (() => {
                                            if (!order.items?.length) return order.totalAmount || 0;
                                            const sum = order.items.reduce((s, it) => {
                                                // priceNum is set on new orders; fall back to parsing price string
                                                const p = (it.priceNum && it.priceNum > 0)
                                                    ? it.priceNum
                                                    : parsePriceNum(it.price);
                                                return s + p * (it.quantity || 1);
                                            }, 0);
                                            // If sum is still 0 (very old orders with bad data), use stored totalAmount
                                            return sum > 0 ? sum : (order.totalAmount || 0);
                                        })();

                                        return (
                                            <React.Fragment key={order._id}>
                                                <tr className="order-row">
                                                    <td style={STYLES.td}>
                                                        <div style={{ fontWeight: '600' }}>{order.user?.name || 'Unknown'}</div>
                                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' }}>{order.user?.email}</div>
                                                    </td>
                                                    <td style={{ ...STYLES.td, fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                                                        {order.city}<br />
                                                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{order.phone}</span>
                                                    </td>
                                                    <td style={STYLES.td}>
                                                        <span style={{ color: '#f8db7d', fontWeight: '700', fontSize: '15px' }}>{fmt(calcTotal)}</span>
                                                    </td>
                                                    <td style={STYLES.td}>
                                                        <a href={order.receiptUrl?.startsWith('http') ? order.receiptUrl : `${HOST}${order.receiptUrl}`}
                                                            target="_blank" rel="noreferrer"
                                                            style={{ color: '#4ade80', fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(74,222,128,0.3)', padding: '4px 10px', borderRadius: '6px' }}>
                                                            View
                                                        </a>
                                                    </td>
                                                    <td style={STYLES.td}>
                                                        {order.status === 'pending'
                                                            ? <button onClick={() => handleConfirmOrder(order._id)} style={{ ...STYLES.btn('#ef4444', '#fff'), fontSize: '12px', padding: '6px 12px' }}>Confirm</button>
                                                            : <span style={STYLES.badge('#4ade80')}>✓ Confirmed</span>
                                                        }
                                                    </td>
                                                    <td style={{ ...STYLES.td, fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                                                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td style={STYLES.td}>
                                                        <button onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                            style={{ background: isExpanded ? 'rgba(167,139,250,0.15)' : 'transparent', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                                            {isExpanded ? '▲ Hide' : '▼ Details'}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={7} style={{ padding: '0 16px 20px', background: 'rgba(4,12,8,0.6)' }}>
                                                            <div style={{ border: '1px solid rgba(167,139,250,0.2)', borderRadius: '12px', padding: '24px', display: 'flex', gap: '40px', flexWrap: 'wrap', background: 'rgba(4,12,8,0.75)', backdropFilter: 'blur(12px)' }}>

                                                                {/* Items table */}
                                                                <div style={{ flex: '1 1 320px' }}>
                                                                    <div style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '14px' }}>🌿 Items Ordered</div>
                                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                        <thead>
                                                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                                                                <th style={{ ...STYLES.th, padding: '6px 8px 10px 0', borderBottom: 'none' }}>Plant</th>
                                                                                <th style={{ ...STYLES.th, padding: '6px 8px 10px', borderBottom: 'none', textAlign: 'center' }}>Qty</th>
                                                                                <th style={{ ...STYLES.th, padding: '6px 0 10px 8px', borderBottom: 'none', textAlign: 'right' }}>Unit Price</th>
                                                                                <th style={{ ...STYLES.th, padding: '6px 0 10px 8px', borderBottom: 'none', textAlign: 'right' }}>Subtotal</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {order.items?.map((item, i) => {
                                                                                const p = (item.priceNum && item.priceNum > 0)
                                                                                    ? item.priceNum
                                                                                    : parsePriceNum(item.price);
                                                                                const sub = p * (item.quantity || 1);
                                                                                return (
                                                                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                                                        <td style={{ padding: '9px 8px 9px 0', color: '#fff', fontSize: '14px' }}>{item.plantName}</td>
                                                                                        <td style={{ padding: '9px 8px', textAlign: 'center' }}>
                                                                                            <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '2px 10px', color: '#fff', fontSize: '13px' }}>{item.quantity}</span>
                                                                                        </td>
                                                                                        <td style={{ padding: '9px 0 9px 8px', color: '#f8db7d', fontSize: '13px', textAlign: 'right' }}>{fmt(p)}</td>
                                                                                        <td style={{ padding: '9px 0 9px 8px', color: '#f8db7d', fontSize: '14px', fontWeight: '700', textAlign: 'right' }}>{fmt(sub)}</td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                                                <td colSpan={3} style={{ padding: '10px 8px 4px 0', color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'right' }}>Total</td>
                                                                                <td style={{ padding: '10px 0 4px 8px', color: '#4ade80', fontSize: '16px', fontWeight: '800', textAlign: 'right' }}>{fmt(calcTotal)}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={3} style={{ padding: '3px 8px 3px 0', color: 'rgba(255,255,255,0.35)', fontSize: '12px', textAlign: 'right' }}>70% Advance Paid</td>
                                                                                <td style={{ padding: '3px 0 3px 8px', color: '#fbbf24', fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>{fmt(calcTotal * 0.7)}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={3} style={{ padding: '3px 8px 6px 0', color: 'rgba(255,255,255,0.35)', fontSize: '12px', textAlign: 'right' }}>30% On Delivery</td>
                                                                                <td style={{ padding: '3px 0 6px 8px', color: '#fbbf24', fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>{fmt(calcTotal * 0.3)}</td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>

                                                                {/* Delivery info */}
                                                                <div style={{ flex: '0 1 220px' }}>
                                                                    <div style={{ color: '#a78bfa', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '14px' }}>📦 Delivery Info</div>
                                                                    {[
                                                                        ['Name', order.user?.name],
                                                                        ['Email', order.user?.email],
                                                                        ['Phone', order.phone],
                                                                        ['Address', order.address],
                                                                        ['City', order.city],
                                                                        ['Zip', order.zipCode],
                                                                        ['Ordered', new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })],
                                                                    ].map(([label, val]) => (
                                                                        <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                                                                            <span style={{ color: 'rgba(255,255,255,0.35)', minWidth: '58px', flexShrink: 0 }}>{label}</span>
                                                                            <span style={{ color: '#fff' }}>{val || '—'}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {orders.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px', fontSize: '15px' }}>No orders yet.</div>}
                        </div>
                    </div>
                )}

                {/* ── PLANTS TAB ── */}
                {activeTab === 'plants' && (
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                        {/* Upload form */}
                        <div style={{ ...STYLES.card, flex: '0 1 380px' }}>
                            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>➕ Add New Plant</h3>
                            <form onSubmit={handleAddPlant} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input className="contact-input" placeholder="Display Name (e.g. Snake Plant)" required value={newPlant.name} onChange={e => setNewPlant({ ...newPlant, name: e.target.value })} />
                                <input className="contact-input" placeholder="Scientific Name" required value={newPlant.scientificName} onChange={e => setNewPlant({ ...newPlant, scientificName: e.target.value })} />
                                <input className="contact-input" placeholder="Price (e.g. Rs. 2500)" required value={newPlant.price} onChange={e => setNewPlant({ ...newPlant, price: e.target.value })} />
                                <input className="contact-input" placeholder="Category (e.g. Indoor)" required value={newPlant.category} onChange={e => setNewPlant({ ...newPlant, category: e.target.value })} list="cat-opts" />
                                <datalist id="cat-opts">
                                    {['Indoor','Low Light','Flowering','Succulent','Tree','Hanging','Vine','Outdoor'].map(c => <option key={c} value={c} />)}
                                </datalist>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={newPlant.isCarousel} onChange={e => setNewPlant({ ...newPlant, isCarousel: e.target.checked })} />
                                    Feature in 3D Carousel
                                </label>
                                <div style={{ border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                                    <input type="file" accept="image/*" required onChange={e => setPlantFile(e.target.files[0])} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', width: '100%' }} />
                                    {plantFile && <div style={{ color: '#4ade80', fontSize: '12px', marginTop: '6px' }}>✓ {plantFile.name}</div>}
                                </div>
                                <button type="submit" disabled={uploading} style={{ ...STYLES.btn(uploading ? '#1a5c38' : '#4ade80'), padding: '12px', borderRadius: '10px', fontSize: '14px', marginTop: '4px', opacity: uploading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {uploading && <span style={{ width: '15px', height: '15px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />}
                                    {uploading ? 'Uploading...' : 'Upload to Database'}
                                </button>
                            </form>
                        </div>

                        {/* Inventory */}
                        <div style={{ ...STYLES.card, flex: '1 1 500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>📦 Inventory ({plants.length})</h3>
                            </div>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleUpdatePic} />
                            <input type="text" placeholder="🔍 Search plants..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                style={{ ...STYLES.input, marginBottom: '14px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
                                {plants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                    <div key={p._id} className="inv-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '10px', transition: 'background 0.15s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                            <img src={resolveImageSrc(p.imageUrl)} alt={p.name} loading="lazy"
                                                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, background: '#0b2b1a' }}
                                                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '4px' }}>{p.category}{p.isCarousel ? ' · ⭐ Carousel' : ''}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <input type="text" value={editingPrices[p._id] !== undefined ? editingPrices[p._id] : p.price}
                                                        onChange={e => setEditingPrices(prev => ({ ...prev, [p._id]: e.target.value }))}
                                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8db7d', borderRadius: '6px', padding: '3px 8px', width: '110px', fontSize: '12px', outline: 'none' }} />
                                                    {editingPrices[p._id] !== undefined && editingPrices[p._id] !== p.price && (
                                                        <button onClick={() => handleSavePrice(p._id)} style={{ ...STYLES.btn('#f8db7d'), padding: '3px 9px', fontSize: '11px', borderRadius: '5px' }}>Save</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '10px' }}>
                                            <button onClick={() => { setUpdatingPlantId(p._id); fileInputRef.current.click(); }} style={{ ...STYLES.btn('transparent', '#4ade80'), border: '1px solid rgba(74,222,128,0.3)', padding: '5px 10px', fontSize: '12px', borderRadius: '6px' }}>Pic</button>
                                            <button onClick={() => handleDeletePlant(p._id)} style={{ ...STYLES.btn('transparent', '#f87171'), border: '1px solid rgba(248,113,113,0.3)', padding: '5px 10px', fontSize: '12px', borderRadius: '6px' }}>Del</button>
                                        </div>
                                    </div>
                                ))}
                                {plants.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px', fontSize: '14px' }}>No plants yet.</div>}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
