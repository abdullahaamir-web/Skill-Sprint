import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Link as LinkIcon, Image, CheckCircle, Clock, XCircle } from 'lucide-react';

const Challenges = () => {
    const { skillId, challengeOrder } = useParams();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [challenge, setChallenge] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [submissionType, setSubmissionType] = useState('text');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchChallengeData();
    }, [skillId, challengeOrder]);

    const fetchChallengeData = async () => {
        try {
            const skillRes = await axios.get(`/api/skills/${skillId}`);
            setSkill(skillRes.data);

            const challengeData = skillRes.data.challenges?.find(c => c.order === parseInt(challengeOrder));
            setChallenge(challengeData);

            // Check if already submitted
            const submissionsRes = await axios.get('/api/submissions');
            const existingSubmission = submissionsRes.data.find(
                s => s.challengeId === challengeData?.id && s.skillId === skillId
            );
            setSubmission(existingSubmission);
        } catch (error) {
            console.error('Failed to fetch challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess(false);

        try {
            await axios.post('/api/submissions', {
                challengeId: challenge.id,
                skillId,
                submissionType,
                content
            });

            setSuccess(true);
            setContent('');

            setTimeout(() => {
                fetchChallengeData();
            }, 1500);
        } catch (error) {
            console.error('Failed to submit:', error);
            alert('Failed to submit challenge');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="container" style={{ paddingTop: '4rem' }}>
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <h2>Challenge not found</h2>
                    <button onClick={() => navigate(-1)} className="btn btn-primary mt-lg">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Breadcrumb */}
            <div className="mb-lg responsive-align">
                <button onClick={() => navigate(`/skills/${skillId}`)} className="btn btn-secondary btn-sm">
                    ← Back to {skill?.title}
                </button>
            </div>

            <div className="grid grid-2" style={{ alignItems: 'start' }}>
                {/* Challenge Content */}
                <div>
                    <div className="card">
                        <div className="flex items-center gap-md mb-md" style={{ justifyContent: 'inherit' }}>
                            <div className="badge badge-primary">Challenge {challenge.order}</div>
                        </div>
                        <h1 className="mb-md">{challenge.title}</h1>
                        <p className="text-lg">{challenge.description}</p>

                        <div className="mt-xl">
                            <h3>Instructions</h3>
                            <p>{challenge.instructions}</p>
                        </div>

                        {challenge.resources && challenge.resources.length > 0 && (
                            <div className="mt-lg">
                                <h4>Resources</h4>
                                <ul style={{ paddingLeft: 'var(--spacing-lg)' }}>
                                    {challenge.resources.map((resource, index) => (
                                        <li key={index}>
                                            <a href={resource} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                                {resource}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submission Form */}
                <div>
                    <div className="card">
                        <h3 className="mb-lg">Submit Your Work</h3>

                        {submission ? (
                            <div>
                                <div className={`alert ${submission.status === 'approved' ? 'alert-success' :
                                    submission.status === 'rejected' ? 'alert-error' :
                                        'alert-warning'
                                    }`}>
                                    <div className="flex items-center gap-md">
                                        {submission.status === 'approved' && <CheckCircle size={20} />}
                                        {submission.status === 'pending' && <Clock size={20} />}
                                        {submission.status === 'rejected' && <XCircle size={20} />}
                                        <div>
                                            <strong>
                                                {submission.status === 'approved' && 'Approved!'}
                                                {submission.status === 'pending' && 'Pending Review'}
                                                {submission.status === 'rejected' && 'Needs Revision'}
                                            </strong>
                                            {submission.feedback && (
                                                <p className="text-sm mt-sm">{submission.feedback}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-lg" style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="text-sm text-secondary mb-sm">Your submission:</p>
                                    <p>{submission.content}</p>
                                </div>

                                {submission.status === 'rejected' && (
                                    <button
                                        onClick={() => setSubmission(null)}
                                        className="btn btn-primary mt-lg"
                                        style={{ width: '100%' }}
                                    >
                                        Submit Again
                                    </button>
                                )}

                                {submission.status === 'approved' && (
                                    <button
                                        onClick={() => navigate(`/skills/${skillId}`)}
                                        className="btn btn-success mt-lg"
                                        style={{ width: '100%' }}
                                    >
                                        Next Challenge →
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {success && (
                                    <div className="alert alert-success mb-lg">
                                        <CheckCircle size={20} />
                                        Submission sent for review!
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Submission Type</label>
                                        <select
                                            className="form-select"
                                            value={submissionType}
                                            onChange={(e) => setSubmissionType(e.target.value)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="url">URL</option>
                                            <option value="image">Screenshot URL</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            {submissionType === 'text' && 'Your Answer'}
                                            {submissionType === 'url' && 'Project URL'}
                                            {submissionType === 'image' && 'Screenshot URL'}
                                        </label>
                                        <textarea
                                            className="form-textarea"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder={
                                                submissionType === 'text' ? 'Describe what you learned and created...' :
                                                    submissionType === 'url' ? 'https://...' :
                                                        'https://imgur.com/...'
                                            }
                                            required
                                            rows={6}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : (
                                            <>
                                                <Send size={20} />
                                                Submit Challenge
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Challenges;
