import React from "react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = ["Health Info", "Confirm Membership", "Payment"];

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`step ${index <= activeStep ? "active" : ""}`}>
            <div className="step-circle">{index + 1}</div>
            <span>{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${index < activeStep ? "active" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
