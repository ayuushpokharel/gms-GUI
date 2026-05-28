import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { getTrainerPortal, clearErrors } from "../../actions/userAction";
import "./TrainerPortal.css";

const TrainerPortal = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user } = useSelector((state) => state.user);
  const { loading, error, classes } = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getTrainerPortal());
  }, [dispatch, error, alert]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Trainer Portal — GMS" />
      <div className="trainer-portal">
        <div className="portal-header">
          <div className="portal-header-left">
            <img
              src={user?.avatar?.url || "/profile.png"}
              alt="trainer"
              className="portal-avatar"
            />
            <div>
              <h1>Welcome, {user?.name}!</h1>
              <p>
                {user?.specialization || "Trainer"} ·{" "}
                {user?.experience ? `${user.experience} yrs exp` : ""}
              </p>
            </div>
          </div>
          <div className="portal-stats">
            <div className="portal-stat">
              <h3>{classes?.length || 0}</h3>
              <p>Assigned Classes</p>
            </div>
          </div>
        </div>

        {user?.bio && (
          <div className="portal-bio">
            <p>"{user.bio}"</p>
          </div>
        )}

        <h2 className="portal-section-title">📅 Your Classes</h2>

        {classes && classes.length > 0 ? (
          <div className="portal-classes-grid">
            {classes.map((gymClass) => (
              <div key={gymClass._id} className="portal-class-card">
                <div className="portal-class-img-wrap">
                  <img
                    src={gymClass.images?.[0]?.url || "/placeholder.jpg"}
                    alt={gymClass.name}
                    className="portal-class-img"
                  />
                  <span className="portal-class-category">
                    {gymClass.category}
                  </span>
                </div>
                <div className="portal-class-body">
                  <h3>{gymClass.name}</h3>
                  <div className="portal-class-meta">
                    <span>📅 {gymClass.schedule?.day}</span>
                    <span>🕐 {gymClass.schedule?.time}</span>
                    <span>⏱ {gymClass.schedule?.duration} min</span>
                  </div>
                  <div className="portal-capacity-bar">
                    <div className="capacity-label">
                      <span>Capacity</span>
                      <strong>{gymClass.capacity} slots left</strong>
                    </div>
                    <div className="capacity-track">
                      <div
                        className="capacity-fill"
                        style={{
                          width: `${Math.min(100, ((20 - gymClass.capacity) / 20) * 100)}%`,
                          background:
                            gymClass.capacity <= 5 ? "#E63946" : "#4CAF50",
                        }}
                      />
                    </div>
                  </div>
                  <div className="portal-class-footer">
                    <span className="portal-price">
                      Rs. {gymClass.price?.toLocaleString()}/month
                    </span>
                    <span
                      className={`req-badge ${gymClass.requiredMembership?.toLowerCase()}`}
                    >
                      {gymClass.requiredMembership}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="portal-empty">
            <p>
              😔 No classes assigned yet. Contact admin to get assigned to
              classes.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TrainerPortal;
