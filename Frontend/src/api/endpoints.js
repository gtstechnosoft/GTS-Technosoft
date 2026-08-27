import api from './client';

// Auth Endpoints
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  setupMfa: () => api.post('/auth/mfa/setup'),
  verifyMfa: (token) => api.post('/auth/mfa/verify', { token }),
  disableMfa: (password) => api.post('/auth/mfa/disable', { password })
};

// Organization Endpoints
export const orgApi = {
  getCurrent: () => api.get('/organizations/current'),
  updateCurrent: (data) => api.patch('/organizations/current', data),
  getUsers: () => api.get('/organizations/users'),
  inviteUser: (data) => api.post('/organizations/users', data),
  removeUser: (userId) => api.delete(`/organizations/users/${userId}`)
};

// Product & Catalog Endpoints
export const productApi = {
  getAll: () => api.get('/products'),
  getByCode: (code) => api.get(`/products/${code}`),
  getEditions: (productId) => api.get(`/products/${productId}/editions`),
  createProduct: (data) => api.post('/products', data),
  createEdition: (productId, data) => api.post(`/products/${productId}/editions`, data)
};

// Subscriptions & Entitlements
export const subscriptionApi = {
  getAll: (orgId) => api.get('/subscriptions', { params: { orgId } }),
  getEntitlements: (orgId) => api.get('/entitlements', { params: { orgId } }),
  create: (data) => api.post('/subscriptions', data)
};

// Licenses
export const licenseApi = {
  getAll: (orgId) => api.get('/licenses', { params: { orgId } }),
  getById: (id) => api.get(`/licenses/${id}`),
  downloadLic: (id) => api.get(`/licenses/${id}/download`, { responseType: 'blob' }),
  verifyPayload: (payload) => api.post('/licenses/verify', { payload }),
  issue: (data) => api.post('/licenses', data),
  revoke: (id, reason) => api.post(`/licenses/${id}/revoke`, { reason })
};

// Installations
export const installationApi = {
  getAll: (orgId) => api.get('/installations', { params: { orgId } }),
  register: (data) => api.post('/installations', data),
  sendHeartbeat: (id, data) => api.post(`/installations/${id}/heartbeat`, data),
  delete: (id) => api.delete(`/installations/${id}`)
};

// Releases & Signed Downloads
export const releaseApi = {
  getAll: (params) => api.get('/releases', { params }),
  getById: (id) => api.get(`/releases/${id}`),
  getDownloadToken: (id) => api.get(`/releases/${id}/download-token`),
  create: (data) => api.post('/releases', data)
};

// Trials
export const trialApi = {
  getAll: (orgId) => api.get('/trials', { params: { orgId } }),
  request: (data) => api.post('/trials/request', data),
  approve: (id, data) => api.post(`/trials/${id}/approve`, data),
  convert: (id) => api.post(`/trials/${id}/convert`)
};

// Support Cases
export const supportApi = {
  getAll: (orgId) => api.get('/support-cases', { params: { orgId } }),
  create: (data) => api.post('/support-cases', data),
  update: (id, data) => api.patch(`/support-cases/${id}`, data)
};

// Audit Logs
export const auditApi = {
  getAll: (params) => api.get('/audit-events', { params })
};

// Leads & Demo Requests
export const leadApi = {
  submit: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status })
};

// Admin Console Endpoints
export const adminApi = {
  getStats: () => api.get('/admin/dashboard-stats'),
  getOrgs: () => api.get('/admin/organizations'),
  createOrg: (data) => api.post('/admin/organizations', data),
  updateOrgStatus: (id, data) => api.patch(`/admin/organizations/${id}/status`, data)
};
