import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getAllMemberships, deleteMembership, clearErrors } from "../../actions/membershipAction";
import { DELETE_MEMBERSHIP_RESET } from "../../constants/membershipConstants";
import "./Dashboard.css";

const MembershipList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, memberships, loading } = useSelector((state) => state.allMemberships);
  const { error: deleteError, isDeleted } = useSelector((state) => state.membershipUpdate);

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    if (deleteError) { alert.error(deleteError); dispatch(clearErrors()); }
    if (isDeleted) {
      alert.success("Membership deleted!");
      dispatch({ type: DELETE_MEMBERSHIP_RESET });
      dispatch(getAllMemberships());
    }
    dispatch(getAllMemberships());
  }, [dispatch, error, deleteError, isDeleted, alert]);

  const deleteHandler = (id) => {
    if (window.confirm("Delete this membership?")) dispatch(deleteMembership(id));
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 200, flex: 0.8 },
    { field: "user", headerName: "Member", minWidth: 150, flex: 0.6 },
    { field: "plan", headerName: "Plan", minWidth: 110, flex: 0.4 },
    { field: "duration", headerName: "Duration", minWidth: 100, flex: 0.3 },
    { field: "amount", headerName: "Amount", minWidth: 120, flex: 0.4, renderCell: (p) => `Rs. ${p.value?.toLocaleString()}` },
    {
      field: "status", headerName: "Status", minWidth: 130, flex: 0.4,
      renderCell: (p) => (
        <span className={`status-badge status-${p.value?.toLowerCase()}`}>{p.value}</span>
      ),
    },
    {
      field: "actions", headerName: "Actions", minWidth: 130, flex: 0.4, sortable: false,
      renderCell: (p) => (
        <>
          <Link to={`/admin/membership/${p.row.id}`} className="edit-btn">Process</Link>
          <button className="delete-btn" onClick={() => deleteHandler(p.row.id)}><DeleteIcon fontSize="small" /></button>
        </>
      ),
    },
  ];

  const rows = memberships
    ? memberships.map((m) => ({
        id: m._id,
        user: m.user?.name || "—",
        plan: m.membershipPlan,
        duration: `${m.duration}mo`,
        amount: m.totalPrice,
        status: m.membershipStatus,
      }))
    : [];

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="All Memberships — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">💳 All Memberships</h1>
          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight className="admin-grid" />
        </div>
      </div>
    </>
  );
};

export default MembershipList;
