import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fieldAPI, userAPI } from '../api';
import '../styles/CreateField.css';

export const CreateField = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    plantingDate: '',
    agentId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await userAPI.getAgents();
      setAgents(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, agentId: data[0].id }));
      }
    } catch (err) {
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.cropType || !formData.plantingDate || !formData.agentId) {
      setError('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fieldAPI.createField(
        formData.name,
        formData.cropType,
        formData.plantingDate,
        parseInt(formData.agentId)
      );

      if (response.field) {
        alert('Field created successfully!');
        navigate('/admin/fields');
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="create-field">Loading...</div>;

  return (
    <div className="create-field">
      <div className="form-container">
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <h1>Create New Field</h1>
        </div>

        <form onSubmit={handleSubmit} className="field-form">
          <div className="form-group">
            <label htmlFor="name">Field Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., North Field A"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cropType">Crop Type *</label>
            <input
              id="cropType"
              type="text"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              placeholder="e.g., Maize, Wheat, Rice"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plantingDate">Planting Date *</label>
            <input
              id="plantingDate"
              type="date"
              name="plantingDate"
              value={formData.plantingDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="agentId">Assign to Agent *</label>
            {agents.length > 0 ? (
              <select
                id="agentId"
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                required
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="no-agents">No agents available. Please create agents first.</p>
            )}
          </div>

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button type="submit" disabled={submitting || agents.length === 0} className="submit-btn">
              {submitting ? 'Creating...' : 'Create Field'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
