import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { updatePassword, clearErrors } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (isUpdated) {
      alert.success("Password updated successfully!");
      navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, alert, isUpdated, navigate]);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Update Password — GMS" />
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ textAlign: "center", color: "#1a1a2e", marginBottom: "1.5rem" }}>🔒 Update Password</h2>
          <form onSubmit={updatePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Old Password", value: oldPassword, setter: setOldPassword },
              { label: "New Password", value: newPassword, setter: setNewPassword },
              { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, value, setter }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                <input
                  type="password"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  style={{ padding: "0.7rem 1rem", border: "1.5px solid #ddd", borderRadius: 6, fontSize: "0.95rem", outline: "none" }}
                />
              </div>
            ))}
            <button type="submit" style={{ background: "#E63946", color: "#fff", border: "none", padding: "0.9rem", borderRadius: 8, fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
