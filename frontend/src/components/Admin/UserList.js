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
import { getAllUsers, deleteUser, clearErrors } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import "./Dashboard.css";

const UserList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted } = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (deleteError) { alert.error(deleteError); dispatch(clearErrors()); }
    if (isDeleted) {
      alert.success("User deleted!");
      dispatch({ type: DELETE_USER_RESET });
      dispatch(getAllUsers());
    }
    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted, alert]);

  const deleteUserHandler = (id) => {
    if (window.confirm("Delete this user?")) dispatch(deleteUser(id));
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 150, flex: 0.6 },
    { field: "email", headerName: "Email", minWidth: 180, flex: 0.8 },
    {
      field: "role", headerName: "Role", minWidth: 110, flex: 0.4,
      renderCell: (p) => (
        <span className={`role-chip role-${p.value}`}>{p.value}</span>
      ),
    },
    {
      field: "actions", headerName: "Actions", minWidth: 130, flex: 0.4, sortable: false,
      renderCell: (p) => (
        <>
          <Link to={`/admin/user/${p.row.id}`} className="edit-btn"><EditIcon fontSize="small" /></Link>
          <button className="delete-btn" onClick={() => deleteUserHandler(p.row.id)}><DeleteIcon fontSize="small" /></button>
        </>
      ),
    },
  ];

  const rows = users
    ? users.map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role }))
    : [];

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="All Users — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">👥 All Users</h1>
          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight className="admin-grid" />
        </div>
      </div>
    </>
  );
};

export default UserList;
