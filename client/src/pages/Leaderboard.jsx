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
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="text-center mb-xl">
                <h1>
                    <Trophy size={40} style={{ display: 'inline', marginRight: '12px', color: 'var(--warning)' }} />
                    Leaderboard
                </h1>
                <p>See how you rank against other learners</p>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-xl">
                <div className="flex gap-md">
                    <button
                        onClick={() => setFilter('points')}
                        className={`btn ${filter === 'points' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <Trophy size={18} />
                        Points
                    </button>
                    <button
                        onClick={() => setFilter('streak')}
                        className={`btn ${filter === 'streak' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <Flame size={18} />
                        Streak
                    </button>
                    <button
                        onClick={() => setFilter('challenges')}
                        className={`btn ${filter === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-lg">
                                            <div style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                textAlign: 'center'
                                            }}>
                                                {medal || `#${rank}`}
                                            </div>
                                            <img
                                                src={entry.avatar}
                                                alt={entry.name}
                                                className="avatar-lg"
                                                style={{ border: isCurrentUser ? '3px solid white' : '2px solid var(--border)' }}
                                            />
                                            <div>
                                                <h4 style={{ color: isCurrentUser ? 'white' : 'var(--text-primary)' }}>
                                                    {entry.name}
                                                    {isCurrentUser && ' (You)'}
                                                </h4>
                                                <div className="flex gap-md mt-sm">
                                                    <span className={isCurrentUser ? '' : 'text-secondary'} style={{ fontSize: '0.875rem' }}>
                                                        <Trophy size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                        {entry.points} points
                                                    </span>
                                                    <span className={isCurrentUser ? '' : 'text-secondary'} style={{ fontSize: '0.875rem' }}>
                                                        <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                        {entry.streak} day streak
                                                    </span>
                                                    <span className={isCurrentUser ? '' : 'text-secondary'} style={{ fontSize: '0.875rem' }}>
                                                        <Target size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                        {entry.challengesCompleted} challenges
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {rank <= 3 && (
                                            <Medal size={32} style={{ color: isCurrentUser ? 'white' : 'var(--warning)' }} />
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
