import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { getMembershipDetails, clearErrors } from "../../actions/membershipAction";
import "./MembershipDetails.css";

const MembershipDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, membership } = useSelector((state) => state.membershipDetail);

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    dispatch(getMembershipDetails(id));
  }, [dispatch, id, error, alert]);

  if (loading) return <Loader />;
  if (!membership) return null;

  const statusClass = membership.membershipStatus?.toLowerCase();

  return (
    <>
      <MetaData title={`Membership #${membership._id} — GMS`} />
      <div className="membership-details">
        <div className="details-header">
          <div>
            <h1>Membership Details</h1>
            <p className="details-id">#{membership._id}</p>
          </div>
          <span className={`status-badge status-${statusClass}`}>
            {membership.membershipStatus}
          </span>
        </div>

        <div className="details-grid">
          {/* Health Info */}
          <div className="details-card">
            <h3>💪 Health Info</h3>
            <div className="info-list">
              <div><span>Height</span><strong>{membership.healthInfo?.height} cm</strong></div>
              <div><span>Weight</span><strong>{membership.healthInfo?.weight} kg</strong></div>
              <div><span>Fitness Goal</span><strong>{membership.healthInfo?.fitnessGoal}</strong></div>
              <div><span>Experience</span><strong>{membership.healthInfo?.experienceLevel}</strong></div>
              <div><span>Phone</span><strong>{membership.healthInfo?.phone}</strong></div>
            </div>
          </div>

          {/* Membership Info */}
          <div className="details-card">
            <h3>📋 Membership Info</h3>
            <div className="info-list">
              <div><span>Plan</span><strong className={`plan-${membership.membershipPlan?.toLowerCase()}`}>{membership.membershipPlan}</strong></div>
              <div><span>Duration</span><strong>{membership.duration} Month{membership.duration > 1 ? "s" : ""}</strong></div>
              <div><span>Enrolled On</span><strong>{membership.paidAt ? new Date(membership.paidAt).toLocaleDateString() : "—"}</strong></div>
              {membership.activatedAt && (
                <div><span>Activated On</span><strong>{new Date(membership.activatedAt).toLocaleDateString()}</strong></div>
              )}
              <div><span>Payment ID</span><strong className="small-text">{membership.paymentInfo?.id}</strong></div>
            </div>
          </div>

          {/* Enrolled Classes */}
          <div className="details-card full-width">
            <h3>🏋️ Enrolled Classes</h3>
            {membership.enrolledClasses?.map((item) => (
              <div key={item._id} className="enrolled-class-row">
                <img src={item.image} alt={item.name} className="enrolled-img" />
                <div className="enrolled-info">
                  <strong>{item.name}</strong>
                  <span>{item.quantity} session{item.quantity > 1 ? "s" : ""}/week</span>
                </div>
                <strong className="enrolled-price">Rs. {(item.price * item.quantity).toLocaleString()}</strong>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="details-card">
            <h3>💰 Price Breakdown</h3>
            <div className="info-list">
              <div><span>Classes Price</span><strong>Rs. {membership.classesPrice?.toLocaleString()}</strong></div>
              <div><span>Facility Fee</span><strong>Rs. {membership.facilityFee?.toLocaleString()}</strong></div>
              <div><span>Processing Fee</span><strong>{membership.processingFee === 0 ? "Free" : `Rs. ${membership.processingFee}`}</strong></div>
              <div className="total-row"><span>Total</span><strong className="total-amount">Rs. {membership.totalPrice?.toLocaleString()}</strong></div>
            </div>
          </div>
        </div>

        <Link to="/memberships" className="back-btn">← Back to Memberships</Link>
      </div>
    </>
  );
};

export default MembershipDetails;
