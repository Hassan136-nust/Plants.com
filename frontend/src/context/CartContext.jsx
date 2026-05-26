import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { parsePrice } from '../utils/price';
import { API_URL } from '../config';

const CartContext = createContext(null);

const GUEST_KEY = 'zn_cart_guest';
const userKey = (id) => `zn_cart_${id}`;

const dedupe = (arr) => {
    const map = new Map();
    arr.forEach(it => {
        const id = String(it.id || it._id || 'unknown');
        if (!map.has(id)) map.set(id, { ...it, id, quantity: Number(it.quantity) || 1 });
        else map.set(id, { ...map.get(id), quantity: Math.max(map.get(id).quantity, Number(it.quantity) || 1) });
    });
    return Array.from(map.values());
};

// Patch cart items with fresh plant data from DB
const patchPrices = (cartItems, plantsById, plantsByName) => {
    return cartItems.map(item => {
        const fresh =
            plantsById.get(String(item.id)) ||
            plantsByName.get((item.plant?.name || '').toLowerCase().trim());
        if (!fresh) return item;
        return {
            ...item,
            id: String(fresh._id),          // heal stale id
            plant: { ...item.plant, ...fresh } // overwrite with fresh data incl. price
        };
    });
};

export function CartProvider({ children }) {
    const { user, token } = useAuth();
    const KEY = user ? userKey(user.id) : GUEST_KEY;

    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
        catch { return []; }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const skipSyncRef = useRef(false);

    // ── 1. Fetch fresh plant catalogue and patch cart prices immediately ───────
    useEffect(() => {
        fetch(`${API_URL}/api/plants`)
            .then(r => r.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) return;
                const byId   = new Map(data.map(p => [String(p._id), p]));
                const byName = new Map(data.map(p => [p.name.toLowerCase().trim(), p]));
                setCart(prev => {
                    const patched = patchPrices(prev, byId, byName);
                    // only update if something actually changed
                    const changed = patched.some((p, i) =>
                        p.plant?.price !== prev[i]?.plant?.price || p.id !== prev[i]?.id
                    );
                    if (!changed) return prev;
                    skipSyncRef.current = true; // don't re-sync to DB just for price patch
                    try { localStorage.setItem(KEY, JSON.stringify(patched)); } catch {}
                    return patched;
                });
            })
            .catch(() => {});
    }, [KEY]);

    // ── 2. Load / merge cart on login ─────────────────────────────────────────
    useEffect(() => {
        if (!user || !token) {
            try {
                const stored = localStorage.getItem(GUEST_KEY);
                if (stored) setCart(JSON.parse(stored));
            } catch {}
            return;
        }

        const load = async () => {
            try {
                const res  = await fetch(`${API_URL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                const serverCart = (data.cart || []).map(it => ({
                    ...it, id: String(it.id || it._id), quantity: Math.min(Number(it.quantity) || 1, 20)
                }));

                const guestRaw  = localStorage.getItem(GUEST_KEY);
                const guestCart = guestRaw ? JSON.parse(guestRaw) : [];
                const serverIds = new Set(serverCart.map(it => String(it.id)));
                const newGuest  = guestCart
                    .filter(it => !serverIds.has(String(it.id || it.plant?._id)))
                    .map(it => ({ ...it, quantity: Math.min(Number(it.quantity) || 1, 20) }));

                const merged = dedupe([...serverCart, ...newGuest]);
                skipSyncRef.current = true;
                setCart(merged);
                localStorage.setItem(userKey(user.id), JSON.stringify(merged));
                localStorage.removeItem(GUEST_KEY);

                fetch(`${API_URL}/api/cart`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ cart: merged })
                }).catch(() => {});
            } catch (err) { console.error('Cart load error:', err); }
        };
        load();
    }, [user, token]);

    // ── 3. Persist cart changes to localStorage + DB ──────────────────────────
    useEffect(() => {
        if (skipSyncRef.current) { skipSyncRef.current = false; return; }
        try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
        if (user && token) {
            fetch(`${API_URL}/api/cart`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ cart })
            }).catch(() => {});
        }
    }, [cart]);

    // ── Cart actions ──────────────────────────────────────────────────────────
    const addToCart = (plant) => {
        const id = String(plant.id || plant._id);
        setCart(prev => {
            const existing = prev.find(item => item.id === id);
            if (existing) return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { id, plant, quantity: 1 }];
        });
    };

    const removeFromCart  = (id) => setCart(prev => prev.filter(item => item.id !== id));
    const updateQuantity  = (id, amount) => setCart(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
    const clearCart = () => setCart([]);

    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal   = cart.reduce((acc, item) => acc + parsePrice(item.plant?.price) * (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            itemsCount, subtotal, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
