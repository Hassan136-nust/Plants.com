import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { parsePrice } from '../utils/price';

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

    // 1. Fetch DB Cart aggressively on Login (or load guest cart)
    // On login: fetch server cart, merge guest cart, and persist to user key
    useEffect(() => {
        const init = async () => {
            try {
                if (user && token) {
                    const res = await fetch('http://localhost:5001/api/cart', { headers: { Authorization: `Bearer ${token}` } });
                    const data = await res.json();
                    const serverCart = data.cart || [];

                    // Merge guest cart into server cart (sum quantities)
                    const guestStore = localStorage.getItem(GUEST_KEY);
                    const guestCart = guestStore ? JSON.parse(guestStore) : [];

                    const mergedMap = new Map();
                    serverCart.concat(guestCart).forEach(it => {
                        const id = it.id;
                        if (!mergedMap.has(id)) mergedMap.set(id, { ...it });
                        else mergedMap.set(id, { ...it, quantity: (mergedMap.get(id).quantity || 0) + (it.quantity || 0) });
                    });
                    const merged = Array.from(mergedMap.values());

                    // Normalize prices with latest product data
                    try {
                        const plantsRes = await fetch('http://localhost:5001/api/plants');
                        const plantsData = await plantsRes.json();
                        const map = new Map(plantsData.map(p => [p._id, p]));
                        const norm = merged.map(item => {
                            const serverPlant = map.get(item.id) || item.plant || {};
                            return { ...item, plant: { ...serverPlant } };
                        });
                        setCart(norm);
                        localStorage.setItem(USER_KEY, JSON.stringify(norm));
                    } catch (err) {
                        setCart(merged);
                        localStorage.setItem(USER_KEY, JSON.stringify(merged));
                    }

                    // Sync merged cart to server
                    try {
                        await fetch('http://localhost:5001/api/cart', {
                            method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ cart: merged })
                        });
                    } catch (err) { /* ignore */ }
                } else {
                    // No user: load guest cart and try to normalize prices from server data
                    const stored = localStorage.getItem(GUEST_KEY);
                    const guest = stored ? JSON.parse(stored) : [];
                    try {
                        const plantsRes = await fetch('http://localhost:5001/api/plants');
                        const plantsData = await plantsRes.json();
                        const map = new Map(plantsData.map(p => [p._id, p]));
                        const norm = guest.map(item => {
                            const serverPlant = map.get(item.id) || item.plant || {};
                            return { ...item, plant: { ...serverPlant } };
                        });
                        setCart(norm);
                    } catch (err) {
                        setCart(guest);
                    }
                }
            } catch (err) {
                console.error('Failed to initialize cart:', err);
            }
        };
        init();
    }, [user, token]);

    // 2. Sync to DB & LocalStorage on change
    useEffect(() => {
        try {
            const key = USER_KEY || GUEST_KEY;
            localStorage.setItem(key, JSON.stringify(cart));
        } catch (err) { /* ignore */ }

        if (user && token) {
            fetch('http://localhost:5001/api/cart', {
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
            const existing = prev.find(item => item.id === plant.id);
            if (existing) {
                // If it already exists, increase quantity
                return prev.map(item =>
                    item.id === plant.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Add new item to cart
            return [...prev, { id: plant.id, plant, quantity: 1 }];
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
