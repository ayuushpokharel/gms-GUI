import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getMembershipDetails, updateMembership, clearErrors } from "../../actions/membershipAction";
import { UPDATE_MEMBERSHIP_RESET } from "../../constants/membershipConstants";
import "./ProcessMembership.css";

const ProcessMembership = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { membership, error, loading } = useSelector((state) => state.membershipDetail);
  const { error: updateError, isUpdated } = useSelector((state) => state.membershipUpdate);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (updateError) { alert.error(updateError); dispatch(clearErrors()); }
    if (isUpdated) {
      alert.success("Membership status updated!");
      dispatch({ type: UPDATE_MEMBERSHIP_RESET });
      dispatch(getMembershipDetails(id));
    }
    dispatch(getMembershipDetails(id));
  }, [dispatch, id, error, updateError, isUpdated, alert]);

  useEffect(() => {
    if (membership) setStatus(membership.membershipStatus || "Processing");
  }, [membership]);

  const updateMembershipStatusHandler = (e) => {
    e.preventDefault();
    dispatch(updateMembership(id, { status }));
  };

  if (loading) return <Loader />;
  if (!membership) return null;

  return (
    <>
      <MetaData title={`Process Membership #${id}`} />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">⚙️ Process Membership</h1>
          <div className="process-grid">
            {/* Left: Info */}
            <div className="process-info">
              <div className="process-card">
                <h3>💪 Health Info</h3>
                <p><strong>Height:</strong> {membership.healthInfo?.height} cm</p>
                <p><strong>Weight:</strong> {membership.healthInfo?.weight} kg</p>
                <p><strong>Goal:</strong> {membership.healthInfo?.fitnessGoal}</p>
                <p><strong>Level:</strong> {membership.healthInfo?.experienceLevel}</p>
                <p><strong>Phone:</strong> {membership.healthInfo?.phone}</p>
              </div>

              <div className="process-card">
                <h3>📋 Membership Details</h3>
                <p><strong>Plan:</strong> <span className={`plan-${membership.membershipPlan?.toLowerCase()}`}>{membership.membershipPlan}</span></p>
                <p><strong>Duration:</strong> {membership.duration} month{membership.duration > 1 ? "s" : ""}</p>
                <p><strong>Payment ID:</strong> <small>{membership.paymentInfo?.id}</small></p>
                <p><strong>Paid At:</strong> {membership.paidAt ? new Date(membership.paidAt).toLocaleDateString() : "—"}</p>
              </div>

              <div className="process-card">
                <h3>🏋️ Enrolled Classes</h3>
                {membership.enrolledClasses?.map((item) => (
                  <div key={item._id} className="process-class-row">
                    <img src={item.image} alt={item.name} className="process-class-img" />
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.quantity} session{item.quantity > 1 ? "s" : ""}/week × Rs. {item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="process-card">
                <h3>💰 Price Summary</h3>
                <p><strong>Classes:</strong> Rs. {membership.classesPrice?.toLocaleString()}</p>
                <p><strong>Facility Fee:</strong> Rs. {membership.facilityFee?.toLocaleString()}</p>
                <p><strong>Processing Fee:</strong> {membership.processingFee === 0 ? "Free" : `Rs. ${membership.processingFee}`}</p>
                <p className="total-line"><strong>Total:</strong> Rs. {membership.totalPrice?.toLocaleString()}</p>
              </div>
            </div>

            {/* Right: Status Update */}
            <div className="process-status-box">
              <h3>Update Status</h3>
              <div className={`current-status status-${membership.membershipStatus?.toLowerCase()}`}>
                {membership.membershipStatus}
              </div>
              {membership.membershipStatus !== "Expired" ? (
                <form onSubmit={updateMembershipStatusHandler}>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Processing">Processing</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <button type="submit" className="update-status-btn">
                    Update Status
                  </button>
                </form>
              ) : (
                <p className="expired-note">This membership has already expired.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessMembership;
