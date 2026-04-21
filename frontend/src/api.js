const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const authAPI = {
  register: async (name, email, password, role) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader()
    });
    return response.json();
  }
};

export const fieldAPI = {
  createField: async (name, cropType, plantingDate, agentId) => {
    const response = await fetch(`${API_BASE}/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name, cropType, plantingDate, agentId })
    });
    return response.json();
  },

  getAllFields: async () => {
    const response = await fetch(`${API_BASE}/fields`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  getMyFields: async () => {
    const response = await fetch(`${API_BASE}/fields/my-fields`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  getField: async (id) => {
    const response = await fetch(`${API_BASE}/fields/${id}`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  updateFieldStage: async (id, newStage, notes) => {
    const response = await fetch(`${API_BASE}/fields/${id}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ newStage, notes })
    });
    return response.json();
  },

  reassignField: async (id, agentId) => {
    const response = await fetch(`${API_BASE}/fields/${id}/reassign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ agentId })
    });
    return response.json();
  },

  deleteField: async (id) => {
    const response = await fetch(`${API_BASE}/fields/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return response.json();
  }
};

export const userAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  getAgents: async () => {
    const response = await fetch(`${API_BASE}/users/agents`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE}/users/dashboard/stats`, {
      headers: getAuthHeader()
    });
    return response.json();
  }
};
