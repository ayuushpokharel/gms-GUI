import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import "./Dashboard.css";

const UpdateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.userDetails);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
    }
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (updateError) { alert.error(updateError); dispatch(clearErrors()); }
    if (isUpdated) {
      alert.success("User updated successfully!");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, user, id, alert, navigate]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser(id, { name, email, role }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Update User — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">✏️ Update User</h1>
          <div className="class-form-box" style={{ maxWidth: 500 }}>
            <form onSubmit={updateUserSubmitHandler} className="class-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Trainee (user)</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
                <small style={{ color: "#888", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                  Promoting to "trainer" gives access to the Trainer Portal.
                </small>
              </div>
              <button type="submit" className="submit-btn">Update User</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
