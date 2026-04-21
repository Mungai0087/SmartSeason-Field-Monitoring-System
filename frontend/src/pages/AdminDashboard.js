import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, fieldAPI } from '../api';
import '../styles/Dashboard.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="dashboard">Loading...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!stats) return <div className="dashboard">No data available</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">SmartSeason - Admin Dashboard</div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Fields</h3>
            <p className="stat-value">{stats.totalFields}</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p className="stat-value status-active">{stats.statusBreakdown.active}</p>
          </div>
          <div className="stat-card">
            <h3>At Risk</h3>
            <p className="stat-value status-risk">{stats.statusBreakdown.atRisk}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value status-completed">{stats.statusBreakdown.completed}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Field Stages Breakdown</h2>
          <div className="stage-breakdown">
            <div className="stage-item">
              <span>Planted:</span>
              <strong>{stats.stageBreakdown.planted}</strong>
            </div>
            <div className="stage-item">
              <span>Growing:</span>
              <strong>{stats.stageBreakdown.growing}</strong>
            </div>
            <div className="stage-item">
              <span>Ready:</span>
              <strong>{stats.stageBreakdown.ready}</strong>
            </div>
            <div className="stage-item">
              <span>Harvested:</span>
              <strong>{stats.stageBreakdown.harvested}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Actions</h2>
          <div className="actions">
            <button onClick={() => navigate('/admin/fields')} className="action-btn">
              Manage Fields
            </button>
            <button onClick={() => navigate('/admin/create-field')} className="action-btn primary">
              Create New Field
            </button>
          </div>
        </div>

        <div className="fields-list">
          <h2>All Fields</h2>
          {stats.fields.length === 0 ? (
            <p>No fields found</p>
          ) : (
            <div className="fields-grid">
              {stats.fields.map(field => (
                <div key={field.id} className="field-card">
                  <div className="field-header">
                    <h3>{field.name}</h3>
                    <span className={`status-badge status-${field.status.toLowerCase().replace(' ', '-')}`}>
                      {field.status}
                    </span>
                  </div>
                  <p><strong>Crop:</strong> {field.crop_type}</p>
                  <p><strong>Agent:</strong> {field.agent_name}</p>
                  <p><strong>Stage:</strong> {field.current_stage}</p>
                  <p><strong>Planted:</strong> {new Date(field.planting_date).toLocaleDateString()}</p>
                  <button
                    onClick={() => navigate(`/admin/fields/${field.id}`)}
                    className="view-btn"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
