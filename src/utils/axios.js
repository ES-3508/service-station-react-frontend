import axios from 'axios';

// const axiosServices = axios.create({ baseURL: 'https://toucan-api.donext.org/' });
//  const axiosServices = axios.create({ baseURL: 'https://toucan-backend-nodejs-v2.vercel.app/' });
//const axiosServices = axios.create({ baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/' });
const axiosServices = axios.create({ baseURL: 'http://localhost:5000/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;
