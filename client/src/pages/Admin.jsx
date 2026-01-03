import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('submissions');
    const [submissions, setSubmissions] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateSkill, setShowCreateSkill] = useState(false);
    const [newSkill, setNewSkill] = useState({
        title: '',
        description: '',
        difficulty: 'Beginner',
        estimatedTime: '',
        icon: '📚',
        category: 'Development'
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [submissionsRes, skillsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/submissions'),
                axios.get('http://localhost:5000/api/skills')
            ]);

            setSubmissions(submissionsRes.data);
            setSkills(skillsRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmission = async (submissionId, status, feedback = '') => {
        try {
            await axios.patch(`http://localhost:5000/api/submissions/${submissionId}/review`, {
                status,
                feedback
            });
            fetchAdminData();
        } catch (error) {
            console.error('Failed to review submission:', error);
            alert('Failed to review submission');
        }
    };

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/skills', {
                ...newSkill,
                totalChallenges: 0
            });
            setShowCreateSkill(false);
            setNewSkill({
                title: '',
                description: '',
                difficulty: 'Beginner',
                estimatedTime: '',
                icon: '📚',
                category: 'Development'
            });
            fetchAdminData();
        } catch (error) {
            console.error('Failed to create skill:', error);
            alert('Failed to create skill');
        }
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
            <div className="mb-xl">
                <h1>Admin Panel</h1>
                <p>Manage skills, challenges, and review submissions</p>
            </div>

            {/* Tabs */}
            <div className="card mb-xl">
                <div className="flex gap-md">
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`btn ${activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        Review Submissions ({submissions.filter(s => s.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        Manage Skills
                    </button>
                </div>
            </div>

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
                <div>
                    <h2 className="mb-lg">Pending Submissions</h2>
                    {submissions.filter(s => s.status === 'pending').length === 0 ? (
                        <div className="card empty-state">
                            <div className="empty-state-icon">✅</div>
                            <h3>All caught up!</h3>
                            <p>No pending submissions to review</p>
                        </div>
                    ) : (
                        <div className="grid gap-md">
                            {submissions.filter(s => s.status === 'pending').map(submission => (
                                <div key={submission.id} className="card">
                                    <div className="flex justify-between items-start mb-md">
                                        <div>
                                            <div className="flex items-center gap-md mb-sm">
                                                <img
                                                    src={submission.user?.avatar}
                                                    alt={submission.user?.name}
                                                    className="avatar"
                                                />
                                                <div>
                                                    <h4>{submission.user?.name}</h4>
                                                    <p className="text-sm text-secondary">{submission.user?.email}</p>
                                                </div>
                                            </div>
                                            <h3>{submission.challenge?.title}</h3>
                                            <p className="text-secondary text-sm">
                                                Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="badge badge-warning">
                                            <Clock size={14} />
                                            Pending
                                        </span>
                                    </div>

                                    <div className="mb-lg" style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                        <p className="text-sm text-secondary mb-sm">Submission ({submission.submissionType}):</p>
                                        <p>{submission.content}</p>
                                    </div>

                                    <div className="flex gap-md">
                                        <button
                                            onClick={() => handleReviewSubmission(submission.id, 'approved', 'Great work!')}
                                            className="btn btn-success"
                                        >
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                const feedback = prompt('Enter feedback for the student:');
                                                if (feedback) {
                                                    handleReviewSubmission(submission.id, 'rejected', feedback);
                                                }
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            <XCircle size={18} />
                                            Request Revision
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reviewed Submissions */}
                    <h2 className="mt-2xl mb-lg">Recently Reviewed</h2>
                    <div className="grid gap-md">
                        {submissions.filter(s => s.status !== 'pending').slice(0, 5).map(submission => (
                            <div key={submission.id} className="card" style={{ opacity: 0.7 }}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4>{submission.user?.name} - {submission.challenge?.title}</h4>
                                        <p className="text-sm text-secondary">
                                            Reviewed: {new Date(submission.reviewedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`badge ${submission.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                                        {submission.status === 'approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {submission.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div>
                    <div className="flex justify-between items-center mb-lg">
                        <h2>Skills Management</h2>
                        <button
                            onClick={() => setShowCreateSkill(!showCreateSkill)}
                            className="btn btn-primary"
                        >
                            <Plus size={20} />
                            Create New Skill
                        </button>
                    </div>

                    {showCreateSkill && (
                        <div className="card mb-xl">
                            <h3 className="mb-lg">Create New Skill</h3>
                            <form onSubmit={handleCreateSkill}>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newSkill.title}
                                            onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Icon (Emoji)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newSkill.icon}
                                            onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={newSkill.description}
                                        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                                        required
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-3">
                                    <div className="form-group">
                                        <label className="form-label">Difficulty</label>
                                        <select
                                            className="form-select"
                                            value={newSkill.difficulty}
                                            onChange={(e) => setNewSkill({ ...newSkill, difficulty: e.target.value })}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Estimated Time</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newSkill.estimatedTime}
                                            onChange={(e) => setNewSkill({ ...newSkill, estimatedTime: e.target.value })}
                                            placeholder="e.g., 4 weeks"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newSkill.category}
                                            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-md">
                                    <button type="submit" className="btn btn-success">
                                        Create Skill
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateSkill(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-2 card-grid-mobile">
                        {skills.map(skill => (
                            <div key={skill.id} className="card">
                                <div className="flex items-start gap-md">
                                    <div style={{ fontSize: '2.5rem' }}>{skill.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <h3>{skill.title}</h3>
                                        <p className="text-sm text-secondary mb-md">{skill.description}</p>
                                        <div className="flex gap-md">
                                            <span className={`badge badge-${skill.difficulty === 'Beginner' ? 'success' : skill.difficulty === 'Intermediate' ? 'warning' : 'error'}`}>
                                                {skill.difficulty}
                                            </span>
                                            <span className="badge badge-primary">{skill.category}</span>
                                            <span className="text-sm text-secondary">
                                                {skill.totalChallenges} challenges
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
