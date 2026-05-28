import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { updateProfile, loadUser, clearErrors } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setHeight(user.height || "");
      setWeight(user.weight || "");
      setFitnessGoal(user.fitnessGoal || "");
      setExperienceLevel(user.experienceLevel || "");
      setAvatarPreview(user.avatar?.url || "/profile.png");
    }
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (isUpdated) {
      alert.success("Profile updated successfully!");
      dispatch(loadUser());
      navigate("/account");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, alert, isUpdated, navigate, user]);

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("phone", phone);
    myForm.set("height", height);
    myForm.set("weight", weight);
    myForm.set("fitnessGoal", fitnessGoal);
    myForm.set("experienceLevel", experienceLevel);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Update Profile — GMS" />
      <div className="update-profile-container">
        <div className="update-profile-box">
          <h2>✏️ Update Profile</h2>
          <form onSubmit={updateProfileSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Fitness Goal</label>
              <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                <option value="">Select goal</option>
                <option>Weight Loss</option><option>Muscle Gain</option>
                <option>Flexibility</option><option>Endurance</option><option>General Fitness</option>
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                <option value="">Select level</option>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Profile Photo</label>
              <div className="avatar-input-row">
                <img src={avatarPreview} alt="avatar" className="avatar-preview" />
                <input type="file" accept="image/*" onChange={updateProfileDataChange} />
              </div>
            </div>
            <button type="submit" className="auth-btn">Update Profile</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
