import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, User, LogOut, LayoutDashboard, Trophy, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Close menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 900) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    ⚡ SkillSprint
                </Link>

                <div className="flex items-center gap-md">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/explore" className="navbar-link" onClick={closeMenu}>
                            <BookOpen size={18} style={{ marginRight: '8px' }} />
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link to="/leaderboard" className="navbar-link" onClick={closeMenu}>
                            <Trophy size={18} style={{ marginRight: '8px' }} />
                            Leaderboard
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>
                                    <LayoutDashboard size={18} style={{ marginRight: '8px' }} />
                                    Dashboard
                                </Link>
                            </li>
                            {isAdmin && (
                                <li>
                                    <Link to="/admin" className="navbar-link" onClick={closeMenu}>
                                        Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/profile" className="navbar-link" onClick={closeMenu}>
                                    <div className="flex items-center gap-sm">
                                        <img src={user?.avatar} alt={user?.name} className="avatar" style={{ width: '32px', height: '32px' }} />
                                        <span className="hidden-desktop" style={{ marginLeft: '8px' }}>Profile</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu} style={{ width: '100%' }}>
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="btn btn-primary btn-sm" onClick={closeMenu} style={{ width: '100%' }}>
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
