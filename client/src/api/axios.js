import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Proxy is used in package.json
});

instance.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
