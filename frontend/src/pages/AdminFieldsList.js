import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fieldAPI } from '../api';
import '../styles/FieldsList.css';

export const AdminFieldsList = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const data = await fieldAPI.getAllFields();
      setFields(data);
    } catch (err) {
      setError('Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await fieldAPI.deleteField(id);
        setFields(fields.filter(f => f.id !== id));
        alert('Field deleted successfully');
      } catch (err) {
        alert('Failed to delete field');
      }
    }
  };

  const filteredFields = filter === 'all'
    ? fields
    : fields.filter(f => f.status === filter);

  if (loading) return <div className="fields-list">Loading...</div>;
  if (error) return <div className="fields-list error">{error}</div>;

  return (
    <div className="fields-list">
      <div className="list-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>All Fields</h1>
        <button
          onClick={() => navigate('/admin/create-field')}
          className="create-btn"
        >
          + Create Field
        </button>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({fields.length})
        </button>
        <button
          className={`filter-btn ${filter === 'Active' ? 'active' : ''}`}
          onClick={() => setFilter('Active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'At Risk' ? 'active' : ''}`}
          onClick={() => setFilter('At Risk')}
        >
          At Risk
        </button>
        <button
          className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
      </div>

      {filteredFields.length === 0 ? (
        <p className="no-fields">No fields found</p>
      ) : (
        <div className="fields-table-container">
          <table className="fields-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Crop</th>
                <th>Agent</th>
                <th>Stage</th>
                <th>Planted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map(field => (
                <tr key={field.id}>
                  <td>{field.name}</td>
                  <td>{field.crop_type}</td>
                  <td>{field.agent_name}</td>
                  <td>{field.current_stage}</td>
                  <td>{new Date(field.planting_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${field.status.toLowerCase().replace(' ', '-')}`}>
                      {field.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/admin/fields/${field.id}`)}
                      className="action-link view"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(field.id)}
                      className="action-link delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
