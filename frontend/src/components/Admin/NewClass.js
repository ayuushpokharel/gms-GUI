import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { createClass, clearErrors } from "../../actions/classAction";
import { getAllUsers } from "../../actions/userAction";
import { NEW_CLASS_RESET } from "../../constants/classConstants";
import "./NewClass.css";

const CATEGORIES = ["Yoga","Cardio","Strength Training","Zumba","CrossFit","Pilates","Martial Arts","Other"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Daily","Weekdays","Weekends"];

const NewClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { loading, error, success } = useSelector((state) => state.newClass);
  const { users } = useSelector((state) => state.allUsers);
  const trainers = users ? users.filter((u) => u.role === "trainer") : [];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState(20);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [requiredMembership, setRequiredMembership] = useState("Basic");
  const [trainer, setTrainer] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    dispatch(getAllUsers());
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (success) {
      alert.success("Class created successfully!");
      navigate("/admin/classes");
      dispatch({ type: NEW_CLASS_RESET });
    }
  }, [dispatch, error, success, alert, navigate]);

  const createClassImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const createClassSubmitHandler = (e) => {
    e.preventDefault();
    const classData = {
      name, description, price: Number(price), category, capacity: Number(capacity),
      schedule: { day, time, duration: Number(duration) },
      requiredMembership, trainer, images,
    };
    dispatch(createClass(classData));
  };

  return (
    <>
      <MetaData title="New Class — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">➕ Add New Class</h1>
          <div className="class-form-box">
            <form onSubmit={createClassSubmitHandler} className="class-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Class Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Morning Yoga Flow" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" placeholder="Describe the class..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price per Session (Rs.) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="500" />
                </div>
                <div className="form-group">
                  <label>Capacity (Max Trainees) *</label>
                  <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                </div>
              </div>

              <div className="form-section-label">📅 Schedule</div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Day *</label>
                  <select value={day} onChange={(e) => setDay(e.target.value)} required>
                    <option value="">Select day</option>
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="06:00 AM" required />
                </div>
                <div className="form-group">
                  <label>Duration (min) *</label>
                  <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Required Membership *</label>
                  <select value={requiredMembership} onChange={(e) => setRequiredMembership(e.target.value)}>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Trainer *</label>
                  <select value={trainer} onChange={(e) => setTrainer(e.target.value)} required>
                    <option value="">Select trainer</option>
                    {trainers.map((t) => (
                      <option key={t._id} value={t._id}>{t.name} {t.specialization ? `— ${t.specialization}` : ""}</option>
                    ))}
                  </select>
                  {trainers.length === 0 && <small className="hint">No trainers found. Promote a user to trainer first.</small>}
                </div>
              </div>

              <div className="form-group">
                <label>Class Images *</label>
                <input type="file" accept="image/*" multiple onChange={createClassImagesChange} required={images.length === 0} />
                <div className="image-preview-row">
                  {imagesPreview.map((img, i) => (
                    <img key={i} src={img} alt={`preview-${i}`} className="img-preview" />
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Class"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewClass;
