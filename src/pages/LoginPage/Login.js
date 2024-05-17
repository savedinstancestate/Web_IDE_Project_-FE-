import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import useForm from "../../hooks/useForm";
import "./Login.css";

const Panel = () => {
  return (
    <div className="panel">
      <div className="icon-box">
        <div className="icon">Icon</div>
      </div>
      <div className="title">Web IDE</div>
      <p className="description">
        어디서든 코딩, 언제든 협업.
        <br />
        간편하고 효율적인 개발 환경을 경험하세요!
      </p>
    </div>
  );
};

const LoginContainer = ({
  userId,
  password,
  loginCheck,
  handleLogin,
  loading,
  navigateToSignup,
  handleInputChange
}) => (
  <form className="login-form" onSubmit={handleLogin}>
    <div className="logo-box">
      <div className="logo"></div>
    </div>

    <div className="login-title">로그인</div>
    <input
      type="text"
      id="userId"
      name="userId"
      value={userId}
      className="login-input-field"
      onChange={handleInputChange}
      placeholder="아이디를 입력하세요."
      autoFocus
    />

    <input
      type="password"
      id="password"
      name="password"
      value={password}
      className="login-input-field"
      onChange={handleInputChange}
      placeholder="비밀번호를 입력하세요."
    />

    {loginCheck && (
      <label style={{ color: "red" }}>아이디 혹은 비밀번호가 틀렸습니다.</label>
    )}

    <div className="signup-div">
      계정이 없으신가요?
      <span className="signup-link" onClick={navigateToSignup}>
        회원가입
      </span>
    </div>

    <button type="submit" className="login-button" disabled={loading}>
      확인
    </button>
  </form>
);

const Login = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formValues, handleInputChange] = useForm({ userId: "", password: "" });

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("api/user/login", formValues, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setLoginCheck(false);
        localStorage.setItem("accessToken", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);
        console.log("로그인 성공, 아이디:" + formValues.userId);
        navigate("/project");
      } else {
        setLoginCheck(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginCheck(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Panel />
      <LoginContainer
        userId={formValues.userId}
        password={formValues.password}
        loginCheck={loginCheck}
        handleLogin={handleLogin}
        loading={loading}
        navigateToSignup={() => navigate('/signup')}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};
export default Login;
