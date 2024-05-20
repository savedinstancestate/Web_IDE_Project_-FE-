import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); 
    navigate('/login');
};

    const onShowUserInfo = () => {
        navigate('/UserInfo');
    };

    return (
        <header className="header">
            <nav className="header-nav">
                <button onClick={onShowUserInfo}>내 정보</button>
                <button onClick={handleLogout}>로그아웃</button>
            </nav>
        </header>
    );
};

export default Header;
