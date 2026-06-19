import axios from 'axios';

const fallbackApiUrl = 'http://localhost:5000/api';

const normalizedBaseUrl = (
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? fallbackApiUrl : '/api')
).replace(/\/+$/, '');

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

export default api;
