import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, User, LogOut, LayoutDashboard, Trophy, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    ⚡ SkillSprint
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/explore" className="navbar-link" onClick={closeMenu}>
                            <BookOpen size={18} style={{ display: 'inline', marginRight: '4px' }} />
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link to="/leaderboard" className="navbar-link" onClick={closeMenu}>
                            <Trophy size={18} style={{ display: 'inline', marginRight: '4px' }} />
                            Leaderboard
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>
                                    <LayoutDashboard size={18} style={{ display: 'inline', marginRight: '4px' }} />
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
                                        <span className="hidden-desktop">Profile</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm btn-full-mobile">
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="btn btn-secondary btn-sm btn-full-mobile" onClick={closeMenu}>
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="btn btn-primary btn-sm btn-full-mobile" onClick={closeMenu}>
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <button onClick={() => { toggleTheme(); closeMenu(); }} className="theme-toggle">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            <span className="hidden-desktop">
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
