import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { resetPassword, clearErrors } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { token } = useParams();

  const { error, success, loading } = useSelector((state) => state.forgotPassword);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (success) { alert.success("Password reset successfully!"); navigate("/login"); }
  }, [dispatch, error, alert, success, navigate]);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Reset Password — GMS" />
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ textAlign: "center", color: "#1a1a2e", marginBottom: "1.5rem" }}>🔑 Reset Password</h2>
          <form onSubmit={resetPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "New Password", value: password, setter: setPassword },
              { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, value, setter }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                <input type="password" value={value} onChange={(e) => setter(e.target.value)} required
                  style={{ padding: "0.7rem 1rem", border: "1.5px solid #ddd", borderRadius: 6, fontSize: "0.95rem", outline: "none" }} />
              </div>
            ))}
            <button type="submit" style={{ background: "#E63946", color: "#fff", border: "none", padding: "0.9rem", borderRadius: 8, fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
