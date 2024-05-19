import React from 'react';
import './Header.css';

const Header = ({ onLogout, onShowUserInfo }) => {
    return (
        <header className="header">
            <nav className="header-nav">
                <button onClick={onShowUserInfo}>내 정보</button>
                <button onClick={onLogout}>로그아웃</button>
            </nav>
        </header>
    );
};

export default Header;
