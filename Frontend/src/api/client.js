import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gts_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('gts_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/refresh`,
            { refreshToken }
          );

          if (res.data?.success && res.data?.data?.accessToken) {
            localStorage.setItem('gts_access_token', res.data.data.accessToken);
            localStorage.setItem('gts_refresh_token', res.data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('gts_access_token');
          localStorage.removeItem('gts_refresh_token');
          localStorage.removeItem('gts_user');
          if (window.location.pathname.startsWith('/portal') || window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login?expired=1';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
