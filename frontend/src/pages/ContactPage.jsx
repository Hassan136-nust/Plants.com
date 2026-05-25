import React, { useState } from 'react';
import { ContactLocationIcon, ContactPhoneIcon, ContactClockIcon, ContactMailIcon } from '../data/constants';

export default function ContactPage() {
    const [toast, setToast] = useState({ show: false, msg: '' });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const triggerToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: '' }), 3800);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContact = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                triggerToast('✅ Message sent! Our nursery experts will contact you soon.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                triggerToast('❌ ' + (result.message || 'Failed to send message. Please try again.'));
            }
        } catch (error) {
            console.error('Contact form error:', error);
            triggerToast('❌ Failed to send message. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsApp = () => {
        if (!formData.name || !formData.message) {
            triggerToast('⚠️ Please fill in your name and message first!');
            return;
        }

        const phoneNumber = '923289082754';
        const text = `Hello! My name is ${formData.name}.\n\n${formData.message}\n\nEmail: ${formData.email || 'Not provided'}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        triggerToast('✅ Opening WhatsApp...');
    };

    const handleEmail = () => {
        if (!formData.name || !formData.message) {
            triggerToast('⚠️ Please fill in your name and message first!');
            return;
        }

        const email = 'pyrohassan786@gmail.com';
        const subject = encodeURIComponent(`Inquiry from ${formData.name} - Zia Nursery`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email || 'Not provided'}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        triggerToast('✅ Opening email client...');
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        triggerToast('Welcome! You are now subscribed to the Zia Green Newsletter.');
        e.target.reset();
    };

    return (
        <>
            {/* PAGE HERO */}
            <section style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center' }}>
                <div className="container">
                    <div className="section-eyebrow">Get In Touch</div>
                    <h1 className="section-title">Visit <em>Us</em></h1>
                    <p className="section-desc" style={{ maxWidth: '560px', margin: '16px auto 0' }}>
                        We'd love to hear from you. Visit our farm, call us, or drop a message below.
                    </p>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="contact" style={{ paddingTop: '20px' }}>
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-card">
                                <ContactLocationIcon />
                                <h4>Our Location</h4>
                                <p>Gehlan Chak no. 9,<br />Pattoki District Kasur , Pakistan</p>
                            </div>
                            <div className="contact-card">
                                <ContactPhoneIcon />
                                <h4>Phone</h4>
                                <p>+92 328 908 2754<br />+92 328 908 2754</p>
                            </div>
                            <div className="contact-card" onClick={handleWhatsApp} style={{ cursor: 'pointer' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    color: 'var(--gold)',
                                    background: 'rgba(248, 219, 125, 0.1)',
                                    border: '1px solid rgba(248, 219, 125, 0.35)',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    marginBottom: '18px',
                                    boxSizing: 'content-box',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                </div>
                                <h4>WhatsApp</h4>
                                <p style={{ color: '#f9f9f9ff', fontWeight: '600' }}>Click to message us<br />+92 328 908 2754</p>
                            </div>
                            <div className="contact-card" onClick={handleEmail} style={{ cursor: 'pointer' }}>
                                <ContactMailIcon />
                                <h4>Email</h4>
                                <p style={{ color: 'var(--accent)', fontWeight: '600' }}>Click to send email<br />pyrohassan786@gmail.com</p>
                            </div>
                        </div>

                        <div className="contact-form-wrap">
                            <form className="contact-form" onSubmit={handleContact}>
                                <h3>Send a Message</h3>
                                
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="Your name" 
                                            className="form-input" 
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="your@email.com" 
                                            className="form-input"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="input-group" style={{ marginTop: '20px' }}>
                                    <label>Message</label>
                                    <textarea 
                                        name="message" 
                                        placeholder="Tell us about your dream garden..." 
                                        className="form-input form-textarea" 
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                {/* Send Options */}
                                <div style={{
                                    marginTop: '28px',
                                    paddingTop: '24px',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                }}>
                                    <div style={{
                                        textAlign: 'center',
                                        marginBottom: '16px',
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        letterSpacing: '1px',
                                    }}>
                                        SEND VIA
                                    </div>
                                    
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                    }}>
                                        <button
                                            type="button"
                                            onClick={handleWhatsApp}
                                            disabled={loading}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                padding: '16px 24px',
                                                background: '#25D366',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#ffffff',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                                                opacity: loading ? 0.6 : 1,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.4)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                            </svg>
                                            <span>WhatsApp</span>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={handleEmail}
                                            disabled={loading}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                padding: '16px 24px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#ffffff',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                                opacity: loading ? 0.6 : 1,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                            <span>Email</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="newsletter">
                <div className="container">
                    <div className="newsletter-card">
                        <div className="newsletter-content">
                            <h2>Join the <em>Green Community</em></h2>
                            <p>Get seasonal plant tips, exclusive offers, and first access to new arrivals.</p>
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <div className="form-group">
                                    <input type="email" placeholder="Your email address" required className="form-input" />
                                    <button type="submit" className="btn-primary">Subscribe</button>
                                </div>
                            </form>
                            <p className="nl-privacy">No spam, ever. Unsubscribe anytime.</p>
                        </div>
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
