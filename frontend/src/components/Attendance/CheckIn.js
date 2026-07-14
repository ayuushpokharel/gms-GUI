import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTodayCheckinOptions,
  checkIn,
  clearErrors,
} from "../../actions/attendanceAction";
import { CHECKIN_RESET } from "../../constants/attendanceConstants";
import Loader from "../layout/Loader/Loader";
import "./Attendance.css";

const CheckIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, classes, error } = useSelector(
    (state) => state.todayCheckinOptions,
  );
  const { success: checkInSuccess, error: checkInError } = useSelector(
    (state) => state.checkIn,
  );

  useEffect(() => {
    dispatch(getTodayCheckinOptions());
  }, [dispatch]);

  useEffect(() => {
    if (checkInSuccess) {
      dispatch({ type: CHECKIN_RESET });
      dispatch(getTodayCheckinOptions());
    }
    if (checkInError) {
      alert(checkInError);
      dispatch(clearErrors());
    }
    if (error) {
      dispatch(clearErrors());
    }
  }, [checkInSuccess, checkInError, error, dispatch]);

  const handleCheckIn = (classId) => {
    dispatch(checkIn(classId));
  };

  return (
    <div className="checkin-container">
      <div className="checkin-header">
        <h2>Today's Classes</h2>
        <button
          className="view-progress-btn"
          onClick={() => navigate("/progress/me")}
        >
          View My Progress
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : classes && classes.length === 0 ? (
        <p className="no-entries">
          You have no enrolled classes scheduled for today.
        </p>
      ) : (
        <div className="checkin-list">
          {classes &&
            classes.map((c) => (
              <div className="checkin-card" key={c.classId}>
                <div className="checkin-info">
                  <h3>{c.name}</h3>
                  <span className="checkin-time">
                    {c.day} · {c.time}
                  </span>
                </div>
                <button
                  className={
                    c.alreadyCheckedIn
                      ? "checkin-btn checked-in"
                      : "checkin-btn"
                  }
                  disabled={c.alreadyCheckedIn}
                  onClick={() => handleCheckIn(c.classId)}
                >
                  {c.alreadyCheckedIn ? "✓ Checked In" : "Check In"}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CheckIn;
