import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProgress, clearErrors } from "../../actions/progressAction";
import { ADD_PROGRESS_RESET } from "../../constants/progressConstants";
import "./Progress.css";

const AddProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.addProgress);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [workoutLog, setWorkoutLog] = useState("");
  const [notes, setNotes] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  useEffect(() => {
    if (success) {
      dispatch({ type: ADD_PROGRESS_RESET });
      navigate("/progress/me");
    }
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
  }, [success, error, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProgress({ weight, height, workoutLog, notes, fitnessGoal }));
  };

  return (
    <div className="add-progress-container">
      <h2>Log Progress Entry</h2>
      <form onSubmit={handleSubmit} className="progress-form">
        <div className="form-row">
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 72.5"
            />
          </div>
          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Fitness Goal</label>
          <select
            value={fitnessGoal}
            onChange={(e) => setFitnessGoal(e.target.value)}
          >
            <option value="">Select goal</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Endurance">Endurance</option>
            <option value="Flexibility">Flexibility</option>
            <option value="General Fitness">General Fitness</option>
          </select>
        </div>

        <div className="form-group">
          <label>Workout Log</label>
          <textarea
            rows="3"
            value={workoutLog}
            onChange={(e) => setWorkoutLog(e.target.value)}
            placeholder="e.g. Chest day: bench press 3x10, pushups 3x20"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel today?"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </form>
    </div>
  );
};

export default AddProgress;
