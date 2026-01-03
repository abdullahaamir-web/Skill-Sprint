import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Clock, Target, Lock, CheckCircle, Play } from 'lucide-react';

const SkillDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetchSkillData();
    }, [id]);

    const fetchSkillData = async () => {
        try {
            const skillRes = await axios.get(`http://localhost:5000/api/skills/${id}`);
            setSkill(skillRes.data);
            setChallenges(skillRes.data.challenges || []);

            if (isAuthenticated) {
                try {
                    const progressRes = await axios.get('http://localhost:5000/api/progress');
                    const skillProgress = progressRes.data.find(p => p.skillId === id);
                    setProgress(skillProgress);
                } catch (error) {
                    console.error('Failed to fetch progress:', error);
                }
            }
        } catch (error) {
            console.error('Failed to fetch skill:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setEnrolling(true);
        try {
            await axios.post('http://localhost:5000/api/progress/enroll', { skillId: id });
            fetchSkillData();
        } catch (error) {
            console.error('Failed to enroll:', error);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="container" style={{ paddingTop: '4rem' }}>
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <h2>Skill not found</h2>
                    <Link to="/explore" className="btn btn-primary mt-lg">
                        Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    const completedChallenges = progress?.completedChallenges?.length || 0;
    const completionPercentage = challenges.length > 0 ? (completedChallenges / challenges.length) * 100 : 0;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Skill Header */}
            <div className="card mb-xl">
                <div className="grid grid-2" style={{ alignItems: 'center' }}>
                    <div>
                        <div className="skill-icon" style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>
                            {skill.icon}
                        </div>
                        <h1>{skill.title}</h1>
                        <p className="text-lg">{skill.description}</p>
                        <div className="flex gap-md mt-md">
                            <span className={`badge badge-${skill.difficulty === 'Beginner' ? 'success' : skill.difficulty === 'Intermediate' ? 'warning' : 'error'}`}>
                                {skill.difficulty}
                            </span>
                            <span className="badge badge-primary">
                                {skill.category}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="card" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="flex items-center gap-md mb-md">
                                <Clock size={20} />
                                <div>
                                    <div className="font-semibold">Estimated Time</div>
                                    <div className="text-secondary">{skill.estimatedTime}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-md mb-md">
                                <Target size={20} />
                                <div>
                                    <div className="font-semibold">Total Challenges</div>
                                    <div className="text-secondary">{challenges.length} challenges</div>
                                </div>
                            </div>
                            {progress && (
                                <div className="mt-lg">
                                    <div className="flex justify-between mb-sm">
                                        <span className="font-semibold">Your Progress</span>
                                        <span className="text-secondary">{Math.round(completionPercentage)}%</span>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
                                    </div>
                                </div>
                            )}
                            {!progress ? (
                                <button
                                    onClick={handleEnroll}
                                    className="btn btn-primary mt-lg"
                                    style={{ width: '100%' }}
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Enrolling...' : (
                                        <>
                                            <Play size={20} />
                                            Start Skill
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    to={`/challenges/${id}/${progress.currentChallenge}`}
                                    className="btn btn-success mt-lg"
                                    style={{ width: '100%', textAlign: 'center' }}
                                >
                                    Continue Learning
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenges List */}
            <div>
                <h2 className="mb-lg">Challenges</h2>
                <div className="grid gap-md">
                    {challenges.map((challenge, index) => {
                        const isCompleted = progress?.completedChallenges?.includes(challenge.id);
                        const isUnlocked = !progress || index === 0 || progress.completedChallenges?.includes(challenges[index - 1]?.id);
                        const isCurrent = progress?.currentChallenge === challenge.order;

                        return (
                            <div
                                key={challenge.id}
                                className={`card challenge-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-md">
                                        <div style={{ fontSize: '1.5rem' }}>
                                            {isCompleted ? (
                                                <CheckCircle size={24} color="var(--success)" />
                                            ) : !isUnlocked ? (
                                                <Lock size={24} color="var(--text-tertiary)" />
                                            ) : (
                                                <span className="badge badge-primary">{challenge.order}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4>{challenge.title}</h4>
                                            <p className="text-secondary text-sm">{challenge.description}</p>
                                        </div>
                                    </div>
                                    {isUnlocked && !isCompleted && (
                                        <Link
                                            to={`/challenges/${id}/${challenge.order}`}
                                            className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                        >
                                            {isCurrent ? 'Continue' : 'Start'}
                                        </Link>
                                    )}
                                    {isCompleted && (
                                        <span className="badge badge-success">Completed</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SkillDetail;
