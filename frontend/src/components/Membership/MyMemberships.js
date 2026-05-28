import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { DataGrid } from "@material-ui/data-grid";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { myMemberships, clearErrors } from "../../actions/membershipAction";
import "./MyMemberships.css";

const MyMemberships = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, memberships } = useSelector((state) => state.myMemberships);

  useEffect(() => {
    if (error) { alert.error(error); dispatch(clearErrors()); }
    dispatch(myMemberships());
  }, [dispatch, error, alert]);

  const columns = [
    { field: "id", headerName: "Membership ID", minWidth: 220, flex: 1 },
    { field: "plan", headerName: "Plan", minWidth: 120, flex: 0.4 },
    { field: "classes", headerName: "Classes", minWidth: 100, flex: 0.3, type: "number" },
    { field: "amount", headerName: "Amount", minWidth: 120, flex: 0.4,
      renderCell: (params) => `Rs. ${params.value?.toLocaleString()}` },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.4,
      renderCell: (params) => (
        <span className={`status-badge status-${params.value?.toLowerCase()}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Details",
      minWidth: 100,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/membership/${params.row.id}`} className="view-btn">View</Link>
      ),
    },
  ];

  const rows = memberships
    ? memberships.map((item) => ({
        id: item._id,
        plan: item.membershipPlan,
        classes: item.enrolledClasses?.length,
        amount: item.totalPrice,
        status: item.membershipStatus,
      }))
    : [];

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="My Memberships — GMS" />
      <div className="my-memberships">
        <h1>🏋️ My Memberships</h1>
        {memberships && memberships.length === 0 ? (
          <div className="no-memberships">
            <p>You haven't enrolled in any memberships yet.</p>
            <Link to="/classes" className="browse-btn">Browse Classes</Link>
          </div>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="memberships-grid"
          />
        )}
      </div>
    </>
  );
};

export default MyMemberships;
