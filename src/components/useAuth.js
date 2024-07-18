import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import refreshAccessToken from '../api/refreshAccessToken'; // 가져오기
import Cookies from 'js-cookie';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken && !refreshToken) {
            navigate('/login');
        } else if (!accessToken && refreshToken) {
            // refreshAccessToken을 호출하여 토큰 갱신 시도
            refreshAccessToken().catch(() => navigate('/login'));
        } else if (accessToken && !refreshToken) {
            // 액세스 토큰은 있지만 리프레시 토큰이 없는 경우
            localStorage.removeItem('accessToken');
            navigate('/login');
        }
    }, [navigate]);

    return null;
};

export default useAuth;
