import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { createMembership } from "../../actions/membershipAction";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.membership);

  const membershipInfo = JSON.parse(sessionStorage.getItem("membershipInfo") || "{}");

  useEffect(() => {
    if (error) {
      alert.error(error);
    }
  }, [error, alert]);

  const paymentData = {
    amount: Math.round(membershipInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post("/api/v1/payment/process", paymentData, config);

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: { line1: "Kathmandu, Nepal" },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const membership = {
            healthInfo: {
              height: shippingInfo.height,
              weight: shippingInfo.weight,
              fitnessGoal: shippingInfo.fitnessGoal,
              experienceLevel: shippingInfo.experienceLevel,
              phone: shippingInfo.phone,
            },
            enrolledClasses: cartItems.map((item) => ({
              gymClass: item.gymClass,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            membershipPlan: shippingInfo.membershipPlan,
            duration: shippingInfo.duration,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
            classesPrice: membershipInfo.classesPrice,
            facilityFee: membershipInfo.facilityFee,
            processingFee: membershipInfo.processingFee,
            totalPrice: membershipInfo.totalPrice,
            paidAt: Date.now(),
          };

          dispatch(createMembership(membership));
          navigate("/success");
        } else {
          alert.error("Payment processing issue. Please try again.");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response?.data?.message || "Payment failed");
    }
  };

  const cardElementOpts = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1a1a2e",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#E63946" },
    },
  };

  return (
    <>
      <MetaData title="Payment — GMS" />
      <CheckoutSteps activeStep={2} />
      <div className="payment-container">
        <div className="payment-box">
          <h2>💳 Complete Payment</h2>
          <div className="payment-amount">
            Total: <strong>Rs. {membershipInfo.totalPrice?.toLocaleString()}</strong>
          </div>

          <form onSubmit={submitHandler} className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <div className="stripe-input">
                <CardNumberElement options={cardElementOpts} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <div className="stripe-input">
                  <CardExpiryElement options={cardElementOpts} />
                </div>
              </div>
              <div className="form-group">
                <label>CVC</label>
                <div className="stripe-input">
                  <CardCvcElement options={cardElementOpts} />
                </div>
              </div>
            </div>

            {/* <div className="test-card-hint">
              <strong>Test Card:</strong> 4242 4242 4242 4242 &nbsp;|&nbsp; Any future date &nbsp;|&nbsp; Any 3-digit CVC
            </div> */}

            <button ref={payBtn} type="submit" className="pay-btn">
              🔒 Pay Rs. {membershipInfo.totalPrice?.toLocaleString()}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;
