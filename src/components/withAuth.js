// 인증이 필요한 페이지 컴포넌트를 감쌈, 로그인 페이지 리디렉션
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken || !refreshToken) {
            navigate('/login');
        }
    }, [navigate]);

    return null;
};

// withAuth 고차 컴포넌트 정의
const withAuth = (WrappedComponent) => {
    return (props) => {
        useAuth();
        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
