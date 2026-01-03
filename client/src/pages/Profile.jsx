import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Save, X } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            await updateProfile(formData);
            setSuccess(true);
            setEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            bio: user?.bio || '',
            avatar: user?.avatar || ''
        });
        setEditing(false);
    };

    return (
        <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="card">
                <div className="flex justify-between items-center mb-xl">
                    <h1>My Profile</h1>
                    {!editing && (
                        <button onClick={() => setEditing(true)} className="btn btn-primary btn-sm">
                            <Edit2 size={16} />
                            Edit Profile
                        </button>
                    )}
                </div>

                {success && (
                    <div className="alert alert-success mb-lg">
                        Profile updated successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-lg mb-xl">
                        <img
                            src={formData.avatar || user?.avatar}
                            alt={formData.name || user?.name}
                            className="avatar-lg"
                            style={{ width: '120px', height: '120px' }}
                        />
                        <div style={{ flex: 1 }}>
                            {editing ? (
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Avatar URL</label>
                                    <input
                                        type="url"
                                        name="avatar"
                                        className="form-input"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2>{user?.name}</h2>
                                    <p className="text-secondary">{user?.email}</p>
                                    <span className={`badge ${user?.role === 'admin' ? 'badge-error' : 'badge-primary'}`}>
                                        {user?.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Name</label>
                        {editing ? (
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <p>{user?.name}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        {editing ? (
                            <textarea
                                name="bio"
                                className="form-textarea"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        ) : (
                            <p>{user?.bio || 'No bio yet'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <p className="text-secondary">{user?.email}</p>
                    </div>

                    <div className="grid grid-3 mb-lg">
                        <div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="stat-value" style={{ fontSize: '2rem' }}>{user?.points || 0}</div>
                            <div className="stat-label">Total Points</div>
                        </div>
                        <div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="stat-value" style={{ fontSize: '2rem' }}>{user?.streak || 0}</div>
                            <div className="stat-label">Day Streak</div>
                        </div>
                        <div className="card text-center" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="stat-value" style={{ fontSize: '2rem' }}>
                                {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                            <div className="stat-label">Member Since</div>
                        </div>
                    </div>

                    {editing && (
                        <div className="flex gap-md">
                            <button type="submit" className="btn btn-success" disabled={saving}>
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                <X size={20} />
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
