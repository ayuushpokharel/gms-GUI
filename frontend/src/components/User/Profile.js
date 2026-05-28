import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { calculateBMI, getBMICategory } from "../../utils/bmiCalculator";
import "./Profile.css";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  const bmi = user?.height && user?.weight
    ? calculateBMI(user.weight, user.height)
    : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <>
      <MetaData title="My Profile — GMS" />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={user?.avatar?.url || "/profile.png"}
              alt="profile"
              className="profile-avatar"
            />
            <div>
              <h2>{user?.name}</h2>
              <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            </div>
          </div>

          <div className="profile-info">
            <div className="info-row"><span>Email</span><strong>{user?.email}</strong></div>
            {user?.phone && <div className="info-row"><span>Phone</span><strong>{user.phone}</strong></div>}
            <div className="info-row"><span>Joined</span><strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</strong></div>
          </div>

          {/* Membership Info */}
          <div className="profile-section">
            <h3>💳 Membership</h3>
            <div className="info-row">
              <span>Plan</span>
              <strong className={`plan-${user?.membershipType?.toLowerCase()}`}>
                {user?.membershipType || "None"}
              </strong>
            </div>
            {user?.membershipExpiry && (
              <div className="info-row">
                <span>Expires</span>
                <strong>{new Date(user.membershipExpiry).toLocaleDateString()}</strong>
              </div>
            )}
          </div>

          {/* Fitness Info */}
          {(user?.height || user?.weight || user?.fitnessGoal || user?.experienceLevel) && (
            <div className="profile-section">
              <h3>💪 Fitness Info</h3>
              {user.height && <div className="info-row"><span>Height</span><strong>{user.height} cm</strong></div>}
              {user.weight && <div className="info-row"><span>Weight</span><strong>{user.weight} kg</strong></div>}
              {user.fitnessGoal && <div className="info-row"><span>Goal</span><strong>{user.fitnessGoal}</strong></div>}
              {user.experienceLevel && <div className="info-row"><span>Level</span><strong>{user.experienceLevel}</strong></div>}
            </div>
          )}

          {/* BMI Section */}
          {bmi && (
            <div className="profile-section bmi-section">
              <h3>📊 BMI Calculator</h3>
              <div className="bmi-display">
                <div className="bmi-number" style={{ color: bmiCategory.color }}>
                  {bmi}
                </div>
                <div>
                  <span className="bmi-badge" style={{ background: bmiCategory.color }}>
                    {bmiCategory.label}
                  </span>
                  <p className="bmi-formula">Weight: {user.weight}kg / Height: {user.height}cm</p>
                </div>
              </div>
              <div className="bmi-scale">
                <div className="bmi-range underweight">Underweight<br/>&lt;18.5</div>
                <div className="bmi-range normal">Normal<br/>18.5–24.9</div>
                <div className="bmi-range overweight">Overweight<br/>25–29.9</div>
                <div className="bmi-range obese">Obese<br/>≥30</div>
              </div>
            </div>
          )}

          {/* Trainer Info */}
          {user?.role === "trainer" && (
            <div className="profile-section">
              <h3>🏅 Trainer Details</h3>
              {user.specialization && <div className="info-row"><span>Specialization</span><strong>{user.specialization}</strong></div>}
              {user.experience && <div className="info-row"><span>Experience</span><strong>{user.experience} years</strong></div>}
              {user.bio && <p className="trainer-bio">{user.bio}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="profile-actions">
            <Link to="/profile/update" className="profile-btn primary">Edit Profile</Link>
            <Link to="/password/update" className="profile-btn secondary">Change Password</Link>
            <Link to="/memberships" className="profile-btn secondary">My Memberships</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
