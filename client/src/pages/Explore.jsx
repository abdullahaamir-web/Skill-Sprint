import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';

const Explore = () => {
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        filterSkills();
    }, [searchTerm, difficultyFilter, skills]);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/skills');
            setSkills(response.data);
            setFilteredSkills(response.data);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterSkills = () => {
        let filtered = skills;

        if (searchTerm) {
            filtered = filtered.filter(skill =>
                skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                skill.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (difficultyFilter) {
            filtered = filtered.filter(skill => skill.difficulty === difficultyFilter);
        }

        setFilteredSkills(filtered);
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
                <h1>Explore Skills</h1>
                <p>Discover and master new skills through interactive challenges</p>
            </div>

            {/* Filters */}
            <div className="card mb-xl">
                <div className="grid grid-2">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <Filter size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <select
                                className="form-select"
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                style={{ paddingLeft: '3rem' }}
                            >
                                <option value="">All Difficulties</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Grid */}
            {filteredSkills.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3>No skills found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-3">
                    {filteredSkills.map(skill => (
                        <Link to={`/skills/${skill.id}`} key={skill.id} className="card skill-card">
                            <div className="skill-icon">{skill.icon}</div>
                            <h3 className="skill-title">{skill.title}</h3>
                            <p className="skill-description">{skill.description}</p>
                            <div className="mb-md">
                                <div className="flex justify-between text-sm text-secondary mb-sm">
                                    <span>Estimated Time</span>
                                    <span>{skill.estimatedTime}</span>
                                </div>
                            </div>
                            <div className="skill-meta">
                                <span className={`badge badge-${skill.difficulty === 'Beginner' ? 'success' : skill.difficulty === 'Intermediate' ? 'warning' : 'error'}`}>
                                    {skill.difficulty}
                                </span>
                                <span className="text-secondary">{skill.totalChallenges} challenges</span>
                            </div>
                            <div className="mt-sm text-sm text-secondary">
                                👥 {skill.enrolledCount} enrolled
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Explore;
