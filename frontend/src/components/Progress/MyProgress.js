import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyProgress, deleteProgress } from "../../actions/progressAction";
import { DELETE_PROGRESS_RESET } from "../../constants/progressConstants";
import Loader from "../layout/Loader/Loader";
import AttendanceStats from "../Attendance/AttendanceStats";
import "./Progress.css";

const MyProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, progressEntries } = useSelector((state) => state.myProgress);
  const { isDeleted } = useSelector((state) => state.addProgress);

  useEffect(() => {
    dispatch(getMyProgress());
  }, [dispatch]);

  useEffect(() => {
    if (isDeleted) {
      dispatch(getMyProgress());
      dispatch({ type: DELETE_PROGRESS_RESET });
    }
  }, [isDeleted, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this entry?")) {
      dispatch(deleteProgress(id));
    }
  };

  const getBMILabel = (bmi) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="progress-container">
      <div className="progress-header">
        <h2>My Progress</h2>
        <button onClick={() => navigate("/progress/new")} className="add-btn">
          + Add Entry
        </button>
      </div>

      <AttendanceStats />

      {progressEntries && progressEntries.length === 0 ? (
        <p className="no-entries">
          No progress entries yet. Start tracking today!
        </p>
      ) : (
        <div className="progress-list">
          {progressEntries &&
            progressEntries.map((entry) => (
              <div className="progress-card" key={entry._id}>
                <div className="progress-date">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="progress-stats">
                  {entry.weight && (
                    <span className="stat">
                      ⚖️ <strong>{entry.weight}</strong> kg
                    </span>
                  )}
                  {entry.height && (
                    <span className="stat">
                      📏 <strong>{entry.height}</strong> cm
                    </span>
                  )}
                  {entry.bmi && (
                    <span className="stat bmi">
                      BMI: <strong>{entry.bmi}</strong>{" "}
                      <span className="bmi-label">
                        ({getBMILabel(entry.bmi)})
                      </span>
                    </span>
                  )}
                  {entry.fitnessGoal && (
                    <span className="stat goal">🎯 {entry.fitnessGoal}</span>
                  )}
                </div>

                {entry.workoutLog && (
                  <div className="workout-log">
                    <strong>Workout:</strong> {entry.workoutLog}
                  </div>
                )}

                {entry.notes && (
                  <div className="notes">
                    <strong>Notes:</strong> {entry.notes}
                  </div>
                )}

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(entry._id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyProgress;
