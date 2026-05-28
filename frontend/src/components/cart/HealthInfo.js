import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import "./HealthInfo.css";

const HealthInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [height, setHeight] = useState(shippingInfo.height || "");
  const [weight, setWeight] = useState(shippingInfo.weight || "");
  const [fitnessGoal, setFitnessGoal] = useState(shippingInfo.fitnessGoal || "");
  const [experienceLevel, setExperienceLevel] = useState(shippingInfo.experienceLevel || "");
  const [phone, setPhone] = useState(shippingInfo.phone || "");
  const [membershipPlan, setMembershipPlan] = useState(shippingInfo.membershipPlan || "Basic");
  const [duration, setDuration] = useState(shippingInfo.duration || 1);

  const healthInfoSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo({ height, weight, fitnessGoal, experienceLevel, phone, membershipPlan, duration }));
    navigate("/membership/confirm");
  };

  return (
    <>
      <MetaData title="Health Info — GMS" />
      <CheckoutSteps activeStep={0} />
      <div className="health-info-container">
        <div className="health-info-box">
          <h2>💪 Your Health Info</h2>
          <p className="health-info-sub">Help us personalize your fitness journey</p>
          <form onSubmit={healthInfoSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Height (cm) *</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" required />
              </div>
              <div className="form-group">
                <label>Weight (kg) *</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" required />
              </div>
            </div>
            <div className="form-group">
              <label>Fitness Goal *</label>
              <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} required>
                <option value="">Select your goal</option>
                <option>Weight Loss</option><option>Muscle Gain</option>
                <option>Flexibility</option><option>Endurance</option><option>General Fitness</option>
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level *</label>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} required>
                <option value="">Select level</option>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977-9800000000" required />
            </div>
            <div className="form-group">
              <label>Membership Plan *</label>
              <select value={membershipPlan} onChange={(e) => setMembershipPlan(e.target.value)} required>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} required>
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
            <button type="submit" className="health-submit-btn">
              Continue to Confirm →
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HealthInfo;
