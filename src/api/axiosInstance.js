import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '/api/user', // API의 기본 URL을 설정
  headers: { 'Content-Type': 'application/json' },
});

// 액세스 토큰을 로컬 스토리지에서 가져와 기본 헤더에 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 400) {
      Cookies.remove('refreshToken');
      localStorage.removeItem('accessToken');
      const navigate = useNavigate();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
