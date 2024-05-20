import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import Cookies from 'js-cookie';
import useForm from '../../hooks/useForm';
import './Signup.css';

const Signup = () => {
    const [values, handleChange] = useForm({
        userId: '',
        nickname: '',
        password: '',
        confirmPassword: '',
    });

    const [userIdStatus, setUserIdStatus] = useState('unchecked');
    const [nicknameStatus, setNicknameStatus] = useState('unchecked');

    const checkUserIdAvailability = async () => {
        try {
            console.log('Checking userId availability:', values.userId);
            const response = await API.post(
                '/api/user/idcheck',
                { userId: values.userId },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                setUserIdStatus('available');
                alert('사용 가능한 아이디입니다.');
            } else {
                setUserIdStatus('unavailable');
            }
        } catch (error) {
            console.error('아이디 사용 가능 여부를 확인하는 중 오류가 발생했습니다.: ', error);
            setUserIdStatus('unavailable');
        }
    };

    const checkNicknameAvailability = async () => {
        try {
            console.log('Checking userId availability:', values.nickname);
            const response = await API.post(
                '/api/user/nicknamecheck',
                { nickname: values.nickname },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                setNicknameStatus('available');
                alert('사용 가능한 닉네임입니다.');
            } else {
                setNicknameStatus('unavailable');
            }
        } catch (error) {
            console.error('닉네임 사용 가능 여부를 확인하는 중 오류가 발생했습니다.: ', error);
            setNicknameStatus('unavailable');
        }
    };

    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (userIdStatus !== 'available' || nicknameStatus !== 'available') {
            alert('사용 가능한 아이디와 닉네임을 입력해 주세요.');
            return;
        }

        const { userId, nickname, password, confirmPassword } = values;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await API.post(
                '/api/user/signup',
                { userId, nickname, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data.accessToken);
                Cookies.set('refreshToken', response.data.refreshToken);
                console.log('회원가입 성공, 닉네임: ' + response.data.nickname);
                navigate('/');
            } else {
                alert('오류가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                <div className="logo">
                    <img className="signup-icon" alt="icon" src="img/Als_web_ide_icon.png" />
                </div>
                <h1>회원가입</h1>
                <p>Web IDE에 오신 것을 환영합니다!</p>
                <div className="signup-block">
                    <label className="signup-title">아이디</label>
                    <input
                        type="text"
                        className={`signup-input-field ${userIdStatus === 'unavailable' ? 'unavailable' : ''}`}
                        placeholder="영문, 숫자 4~15자 입력"
                        name="userId"
                        value={values.userId}
                        onChange={handleChange}
                        autoComplete="userId"
                        autoFocus
                    />
                    {userIdStatus === 'unavailable' && <div className="error">사용 불가능한 아이디입니다.</div>}
                    <button type="button" className="check-availability-button" onClick={checkUserIdAvailability}>
                        중복확인
                    </button>
                </div>
                <div className="signup-block">
                    <label className="signup-title">닉네임</label>
                    <input
                        type="text"
                        className={`signup-input-field ${nicknameStatus === 'unavailable' ? 'unavailable' : ''}`}
                        placeholder="영문, 숫자, 한글 2~10자 입력"
                        name="nickname"
                        value={values.nickname}
                        onChange={handleChange}
                        autoComplete="nickname"
                    />
                    {nicknameStatus === 'unavailable' && <div className="error">사용 불가능한 닉네임입니다.</div>}
                    <button type="button" className="check-availability-button" onClick={checkNicknameAvailability}>
                        중복확인
                    </button>
                </div>
                <div className="signup-block">
                    <label className="signup-title">비밀번호</label>
                    <input
                        type="password"
                        className="signup-input-field"
                        placeholder="영문, 숫자, 특수문자 8~20자 입력"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </div>
                <div className="signup-block">
                    <label className="signup-title">비밀번호 확인</label>
                    <input
                        type="password"
                        className="signup-input-field"
                        placeholder="비밀번호 재입력"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </div>
                <button type="submit" className="signup-button">
                    확인
                </button>
            </form>
        </div>
    );
};

export default Signup;
