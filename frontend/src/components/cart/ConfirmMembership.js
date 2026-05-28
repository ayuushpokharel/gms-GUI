import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmMembership.css";

const ConfirmMembership = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const classesPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const facilityFee = Math.round(classesPrice * 0.18);
  const processingFee = classesPrice > 2000 ? 0 : 200;
  const totalPrice = classesPrice + facilityFee + processingFee;

  const proceedToPayment = () => {
    const data = { classesPrice, facilityFee, processingFee, totalPrice };
    sessionStorage.setItem("membershipInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <>
      <MetaData title="Confirm Membership — GMS" />
      <CheckoutSteps activeStep={1} />
      <div className="confirm-container">
        <div className="confirm-left">
          {/* Health Info */}
          <div className="confirm-section">
            <h3>💪 Health Info</h3>
            <div className="confirm-info-grid">
              <div><span>Height</span><strong>{shippingInfo.height} cm</strong></div>
              <div><span>Weight</span><strong>{shippingInfo.weight} kg</strong></div>
              <div><span>Goal</span><strong>{shippingInfo.fitnessGoal}</strong></div>
              <div><span>Level</span><strong>{shippingInfo.experienceLevel}</strong></div>
              <div><span>Phone</span><strong>{shippingInfo.phone}</strong></div>
              <div><span>Plan</span><strong className={`plan-${shippingInfo.membershipPlan?.toLowerCase()}`}>{shippingInfo.membershipPlan}</strong></div>
              <div><span>Duration</span><strong>{shippingInfo.duration} Month{shippingInfo.duration > 1 ? "s" : ""}</strong></div>
            </div>
          </div>

          {/* Selected Classes */}
          <div className="confirm-section">
            <h3>🏋️ Selected Classes</h3>
            {cartItems.map((item) => (
              <div key={item.gymClass} className="confirm-class-row">
                <img src={item.image} alt={item.name} className="confirm-class-img" />
                <div className="confirm-class-info">
                  <strong>{item.name}</strong>
                  <span>{item.quantity} session{item.quantity > 1 ? "s" : ""}/week × Rs. {item.price?.toLocaleString()}</span>
                </div>
                <strong className="confirm-class-price">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="confirm-right">
          <div className="confirm-summary">
            <h3>📋 Membership Summary</h3>
            <div className="summary-row"><span>Classes Price</span><strong>Rs. {classesPrice.toLocaleString()}</strong></div>
            <div className="summary-row"><span>Facility Fee (18%)</span><strong>Rs. {facilityFee.toLocaleString()}</strong></div>
            <div className="summary-row"><span>Processing Fee</span><strong>{processingFee === 0 ? "Free" : `Rs. ${processingFee}`}</strong></div>
            <div className="summary-total">
              <span>Total</span>
              <strong>Rs. {totalPrice.toLocaleString()}</strong>
            </div>
            <button className="proceed-payment-btn" onClick={proceedToPayment}>
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmMembership;
