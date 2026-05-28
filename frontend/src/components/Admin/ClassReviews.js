import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getAllReviews, deleteReview, clearErrors } from "../../actions/classAction";
import { DELETE_REVIEW_RESET } from "../../constants/classConstants";
import "./Dashboard.css";

const ClassReviews = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, reviews, loading } = useSelector((state) => state.classReviews);
  const { error: deleteError, isDeleted } = useSelector((state) => state.review);

  const [classId, setClassId] = useState("");

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (deleteError) { alert.error(deleteError); dispatch(clearErrors()); }
    if (isDeleted) {
      alert.success("Review deleted!");
      dispatch({ type: DELETE_REVIEW_RESET });
      if (classId) dispatch(getAllReviews(classId));
    }
  }, [dispatch, error, deleteError, isDeleted, alert, classId]);

  const classIdSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(classId));
  };

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview(reviewId, classId));
  };

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.8 },
    { field: "user", headerName: "User", minWidth: 150, flex: 0.6 },
    {
      field: "rating", headerName: "Rating", minWidth: 100, flex: 0.3,
      renderCell: (p) => (
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {p.value} <StarIcon fontSize="small" style={{ color: "#E63946" }} />
        </span>
      ),
    },
    { field: "comment", headerName: "Comment", minWidth: 250, flex: 1 },
    {
      field: "actions", headerName: "Delete", minWidth: 100, flex: 0.3, sortable: false,
      renderCell: (p) => (
        <button className="delete-btn" onClick={() => deleteReviewHandler(p.row.id)}><DeleteIcon fontSize="small" /></button>
      ),
    },
  ];

  const rows = reviews
    ? reviews.map((r) => ({ id: r._id, user: r.name, rating: r.rating, comment: r.comment }))
    : [];

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Class Reviews — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">⭐ Class Reviews</h1>
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <form onSubmit={classIdSubmitHandler} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Enter Class ID</label>
                <input
                  type="text"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  placeholder="Paste Class MongoDB ID here"
                  required
                  style={{ padding: "0.7rem 1rem", border: "1.5px solid #ddd", borderRadius: 6, outline: "none", fontSize: "0.95rem" }}
                />
              </div>
              <button type="submit" style={{ background: "#E63946", color: "#fff", border: "none", padding: "0.7rem 1.5rem", borderRadius: 6, fontWeight: 700, cursor: "pointer", height: 42 }}>
                Search
              </button>
            </form>
          </div>
          {reviews && reviews.length > 0 ? (
            <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight className="admin-grid" />
          ) : (
            <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>
              {classId ? "No reviews found for this class." : "Enter a Class ID above to view its reviews."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassReviews;
