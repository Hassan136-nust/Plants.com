import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    // cart items shape: { id: string/number, plant: object, quantity: number }
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem('zn_cart');
        return stored ? JSON.parse(stored) : [];
    });

    // UI state for the new drawer
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('zn_cart', JSON.stringify(cart));
    }, [cart]);

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

        // Auto-open drawer to show them it was added
        setIsCartOpen(true);
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
