import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Trophy, Target, Flame, TrendingUp, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState([]);
    const [badges, setBadges] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [progressRes, badgesRes, submissionsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/progress'),
                axios.get('http://localhost:5000/api/badges'),
                axios.get('http://localhost:5000/api/submissions')
            ]);

            setProgress(progressRes.data);
            setBadges(badgesRes.data);
            setSubmissions(submissionsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        );
    }

    const totalChallengesCompleted = progress.reduce((sum, p) => sum + p.completedChallenges.length, 0);
    const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;

    // Mock weekly progress data
    const weeklyData = [
        { day: 'Mon', challenges: 2 },
        { day: 'Tue', challenges: 3 },
        { day: 'Wed', challenges: 1 },
        { day: 'Thu', challenges: 4 },
        { day: 'Fri', challenges: 2 },
        { day: 'Sat', challenges: 5 },
        { day: 'Sun', challenges: 3 }
    ];

    // Earned badges (simplified logic)
    const earnedBadges = badges.filter(badge => {
        if (badge.requirement === 'complete_1_challenge' && totalChallengesCompleted >= 1) return true;
        if (badge.requirement === 'complete_5_challenges' && totalChallengesCompleted >= 5) return true;
        if (badge.requirement === '7_day_streak' && user.streak >= 7) return true;
        if (badge.requirement === 'complete_skill' && progress.some(p => p.completionPercentage === 100)) return true;
        return false;
    });

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="mb-xl">
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p>Here's your learning progress</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-4 mb-xl">
                <div className="card stat-card">
                    <Target size={32} style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }} />
                    <div className="stat-value">{totalChallengesCompleted}</div>
                    <div className="stat-label">Challenges Completed</div>
                </div>
                <div className="card stat-card">
                    <Trophy size={32} style={{ color: 'var(--secondary)', marginBottom: 'var(--spacing-md)' }} />
                    <div className="stat-value">{user?.points || 0}</div>
                    <div className="stat-label">Total Points</div>
                </div>
                <div className="card stat-card">
                    <Flame size={32} style={{ color: 'var(--warning)', marginBottom: 'var(--spacing-md)' }} />
                    <div className="stat-value">{user?.streak || 0}</div>
                    <div className="stat-label">Day Streak</div>
                </div>
                <div className="card stat-card">
                    <BookOpen size={32} style={{ color: 'var(--accent)', marginBottom: 'var(--spacing-md)' }} />
                    <div className="stat-value">{progress.length}</div>
                    <div className="stat-label">Active Skills</div>
                </div>
            </div>

            <div className="grid grid-2 mb-xl">
                {/* Active Skills */}
                <div className="card">
                    <h3 className="mb-lg">Active Skills</h3>
                    {progress.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📚</div>
                            <p>No active skills yet</p>
                            <Link to="/explore" className="btn btn-primary btn-sm mt-md">
                                Explore Skills
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-md">
                            {progress.map(p => (
                                <Link to={`/skills/${p.skillId}`} key={p.id} className="card" style={{ background: 'var(--bg-secondary)' }}>
                                    <div className="flex items-center gap-md mb-md">
                                        <div style={{ fontSize: '2rem' }}>{p.skill?.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <h4>{p.skill?.title}</h4>
                                            <div className="flex justify-between text-sm text-secondary">
                                                <span>{p.completedChallenges.length} / {p.totalChallenges} challenges</span>
                                                <span>{Math.round(p.completionPercentage)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: `${p.completionPercentage}%` }}></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Weekly Progress Chart */}
                <div className="card">
                    <h3 className="mb-lg">
                        <TrendingUp size={24} style={{ display: 'inline', marginRight: '8px' }} />
                        Weekly Progress
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="day" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            />
                            <Line type="monotone" dataKey="challenges" stroke="var(--primary)" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Earned Badges */}
            <div className="card">
                <h3 className="mb-lg">
                    <Trophy size={24} style={{ display: 'inline', marginRight: '8px' }} />
                    Earned Badges
                </h3>
                {earnedBadges.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏆</div>
                        <p>Complete challenges to earn badges!</p>
                    </div>
                ) : (
                    <div className="grid grid-4">
                        {earnedBadges.map(badge => (
                            <div key={badge.id} className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>{badge.icon}</div>
                                <h4>{badge.name}</h4>
                                <p className="text-sm text-secondary">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
