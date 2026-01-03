import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowRight, Target, Trophy, Users, Zap } from 'lucide-react';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalSkills: 0, totalChallenges: 0 });
    const [featuredSkills, setFeaturedSkills] = useState([]);
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, skillsRes, leaderboardRes] = await Promise.all([
                axios.get('http://localhost:5000/api/stats'),
                axios.get('http://localhost:5000/api/skills'),
                axios.get('http://localhost:5000/api/leaderboard')
            ]);

            setStats(statsRes.data);
            setFeaturedSkills(skillsRes.data.slice(0, 3));
            setTopUsers(leaderboardRes.data.slice(0, 3));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1 className="animate-fade-in">Learn Skills Through Challenges</h1>
                    <p className="animate-fade-in">
                        Master new skills with bite-sized challenges, track your progress, and compete with others
                    </p>
                    <Link
                        to={isAuthenticated ? "/explore" : "/signup"}
                        className="btn btn-lg"
                        style={{ background: 'white', color: '#6366f1' }}
                    >
                        {isAuthenticated ? "Explore Skills" : "Start Your First Challenge"}
                        <ArrowRight />
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
                <div className="grid grid-3">
                    <div className="card stat-card">
                        <Users size={40} style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }} />
                        <div className="stat-value">{stats.totalUsers}+</div>
                        <div className="stat-label">Active Learners</div>
                    </div>
                    <div className="card stat-card">
                        <Target size={40} style={{ color: 'var(--secondary)', marginBottom: 'var(--spacing-md)' }} />
                        <div className="stat-value">{stats.totalSkills}</div>
                        <div className="stat-label">Skills Available</div>
                    </div>
                    <div className="card stat-card">
                        <Zap size={40} style={{ color: 'var(--accent)', marginBottom: 'var(--spacing-md)' }} />
                        <div className="stat-value">{stats.totalChallenges}+</div>
                        <div className="stat-label">Challenges Completed</div>
                    </div>
                </div>
            </section>

            {/* Featured Skills */}
            <section className="container mt-2xl">
                <div className="text-center mb-xl">
                    <h2>Featured Skills</h2>
                    <p>Start learning with our most popular skills</p>
                </div>
                <div className="grid grid-3">
                    {featuredSkills.map(skill => (
                        <Link to={`/skills/${skill.id}`} key={skill.id} className="card skill-card">
                            <div className="skill-icon">{skill.icon}</div>
                            <h3 className="skill-title">{skill.title}</h3>
                            <p className="skill-description">{skill.description}</p>
                            <div className="skill-meta">
                                <span className={`badge badge-${skill.difficulty === 'Beginner' ? 'success' : skill.difficulty === 'Intermediate' ? 'warning' : 'error'}`}>
                                    {skill.difficulty}
                                </span>
                                <span>{skill.totalChallenges} challenges</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-xl">
                    <Link to="/explore" className="btn btn-primary">
                        View All Skills <ArrowRight />
                    </Link>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mt-2xl">
                <div className="text-center mb-xl">
                    <h2>How It Works</h2>
                    <p>Your journey to mastery in three simple steps</p>
                </div>
                <div className="grid grid-3">
                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>1️⃣</div>
                        <h3>Choose a Skill</h3>
                        <p>Browse our catalog and pick a skill you want to master</p>
                    </div>
                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>2️⃣</div>
                        <h3>Complete Challenges</h3>
                        <p>Work through sequential challenges and submit your work</p>
                    </div>
                    <div className="card text-center">
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>3️⃣</div>
                        <h3>Earn Badges</h3>
                        <p>Track progress, earn badges, and climb the leaderboard</p>
                    </div>
                </div>
            </section>

            {/* Top Users */}
            <section className="container mt-2xl mb-2xl">
                <div className="text-center mb-xl">
                    <h2>Top Learners This Week</h2>
                    <p>Join our community of dedicated learners</p>
                </div>
                <div className="grid grid-3">
                    {topUsers.map((user, index) => (
                        <div key={user.id} className="card text-center">
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img src={user.avatar} alt={user.name} className="avatar-lg" />
                                {index === 0 && <span style={{ position: 'absolute', top: -5, right: -5, fontSize: '1.5rem' }}>👑</span>}
                            </div>
                            <h4 className="mt-md">{user.name}</h4>
                            <div className="flex justify-center gap-md mt-sm">
                                <span className="badge badge-primary">
                                    <Trophy size={14} /> {user.points} pts
                                </span>
                                <span className="badge badge-warning">
                                    🔥 {user.streak} days
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-xl">
                    <Link to="/leaderboard" className="btn btn-secondary">
                        View Full Leaderboard
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section style={{ background: 'var(--gradient-primary)', padding: '4rem 0', color: 'white' }}>
                    <div className="container text-center">
                        <h2>Ready to Start Learning?</h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 'var(--spacing-xl)' }}>
                            Join thousands of learners mastering new skills through challenges
                        </p>
                        <Link to="/signup" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
                            Create Free Account <ArrowRight />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
