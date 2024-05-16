import React, { useState } from 'react';
import axios from 'axios';
import './myPage.css';

const UserInfo = () => {
  const [nickname, setNickname] = useState('제로'); // 초기 닉네임
  const [newNickname, setNewNickname] = useState(''); // 새로운 닉네임 입력 상태
  const [error, setError] = useState(''); // 닉네임 오류 메시지 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지 상태
  const [oldPassword, setOldPassword] = useState(''); // 기존 비밀번호 상태
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태

  // 서버에서 닉네임 중복 확인
  const checkNicknameAvailability = async (nickname) => {
    try {
      const response = await axios.post('/api/nicknamecheck', { nickname });
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

  // 기존 비밀번호 확인
  const checkOldPassword = async (password) => {
    try {
      const response = await axios.post('/api/passwordcheck', { password });
      return response.status === 200;
    } catch (error) {
      console.error('Error checking old password:', error);
      return false;
    }
  };

  // 닉네임 변경 처리
  const handleNicknameChange = async () => {
    if (newNickname.trim() !== '') {
      const isAvailable = await checkNicknameAvailability(newNickname);
      if (isAvailable) {
        setNickname(newNickname);
        setNewNickname('');
        setError('');
        window.alert('닉네임이 성공적으로 변경되었습니다.');
      } else {
        setError('이미 존재하는 닉네임입니다.');
      }
    }
  };

  // 비밀번호 변경 처리
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const isOldPasswordCorrect = await checkOldPassword(oldPassword);
    if (isOldPasswordCorrect) {
      try {
        const response = await axios.post('/api/updatePassword', { newPassword });
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
        <p className="user-info-title">{nickname} 님의 회원정보</p>
        <h3>닉네임 변경</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="영문, 숫자, 한글 2~10자 입력"
            value={newNickname || nickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />
          <button className="nickname-change-button" onClick={handleNicknameChange}>확인</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <h3>비밀번호 변경</h3>
        <div className="input-group">
          <input
            type="password"
            placeholder="기존 비밀번호 입력"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /><br />
          <button className="password-change-button" onClick={handlePasswordChange}>확인</button>
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>
    </div>
  );
};

export default UserInfo;
