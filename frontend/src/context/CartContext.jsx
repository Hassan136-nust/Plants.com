import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();

    // Dynamic key dependent on the user ID
    const cartKey = `zn_cart_${user ? user.id : 'guest'}`;

    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem(cartKey);
        return stored ? JSON.parse(stored) : [];
    });

    // UI state for the new drawer
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { token } = useAuth(); // for API auth

    // 1. Fetch DB Cart aggressively on Login (or load guest cart)
    useEffect(() => {
        if (user && token) {
            fetch('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => {
                    if (data.cart) {
                        setCart(data.cart);
                        localStorage.setItem(cartKey, JSON.stringify(data.cart));
                    }
                })
                .catch(err => console.error('Failed to pre-fetch cart:', err));
        } else {
            const stored = localStorage.getItem(cartKey);
            setCart(stored ? JSON.parse(stored) : []);
        }
    }, [user, token, cartKey]);

    // 2. Sync to DB & LocalStorage on change
    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cart));

        if (user && token) {
            fetch('http://localhost:5000/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ cart })
            }).catch(err => console.error('Failed to sync cart:', err));
        }
    }, [cart, cartKey, user, token]);

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

    // Parse prices safely: assume plant.price looks like "$45"
    const subtotal = cart.reduce((acc, item) => {
        const priceNum = parseFloat(item.plant.price.replace(/[^0-9.]/g, ''));
        return acc + (priceNum * item.quantity);
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
