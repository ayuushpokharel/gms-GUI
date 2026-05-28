import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { forgotPassword, clearErrors } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, message, loading } = useSelector((state) => state.forgotPassword);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (message) { alert.success(message); }
  }, [dispatch, error, alert, message]);

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Forgot Password — GMS" />
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ textAlign: "center", color: "#1a1a2e", marginBottom: "0.75rem" }}>📧 Forgot Password</h2>
          <p style={{ textAlign: "center", color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Enter your registered email and we'll send you a reset link.
          </p>
          <form onSubmit={forgotPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "0.7rem 1rem", border: "1.5px solid #ddd", borderRadius: 6, fontSize: "0.95rem", outline: "none" }}
              />
            </div>
            <button type="submit" style={{ background: "#E63946", color: "#fff", border: "none", padding: "0.9rem", borderRadius: 8, fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}>
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
