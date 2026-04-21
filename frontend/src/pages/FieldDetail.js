import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fieldAPI } from '../api';
import '../styles/FieldDetail.css';

export const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStage, setNewStage] = useState('');
  const [notes, setNotes] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadField();
  }, [id]);

  const loadField = async () => {
    try {
      const data = await fieldAPI.getField(id);
      setField(data);
      setNewStage(data.current_stage);
    } catch (err) {
      setError('Failed to load field');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fieldAPI.updateFieldStage(id, newStage, notes);
      if (response.field) {
        setField(response.field);
        setNotes('');
        alert('Field updated successfully!');
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError('Failed to update field');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="field-detail">Loading...</div>;
  if (error) return <div className="field-detail error">{error}</div>;
  if (!field) return <div className="field-detail">Field not found</div>;

  const stages = ['Planted', 'Growing', 'Ready', 'Harvested'];

  return (
    <div className="field-detail">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>{field.name}</h1>
      </div>

      <div className="detail-container">
        <div className="field-info">
          <div className="info-section">
            <h2>Field Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Crop Type:</label>
                <p>{field.crop_type}</p>
              </div>
              <div className="info-item">
                <label>Planting Date:</label>
                <p>{new Date(field.planting_date).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Current Stage:</label>
                <p>{field.current_stage}</p>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <p className={`status-badge status-${field.status.toLowerCase().replace(' ', '-')}`}>
                  {field.status}
                </p>
              </div>
            </div>
          </div>

          {(user.role === 'agent' || user.role === 'admin') && (
            <div className="update-section">
              <h2>Update Field Progress</h2>
              <form onSubmit={handleUpdateStage}>
                <div className="form-group">
                  <label>New Stage:</label>
                  <select value={newStage} onChange={(e) => setNewStage(e.target.value)}>
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes/Observations:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any observations or notes about the field..."
                    rows={4}
                  />
                </div>
                <button type="submit" disabled={updating} className="submit-btn">
                  {updating ? 'Updating...' : 'Update Field'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="updates-history">
          <h2>Update History</h2>
          {field.updates && field.updates.length > 0 ? (
            <div className="updates-list">
              {field.updates.map((update, idx) => (
                <div key={idx} className="update-item">
                  <div className="update-header">
                    <strong>{update.updated_stage}</strong>
                    <span className="update-date">
                      {new Date(update.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="update-agent">Updated by: {update.updated_by_name}</p>
                  {update.notes && <p className="update-notes">{update.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>No updates recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
