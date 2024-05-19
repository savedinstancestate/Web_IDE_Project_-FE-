// 인증이 필요한 페이지 컴포넌트를 감쌈, 로그인 페이지 리디렉션
import React from 'react';
import useAuth from "./useAuth";

// withAuth 고차 컴포넌트 정의
const withAuth = (WrappedComponent) => {
    return (props) => {
        useAuth();
        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
