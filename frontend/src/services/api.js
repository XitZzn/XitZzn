const API_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  listProjects: () => request('/projects'),
  createProject: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
  getProject: (id) => request(`/projects/${id}`),
  getContent: (id) => request(`/projects/${id}/content`),
  getHistory: (id) => request(`/projects/${id}/history`),
  runAutomation: (id) => request(`/projects/${id}/run`, { method: 'POST' })
};
