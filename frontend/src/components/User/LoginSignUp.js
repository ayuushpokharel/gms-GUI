import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { login, register, clearErrors } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import "./LoginSignUp.css";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector((state) => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "", email: "", password: "",
    phone: "", height: "", weight: "",
    fitnessGoal: "", experienceLevel: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    Object.entries(user).forEach(([k, v]) => myForm.set(k, v));
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (isAuthenticated) navigate("/account");
  }, [dispatch, error, alert, isAuthenticated, navigate]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToLeft");
      switcherTab.current.classList.remove("shiftToRight");
      registerTab.current.classList.remove("shiftToLeft");
      loginTab.current.classList.remove("shiftToRight");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToLeft");
      registerTab.current.classList.add("shiftToLeft");
      loginTab.current.classList.add("shiftToRight");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Login / Register — GMS" />
      <div className="login-signup-container">
        <div className="login-signup-box">
          <div className="login-signup-toggle">
            <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
            <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
          </div>
          <button ref={switcherTab} className="login-signup-switcher"></button>

          {/* Login */}
          <form className="login-form" ref={loginTab} onSubmit={loginSubmit}>
            <h2>🏋️ Welcome Back</h2>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" required
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" required
                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <a href="/password/forgot" className="forgot-link">Forgot Password?</a>
            <button type="submit" className="auth-btn">Login</button>
          </form>

          {/* Register */}
          <form className="register-form" ref={registerTab} encType="multipart/form-data" onSubmit={registerSubmit}>
            <h2>🏋️ Create Account</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" required
                value={user.name} onChange={registerDataChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="your@email.com" required
                value={user.email} onChange={registerDataChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min 8 characters" required
                value={user.password} onChange={registerDataChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" placeholder="+977-9800000000"
                  value={user.phone} onChange={registerDataChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" name="height" placeholder="170"
                  value={user.height} onChange={registerDataChange} />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" name="weight" placeholder="65"
                  value={user.weight} onChange={registerDataChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Fitness Goal</label>
              <select name="fitnessGoal" value={user.fitnessGoal} onChange={registerDataChange}>
                <option value="">Select a goal</option>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Flexibility</option>
                <option>Endurance</option>
                <option>General Fitness</option>
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select name="experienceLevel" value={user.experienceLevel} onChange={registerDataChange}>
                <option value="">Select level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="form-group avatar-group">
              <label>Profile Photo</label>
              <div className="avatar-input-row">
                <img src={avatarPreview} alt="avatar preview" className="avatar-preview" />
                <input type="file" name="avatar" accept="image/*" onChange={registerDataChange} />
              </div>
            </div>
            <button type="submit" className="auth-btn">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginSignUp;
