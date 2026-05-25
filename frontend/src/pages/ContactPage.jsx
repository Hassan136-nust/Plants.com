import React, { useState } from 'react';
import { ContactLocationIcon, ContactPhoneIcon, ContactClockIcon, ContactMailIcon } from '../data/constants';

export default function ContactPage() {
    const [toast, setToast] = useState({ show: false, msg: '' });

    const triggerToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: '' }), 3800);
    };

    const handleContact = (e) => {
        e.preventDefault();
        triggerToast('Message sent! Our nursery experts will contact you soon.');
        e.target.reset();
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
                                <p>Green Valley Farm Road<br />Lahore, Punjab, Pakistan</p>
                            </div>
                            <div className="contact-card">
                                <ContactPhoneIcon />
                                <h4>Phone</h4>
                                <p>+92 300 123 4567<br />+92 42 3456 7890</p>
                            </div>
                            <div className="contact-card">
                                <ContactClockIcon />
                                <h4>Opening Hours</h4>
                                <p>Mon – Sat: 8:00 AM – 7:00 PM<br />Sunday: 10:00 AM – 5:00 PM</p>
                            </div>
                            <div className="contact-card">
                                <ContactMailIcon />
                                <h4>Email</h4>
                                <p>hello@zianurseryfarm.com</p>
                            </div>
                        </div>

                        <div className="contact-form-wrap">
                            <form className="contact-form" onSubmit={handleContact}>
                                <h3>Send a Message</h3>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input type="text" placeholder="Your name" className="form-input" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Email</label>
                                        <input type="email" placeholder="your@email.com" className="form-input" required />
                                    </div>
                                </div>
                                <div className="input-group" style={{ marginTop: '20px' }}>
                                    <label>Message</label>
                                    <textarea placeholder="Tell us about your dream garden..." className="form-input form-textarea" rows={4} required></textarea>
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: '26px' }}>
                                    <span>Send Message</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                </button>
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
