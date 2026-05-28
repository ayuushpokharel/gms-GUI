import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { DataGrid } from "@material-ui/data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getAdminClasses, deleteClass, clearErrors } from "../../actions/classAction";
import { DELETE_CLASS_RESET } from "../../constants/classConstants";
import "./Dashboard.css";

const ClassList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, classes } = useSelector((state) => state.classes);
  const { error: deleteError, isDeleted } = useSelector((state) => state.classEdit);

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (deleteError) { alert.error(deleteError); dispatch(clearErrors()); }
    if (isDeleted) {
      alert.success("Class deleted successfully!");
      dispatch({ type: DELETE_CLASS_RESET });
      dispatch(getAdminClasses());
    }
    dispatch(getAdminClasses());
  }, [dispatch, error, deleteError, isDeleted, alert]);

  const deleteClassHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      dispatch(deleteClass(id));
    }
  };

  const columns = [
    { field: "id", headerName: "Class ID", minWidth: 200, flex: 0.8 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "category", headerName: "Category", minWidth: 130, flex: 0.5 },
    { field: "capacity", headerName: "Slots Left", minWidth: 100, flex: 0.3, type: "number" },
    {
      field: "price",
      headerName: "Price",
      minWidth: 110,
      flex: 0.4,
      renderCell: (p) => `Rs. ${p.value?.toLocaleString()}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 0.4,
      sortable: false,
      renderCell: (p) => (
        <>
          <Link to={`/admin/class/${p.row.id}`} className="edit-btn">
            <EditIcon fontSize="small" />
          </Link>
          <button className="delete-btn" onClick={() => deleteClassHandler(p.row.id)}>
            <DeleteIcon fontSize="small" />
          </button>
        </>
      ),
    },
  ];

  const rows = classes
    ? classes.map((c) => ({
        id: c._id,
        name: c.name,
        category: c.category,
        capacity: c.capacity,
        price: c.price,
      }))
    : [];

  return (
    <>
      <MetaData title="All Classes — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">🏋️ All Classes</h1>
          <Link to="/admin/class" className="add-new-btn">+ Add New Class</Link>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="admin-grid"
          />
        </div>
      </div>
    </>
  );
};

export default ClassList;
