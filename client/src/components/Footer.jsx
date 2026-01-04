import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Thanks for joining!' });
                setEmail('');
            } else {
                setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not connect to server.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="navbar-brand">
                            ⚡ SkillSprint
                        </Link>
                        <p className="mt-md">
                            Elevate your potential through sequential, challenge-based learning. Join our community of explorers today.
                        </p>
                        <div className="footer-social mt-lg">
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="social-link" aria-label="GitHub"><Github size={20} /></a>
                            <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="#" className="social-link" aria-label="Support"><Mail size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Platform</h4>
                        <ul>
                            <li><Link to="/explore">Explore Skills</Link></li>
                            <li><Link to="/leaderboard">Leaderboard</Link></li>
                            <li><Link to="/signup">Start Learning</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">Status</a></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Stay Updated</h4>
                        <p>Get the latest challenges delivered to your inbox.</p>
                        <form className="newsletter-form mt-md" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="newsletter-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                disabled={loading}
                            >
                                {loading ? '...' : 'Join'}
                            </button>
                        </form>
                        {status.message && (
                            <p className={`text-sm mt-sm ${status.type === 'success' ? 'text-success' : 'text-error'}`}>
                                {status.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="footer-bottom mt-2xl">
                    <p>&copy; {new Date().getFullYear()} SkillSprint. Crafted with ⚡ for modern explorers.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
