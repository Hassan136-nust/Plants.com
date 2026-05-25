import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('zn_token') || null);
    const [loading, setLoading] = useState(true);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authCallback, setAuthCallback] = useState(null);

    // On mount, verify stored token
    useEffect(() => {
        const stored = localStorage.getItem('zn_token');
        if (!stored) { setLoading(false); return; }
        fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${stored}` },
        })
            .then(r => r.json())
            .then(data => {
                if (data.user) setUser(data.user);
                else { localStorage.removeItem('zn_token'); setToken(null); }
            })
            .catch(() => { localStorage.removeItem('zn_token'); setToken(null); })
            .finally(() => setLoading(false));
    }, []);

    const login = (userData, jwt) => {
        setUser(userData);
        setToken(jwt);
        localStorage.setItem('zn_token', jwt);

        // If there was a pending callback, run it
        if (authCallback) {
            authCallback(userData, jwt);
            setAuthCallback(null);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('zn_token');
    };

    const triggerAuth = (callback = null) => {
        if (callback) setAuthCallback(() => callback);
        setShowAuthModal(true);
    };

    const closeAuth = () => {
        setShowAuthModal(false);
        setAuthCallback(null);
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, logout, loading,
            showAuthModal, triggerAuth, closeAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
