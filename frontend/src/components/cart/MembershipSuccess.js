import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { CLEAR_CART, REMOVE_CART_ITEM } from "../../constants/cartConstants";
import "./MembershipSuccess.css";

const MembershipSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("cartItems");
    dispatch({ type: CLEAR_CART });
  }, [dispatch]);

  return (
    <>
      <MetaData title="Membership Enrolled — GMS" />
      <div className="success-container">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h1>Membership Enrolled Successfully!</h1>
          <p>
            Welcome to GMS! Your membership is now being processed. You'll
            receive a confirmation once activated by admin.
          </p>
          <div className="success-actions">
            <Link to="/memberships" className="success-btn primary">
              View My Memberships
            </Link>
            <Link to="/classes" className="success-btn secondary">
              Browse More Classes
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipSuccess;
