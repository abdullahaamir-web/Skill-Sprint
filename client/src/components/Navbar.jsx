import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, User, LogOut, LayoutDashboard, Trophy, BookOpen } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    ⚡ SkillSprint
                </Link>

                <ul className="navbar-menu">
                    <li>
                        <Link to="/explore" className="navbar-link">
                            <BookOpen size={18} style={{ display: 'inline', marginRight: '4px' }} />
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link to="/leaderboard" className="navbar-link">
                            <Trophy size={18} style={{ display: 'inline', marginRight: '4px' }} />
                            Leaderboard
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="navbar-link">
                                    <LayoutDashboard size={18} style={{ display: 'inline', marginRight: '4px' }} />
                                    Dashboard
                                </Link>
                            </li>
                            {isAdmin && (
                                <li>
                                    <Link to="/admin" className="navbar-link">
                                        Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/profile" className="navbar-link">
                                    <img src={user?.avatar} alt={user?.name} className="avatar" style={{ width: '32px', height: '32px' }} />
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="btn btn-secondary btn-sm">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="btn btn-primary btn-sm">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <button onClick={toggleTheme} className="theme-toggle">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
