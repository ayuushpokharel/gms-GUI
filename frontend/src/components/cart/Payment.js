import React, { useEffect, useRef, useState } from "react";
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

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [esewaQR, setEsewaQR] = useState(null);
  const [esewaNumber, setEsewaNumber] = useState("");
  const [esewaLoading, setEsewaLoading] = useState(false);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.membership);

  const membershipInfo = JSON.parse(
    sessionStorage.getItem("membershipInfo") || "{}",
  );

  useEffect(() => {
    if (error) alert.error(error);
  }, [error, alert]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/v1/settings");
        if (data.settings.esewaQR?.url) setEsewaQR(data.settings.esewaQR.url);
        if (data.settings.esewaNumber)
          setEsewaNumber(data.settings.esewaNumber);
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const buildMembership = (paymentInfo) => ({
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
    paymentInfo,
    classesPrice: membershipInfo.classesPrice,
    facilityFee: membershipInfo.facilityFee,
    processingFee: membershipInfo.processingFee,
    totalPrice: membershipInfo.totalPrice,
    paidAt: Date.now(),
  });

  const submitStripe = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        { amount: Math.round(membershipInfo.totalPrice * 100) },
        config,
      );
      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(data.client_secret, {
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
      } else if (result.paymentIntent.status === "succeeded") {
        dispatch(
          createMembership(
            buildMembership({
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            }),
          ),
        );
        navigate("/success");
      } else {
        alert.error("Payment processing issue. Please try again.");
        payBtn.current.disabled = false;
      }
    } catch (err) {
      payBtn.current.disabled = false;
      alert.error(err.response?.data?.message || "Payment failed");
    }
  };

  const submitEsewa = async () => {
    setEsewaLoading(true);
    try {
      dispatch(
        createMembership(
          buildMembership({
            id: `ESEWA-${Date.now()}`,
            status: "esewa-pending",
          }),
        ),
      );
      navigate("/success");
    } catch (err) {
      alert.error("Something went wrong. Please try again.");
    } finally {
      setEsewaLoading(false);
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
          <h2>Complete Payment</h2>
          <div className="payment-amount">
            Total:{" "}
            <strong>Rs. {membershipInfo.totalPrice?.toLocaleString()}</strong>
          </div>

          <div className="payment-toggle">
            <button
              className={`toggle-btn ${paymentMethod === "stripe" ? "active" : ""}`}
              onClick={() => setPaymentMethod("stripe")}
            >
              💳 Card (Stripe)
            </button>
            <button
              className={`toggle-btn ${paymentMethod === "esewa" ? "active" : ""}`}
              onClick={() => setPaymentMethod("esewa")}
            >
              eSewa
            </button>
          </div>

          {paymentMethod === "stripe" && (
            <form onSubmit={submitStripe} className="payment-form">
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
              <button ref={payBtn} type="submit" className="pay-btn">
                🔒 Pay Rs. {membershipInfo.totalPrice?.toLocaleString()}
              </button>
            </form>
          )}

          {paymentMethod === "esewa" && (
            <div className="esewa-panel">
              {!esewaQR ? (
                <div className="esewa-no-qr">
                  <p>⚠️ eSewa QR not configured yet.</p>
                  <small>Please contact admin to set up eSewa payments.</small>
                </div>
              ) : (
                <>
                  <p className="esewa-instruction">
                    Scan the QR code below using your <strong>eSewa</strong> app
                    and pay{" "}
                    <strong>
                      Rs. {membershipInfo.totalPrice?.toLocaleString()}
                    </strong>
                  </p>
                  {esewaNumber && (
                    <p className="esewa-number">
                      eSewa ID: <strong>{esewaNumber}</strong>
                    </p>
                  )}
                  <div className="esewa-qr-wrap">
                    <img
                      src={esewaQR}
                      alt="eSewa QR Code"
                      className="esewa-qr"
                    />
                  </div>
                  <p className="esewa-note">
                    After paying in your eSewa app, click below. Your membership
                    will be activated by admin after verification.
                  </p>
                  <button
                    className="pay-btn esewa-confirm-btn"
                    onClick={submitEsewa}
                    disabled={esewaLoading}
                  >
                    {esewaLoading
                      ? "Processing..."
                      : "✅ I've Completed Payment"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
