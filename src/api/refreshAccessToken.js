import axiosInstance from './axiosInstance';
import Cookies from 'js-cookie';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axiosInstance.post('/api/user/refreshToken', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    Cookies.set('refreshToken', newRefreshToken);
    return accessToken;
  } catch (error) {
    Cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    history.push('/login');
    throw error;
  }
};

export default refreshAccessToken;
