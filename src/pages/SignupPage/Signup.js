import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import useForm from "../../hooks/useForm";
import "./Signup.css";

const Signup = () => {
  const { values, handleChange } = useForm({
    userId: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [userIdAvailable, setUserIdAvailable] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [userIdChecked, setUserIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [userIdDisabled, setUserIdDisabled] = useState(false);
  const [nicknameDisabled, setNicknameDisabled] = useState(false);

  const checkUserIdAvailability = async () => {
    try {
      const response = await axios.post(
        "/api/user/idcheck",
        { userId: values.userId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setUserIdAvailable(true);
        setUserIdChecked(true);
        setUserIdDisabled(true);
        alert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setUserIdAvailable(false);
        setUserIdChecked(true);
        alert('사용 불가능한 아이디입니다.');
      } else {
        console.error('아이디 사용 가능 여부를 확인하는 중 오류가 발생했습니다.: ', error);
        alert('오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const checkNicknameAvailability = async () => {
    try {
      const response = await axios.post(
        "/api/user/nicknamecheck",
        { nickname: values.nickname },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setNicknameAvailable(true);
        setNicknameChecked(true);
        setNicknameDisabled(true);
        alert('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setNicknameAvailable(false);
        setNicknameChecked(true);
        alert('사용 불가능한 닉네임입니다.');
      } else {
        console.error('닉네임 사용 가능 여부를 확인하는 중 오류가 발생했습니다.: ', error);
        alert('오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!userIdChecked || !nicknameChecked) {
      alert("아이디와 닉네임 중복확인을 완료해주세요.");
      return;
    }

    if (!userIdAvailable || !nicknameAvailable) {
      alert("아이디와 닉네임 중복확인을 완료해주세요.");
      return;
    }

    const { userId, nickname, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("api/user/signup",
        { userId, nickname, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        Cookies.set('refreshToken', response.data.refreshToken);
        console.log("회원가입 성공, 닉네임: " + response.data.nickname);
        navigate('/Home');
      } else {
        alert(`회원가입 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  };

  const fields = [
    { name: "userId", label: "아이디", placeholder: "영문, 숫자 4~15자 입력", checkDuplication: true, checkFunction: checkUserIdAvailability },
    { name: "nickname", label: "닉네임", placeholder: "영문, 숫자, 한글 2~10자 입력", checkDuplication: true, checkFunction: checkNicknameAvailability },
    { name: "password", label: "비밀번호", placeholder: "영문, 숫자, 특수문자 8~20자 입력" },
    { name: "confirmPassword", label: "비밀번호 확인", placeholder: "비밀번호 재입력" }
  ];

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="logo">
          <div className="logo-placeholder">Logo</div>
        </div>
        <h1>회원가입</h1>
        <p>Web IDE에 오신 것을 환영합니다!</p>
        {fields.map((field, index) => (
          <div className="signup-block" key={index}>
            <label className="signup-title">
              {field.label === "confirmPassword" ? "Confirm Password" : field.label}
            </label>
            <input
              type={field.name === "password" || field.name === "confirmPassword" ? "password" : "text"}
              className={`signup-input-field ${field.name === "userId" && userIdChecked && !userIdAvailable ? 'unavailable' : ''}`}
              placeholder={field.placeholder}
              name={field.name}
              value={values[field.name]}
              onChange={handleChange}
              autoComplete={field.name}
              autoFocus={index === 0}
              disabled={(field.name === "userId" && userIdDisabled) || (field.name === "nickname" && nicknameDisabled)}
            />
            {field.name === "userId" && userIdChecked && !userIdAvailable && <div className="error">이미 사용중인 아이디입니다.</div>}
            {field.name === "nickname" && nicknameChecked && !nicknameAvailable && <div className="error">이미 사용중인 닉네임입니다.</div>}
            {field.checkDuplication && (
              <button type="button" className="check-availability-button" onClick={field.checkFunction}>
                중복확인
              </button>
            )}
          </div>
        ))}
        <button type="submit" className="signup-button">확인</button>
      </form>
    </div>
  );
};

export default Signup;
