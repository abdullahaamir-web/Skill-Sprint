import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Trophy, Flame, Target, Medal } from 'lucide-react';

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [filter, setFilter] = useState('points');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leaderboard');
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
        if (filter === 'points') return b.points - a.points;
        if (filter === 'streak') return b.streak - a.streak;
        if (filter === 'challenges') return b.challengesCompleted - a.challengesCompleted;
        return 0;
    });

    const getMedalIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        );
    }

    return (
        <div className="container py-fluid">
            <div className="text-center mb-xl">
                <h1>
                    <Trophy size={40} style={{ display: 'inline', marginRight: '12px', color: 'var(--warning)' }} />
                    Leaderboard
                </h1>
                <p>See how you rank against other learners</p>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-xl">
                <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilter('points')}
                        className={`btn ${filter === 'points' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    >
                        <Trophy size={18} />
                        Points
                    </button>
                    <button
                        onClick={() => setFilter('streak')}
                        className={`btn ${filter === 'streak' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    >
                        <Flame size={18} />
                        Streak
                    </button>
                    <button
                        onClick={() => setFilter('challenges')}
                        className={`btn ${filter === 'challenges' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    >
                        <Target size={18} />
                        Challenges
                    </button>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="card">
                {sortedLeaderboard.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <h3>No users yet</h3>
                        <p>Be the first to complete challenges!</p>
                    </div>
                ) : (
                    <div className="grid gap-md">
                        {sortedLeaderboard.map((entry, index) => {
                            const rank = index + 1;
                            const isCurrentUser = user?.id === entry.id;
                            const medal = getMedalIcon(rank);

                            return (
                                <div
                                    key={entry.id}
                                    className="card"
                                    style={{
                                        background: isCurrentUser ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                        color: isCurrentUser ? 'white' : 'inherit',
                                        border: isCurrentUser ? '2px solid var(--primary)' : '1px solid var(--border)'
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-md" style={{ flexWrap: 'wrap' }}>
                                        <div className="flex items-center gap-md" style={{ flexWrap: 'wrap' }}>
                                            <div style={{
                                                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                                                fontWeight: 'bold',
                                                minWidth: '30px',
                                                textAlign: 'center'
                                            }}>
                                                {medal || `#${rank}`}
                                            </div>
                                            <img
                                                src={entry.avatar}
                                                alt={entry.name}
                                                className="avatar"
                                                style={{
                                                    width: 'clamp(40px, 10vw, 60px)',
                                                    height: 'clamp(40px, 10vw, 60px)',
                                                    border: isCurrentUser ? '2px solid white' : '1px solid var(--border)'
                                                }}
                                            />
                                            <div style={{ flex: '1', minWidth: '150px' }}>
                                                <h4 style={{ color: isCurrentUser ? 'white' : 'var(--text-primary)', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>
                                                    {entry.name}
                                                    {isCurrentUser && ' (You)'}
                                                </h4>
                                                <div className="flex gap-md mt-xs" style={{ flexWrap: 'wrap' }}>
                                                    <span className={isCurrentUser ? '' : 'text-secondary'} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Trophy size={12} />
                                                        {entry.points} pts
                                                    </span>
                                                    <span className={isCurrentUser ? '' : 'text-secondary'} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Flame size={12} />
                                                        {entry.streak}d
                                                    </span>
                                                    <span className={isCurrentUser ? '' : 'text-secondary'} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Target size={12} />
                                                        {entry.challengesCompleted} ch
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {rank <= 3 && (
                                            <Medal size={28} style={{ color: isCurrentUser ? 'white' : 'var(--warning)', flexShrink: 0 }} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
