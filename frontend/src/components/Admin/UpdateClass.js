import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { getClassDetails, updateClass, clearErrors } from "../../actions/classAction";
import { getAllUsers } from "../../actions/userAction";
import { UPDATE_CLASS_RESET } from "../../constants/classConstants";
import "./NewClass.css";

const CATEGORIES = ["Yoga","Cardio","Strength Training","Zumba","CrossFit","Pilates","Martial Arts","Other"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Daily","Weekdays","Weekends"];

const UpdateClass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { id } = useParams();

  const { error, gymClass } = useSelector((state) => state.gymClass);
  const { loading, error: updateError, isUpdated } = useSelector((state) => state.classEdit);
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
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    if (gymClass && gymClass._id !== id) {
      dispatch(getClassDetails(id));
    } else if (gymClass) {
      setName(gymClass.name || "");
      setDescription(gymClass.description || "");
      setPrice(gymClass.price || "");
      setCategory(gymClass.category || "");
      setCapacity(gymClass.capacity || 20);
      setDay(gymClass.schedule?.day || "");
      setTime(gymClass.schedule?.time || "");
      setDuration(gymClass.schedule?.duration || 60);
      setRequiredMembership(gymClass.requiredMembership || "Basic");
      setTrainer(gymClass.trainer?._id || gymClass.trainer || "");
      setOldImages(gymClass.images || []);
    }
    dispatch(getAllUsers());
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (updateError) { alert.error(updateError); dispatch(clearErrors()); }
    if (isUpdated) {
      alert.success("Class updated successfully!");
      navigate("/admin/classes");
      dispatch({ type: UPDATE_CLASS_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, gymClass, id, alert, navigate]);

  const updateClassImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]); setImagesPreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((p) => [...p, reader.result]);
          setImages((p) => [...p, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateClassSubmitHandler = (e) => {
    e.preventDefault();
    const classData = {
      name, description, price: Number(price), category, capacity: Number(capacity),
      schedule: { day, time, duration: Number(duration) },
      requiredMembership, trainer,
      images: images.length > 0 ? images : undefined,
    };
    dispatch(updateClass(id, classData));
  };

  return (
    <>
      <MetaData title="Update Class — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">✏️ Update Class</h1>
          <div className="class-form-box">
            <form onSubmit={updateClassSubmitHandler} className="class-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Class Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
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
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Capacity *</label>
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
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Duration (min) *</label>
                  <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Required Membership</label>
                  <select value={requiredMembership} onChange={(e) => setRequiredMembership(e.target.value)}>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trainer</label>
                  <select value={trainer} onChange={(e) => setTrainer(e.target.value)}>
                    <option value="">Select trainer</option>
                    {trainers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Current Images</label>
                <div className="image-preview-row">
                  {oldImages.map((img, i) => <img key={i} src={img.url} alt={`old-${i}`} className="img-preview" />)}
                </div>
              </div>
              <div className="form-group">
                <label>Replace Images</label>
                <input type="file" accept="image/*" multiple onChange={updateClassImagesChange} />
                <div className="image-preview-row">
                  {imagesPreview.map((img, i) => <img key={i} src={img} alt={`new-${i}`} className="img-preview" />)}
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Updating..." : "Update Class"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateClass;
