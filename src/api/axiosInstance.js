// 모든 API 요청을 중앙에서 관리
import axios from 'axios';
import Cookies from 'js-cookie';
import { createBrowserHistory } from 'history';
import refreshAccessToken from './refreshAccessToken';

const history = createBrowserHistory();

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '/api/user', 
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: 액세스 토큰을 기본 헤더에 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  // Promise: js에서 비동기 작업을 처리하기 위한 객체
  (error) => Promise.reject(error) 
);

// 응답 인터셉터: 에러 처리, 인증 오류 발생 시 토큰 갱신 및 재요청
axiosInstance.interceptors.response.use(
  (response) => response, // 응답이 성공적일 때 그대로 반환

  async (error) => {
    const originalRequest = error.config; // 기존 요청
    
    // 400 오류 or 기존 요청이 다시 시도되지 않았다면
    if (error.response && error.response.status === 400 && !originalRequest._retry) {
      originalRequest._retry = true; // 기존 요청 객체에 다시 시도 플래그 설정
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // 기존 요청 다시 시도
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response && error.response.status === 400) {
      Cookies.remove('refreshToken');
      localStorage.removeItem('accessToken');
      history.push('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
