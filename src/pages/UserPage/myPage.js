import React, { useState, useEffect } from 'react';
//import withAuth from '../../components/withAuth';
import './myPage.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserInfo = () => {
    const [nickname, setNickname] = useState(''); // 초기화 없이 빈 문자열로 시작
    const [newNickname, setNewNickname] = useState('');
    const [userId, setUserId] = useState(''); // 사용자 ID 저장
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 사용자 정보를 불러오는 함수
    useEffect(() => {
        const fetchUserInfo = async () => {
            console.info("토큰 정보는 " + localStorage.getItem('accessToken'));
            console.info("쿠키에 든 정보는 " + Cookies.get('refreshToken'));
            try {
                // 토큰을 포함한 API 요청으로 사용자 정보 불러오기
                const { data } = await axios.get('/api/user/mypage', {
                    headers: {
                        Authorization: `${localStorage.getItem('accessToken')}`, // 로컬 스토리지에서 토큰 가져오기
                    },
                });
                console.log(data);
                setNickname(data.nickName); // 받아온 닉네임으로 상태 업데이트
                setUserId(data.userId); // 받아온 사용자 ID로 상태 업데이트
            } catch (error) {
                console.error('사용자 정보 불러오기 실패:', error);
            }
        };
        fetchUserInfo();
    }, []);

    // 서버에서 닉네임 중복 확인
    const checkNicknameAvailability = async (nickname) => {
        try {
            const response = await axios.post('/api/user/nicknamecheck', {userNickName: nickname },{
                headers: {
                    Authorization: `${localStorage.getItem('accessToken')}`, // 로컬 스토리지에서 토큰 가져오기
                },
            });
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking nickname availability:', error);
            return false;
        }
    };

    const handleNicknameChange = async () => {
        if (newNickname.trim() !== '') {
            const isAvailable = await checkNicknameAvailability(newNickname);
            if (isAvailable) {
                try {
                    const response = await axios.put('/api/user/nicknamecheck', {userNickName :newNickname },{
                        headers: {
                            Authorization: `${localStorage.getItem('accessToken')}`, // 로컬 스토리지에서 토큰 가져오기
                        },
                    });
                    if (response.status === 200) {
                        setNickname(newNickname);
                        setNewNickname('');
                        setError('');
                        window.alert('닉네임이 성공적으로 변경되었습니다.');
                    } else {
                        setError('닉네임 변경 실패');
                    }
                } catch (error) {
                    console.error('Error updating nickname:', error);
                    setError('닉네임 변경 중 오류가 발생했습니다.');
                }
            } else {
                setError('닉네임 변경 중 오류가 발생했습니다.');
            }
        }
    };

    // 서버에서 기존 비밀번호 확인
    const checkOldPassword = async (password) => {
        try {
            const response = await axios.post('/api/user/passwordcheck', {userPassword: password },{
                headers: {
                        Authorization: `${localStorage.getItem('accessToken')}`, // 로컬 스토리지에서 토큰 가져오기
                },
            });
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking old password:', error);
            return false;
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        const isOldPasswordCorrect = await checkOldPassword(oldPassword);
        if (isOldPasswordCorrect) {
            try {
                const response = await axios.put('/api/user/passwordcheck', { userPassword :newPassword },{
                    headers: {
                        Authorization: `${localStorage.getItem('accessToken')}`, // 로컬 스토리지에서 토큰 가져오기
                    },
                });
                if (response.status === 200) {
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                    window.alert('비밀번호가 변경되었습니다.');
                } else {
                    setPasswordError('비밀번호 변경에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error updating password:', error);
                setPasswordError('비밀번호 변경 중 오류가 발생했습니다.');
            }
        } else {
            setPasswordError('기존 비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className="user-info-container">
            <div className="user-info-form">
                <p className="user-info-title">{userId} 님의 회원정보</p>
                <h3>닉네임 변경</h3>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="영문, 숫자, 한글 2~10자 입력"
                        value={newNickname || nickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                    />
                    <button className="nickname-change-button" onClick={() => handleNicknameChange(newNickname)}>
                        확인
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                <h3>비밀번호 변경</h3>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="기존 비밀번호 입력"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="새 비밀번호 입력"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <br />
                    <button className="password-change-button" onClick={handlePasswordChange}>
                        확인
                    </button>
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
        </div>
    );
};

export default UserInfo;
