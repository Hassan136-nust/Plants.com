import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { parsePrice } from '../utils/price';
import { API_URL } from '../config';

const CartContext = createContext(null);

// Cart version - DO NOT change this anymore
const CART_VERSION = 10;

export function CartProvider({ children }) {
    const { user } = useAuth();

    // Keys: keep a stable guest key and a per-user key
    const GUEST_KEY = 'zn_cart_guest';
    const USER_KEY = user ? `zn_cart_${user.id}` : null;

    const [cart, setCart] = useState(() => {
        try {
            const key = USER_KEY || GUEST_KEY;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            return [];
        }
    });

    // UI state for the new drawer
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { token } = useAuth(); // for API auth
    const initializingRef = React.useRef(true);
    const initRunRef = React.useRef(0);

    const normalizeItem = (it) => {
        const incomingId = it.id || it._id || (it.plant && (it.plant._id || it.plant.id));
        return { ...it, id: incomingId ? String(incomingId) : String(incomingId) };
    };

    const dedupeCart = (arr) => {
        const map = new Map();
        arr.forEach(raw => {
            const it = normalizeItem(raw);
            const id = it.id || 'unknown';
            if (!map.has(id)) map.set(id, { ...it, quantity: Number(it.quantity) || 0 });
            else map.set(id, { ...map.get(id), quantity: (map.get(id).quantity || 0) + (Number(it.quantity) || 0) });
        });
        return Array.from(map.values());
    };

    // 1. Fetch DB Cart aggressively on Login (or load guest cart)
    // On login: fetch server cart, merge guest cart, and persist to user key
    useEffect(() => {
        const init = async () => {
            try {
                initializingRef.current = true;
                const runId = ++initRunRef.current;
                if (user && token) {
                    const res = await fetch(`${API_URL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
                    const data = await res.json();
                    const serverCart = data.cart || [];

                    // Merge guest cart into server cart (sum quantities)
                    const guestStore = localStorage.getItem(GUEST_KEY);
                    const guestCart = guestStore ? JSON.parse(guestStore) : [];

                    // Merge and dedupe deterministically
                    const merged = dedupeCart(serverCart.concat(guestCart));

                    // Normalize prices with latest product data
                    try {
                        const plantsRes = await fetch(`${API_URL}/api/plants`);
                        const plantsData = await plantsRes.json();
                        if (!Array.isArray(plantsData)) throw new Error('Invalid plants response');
                        const map = new Map(plantsData.map(p => [p._id, p]));
                        const norm = merged.map(item => {
                            const serverPlant = map.get(item.id) || item.plant || {};
                            return { ...item, plant: { ...serverPlant } };
                        });
                        // ensure this is still the latest init run
                        if (initRunRef.current === runId) {
                            setCart(dedupeCart(norm));
                            localStorage.setItem(USER_KEY, JSON.stringify(dedupeCart(norm)));
                        }
                    } catch (err) {
                        if (initRunRef.current === runId) {
                            setCart(merged);
                            localStorage.setItem(USER_KEY, JSON.stringify(merged));
                        }
                    }

                    // Sync merged cart to server
                    try {
                        await fetch(`${API_URL}/api/cart`, {
                            method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ cart: merged })
                        });
                    } catch (err) { /* ignore */ }
                    // Clear guest cart so repeated refreshes don't re-merge it
                    try { localStorage.removeItem(GUEST_KEY); } catch (e) { /* ignore */ }
                } else {
                    // No user: load guest cart and try to normalize prices from server data
                    const stored = localStorage.getItem(GUEST_KEY);
                    const guest = stored ? JSON.parse(stored) : [];
                    try {
                        const plantsRes = await fetch(`${API_URL}/api/plants`);
                        const plantsData = await plantsRes.json();
                        if (!Array.isArray(plantsData)) throw new Error('Invalid plants response');
                        const map = new Map(plantsData.map(p => [p._id, p]));
                        const norm = guest.map(item => {
                            const ni = normalizeItem(item);
                            const serverPlant = map.get(ni.id) || item.plant || {};
                            return { ...ni, plant: { ...serverPlant } };
                        });
                        const deduped = dedupeCart(norm);
                        if (initRunRef.current === runId) setCart(deduped);
                    } catch (err) {
                        if (initRunRef.current === runId) setCart(dedupeCart(guest));
                    }
                }
            } catch (err) {
                console.error('Failed to initialize cart:', err);
            }
            finally {
                // initialization finished
                initializingRef.current = false;
            }
        };
        init();
    }, [user, token]);

    // 2. Sync to DB & LocalStorage on change
    useEffect(() => {
        // skip syncing while initializing to avoid race conditions
        if (initializingRef.current) return;

        try {
            const key = USER_KEY || GUEST_KEY;
            localStorage.setItem(key, JSON.stringify(cart));
        } catch (err) { /* ignore */ }

        if (user && token) {
            fetch(`${API_URL}/api/cart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ cart })
            }).catch(err => console.error('Failed to sync cart:', err));
        }
    }, [cart, USER_KEY, user, token]);

    const addToCart = (plant) => {
        setCart(prev => {
            const incomingId = plant.id || plant._id || (plant.plant && plant.plant._id) || (plant.plant && plant.plant.id);
            const existing = prev.find(item => item.id === incomingId);
            if (existing) {
                // If it already exists, increase quantity
                return prev.map(item =>
                    item.id === incomingId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Add new item to cart (store id as string)
            return [...prev, { id: String(incomingId), plant, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, amount) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + amount);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    // Derived states
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Compute subtotal from numeric price values. Prefer server-provided prices.
    const subtotal = cart.reduce((acc, item) => {
        const priceNum = parsePrice(item.plant?.price);
        return acc + (priceNum * (item.quantity || 1));
    }, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            itemsCount, subtotal,
            isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
