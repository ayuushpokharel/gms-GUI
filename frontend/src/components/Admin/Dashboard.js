import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement,
} from "chart.js";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getAdminClasses } from "../../actions/classAction";
import { getAllUsers } from "../../actions/userAction";
import { getAllMemberships } from "../../actions/membershipAction";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { classes } = useSelector((state) => state.classes);
  const { users } = useSelector((state) => state.allUsers);
  const { memberships, totalAmount, loading } = useSelector((state) => state.allMemberships);

  useEffect(() => {
    dispatch(getAdminClasses());
    dispatch(getAllUsers());
    dispatch(getAllMemberships());
  }, [dispatch]);

  const trainers = users ? users.filter((u) => u.role === "trainer") : [];
  const trainees = users ? users.filter((u) => u.role === "user") : [];
  const lowCapacity = classes ? classes.filter((c) => c.capacity <= 5) : [];

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Memberships",
        data: Array(12).fill(0).map((_, i) => {
          if (!memberships) return 0;
          return memberships.filter((m) => new Date(m.createdAt).getMonth() === i).length;
        }),
        fill: true,
        backgroundColor: "rgba(230,57,70,0.1)",
        borderColor: "#E63946",
        tension: 0.4,
      },
    ],
  };

  const planCounts = { Basic: 0, Standard: 0, Premium: 0 };
  if (memberships) {
    memberships.forEach((m) => { if (planCounts[m.membershipPlan] !== undefined) planCounts[m.membershipPlan]++; });
  }

  const doughnutData = {
    labels: ["Basic", "Standard", "Premium"],
    datasets: [
      {
        data: [planCounts.Basic, planCounts.Standard, planCounts.Premium],
        backgroundColor: ["#2196F3", "#9C27B0", "#FF9800"],
        borderWidth: 0,
      },
    ],
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title="Admin Dashboard — GMS" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">📊 Dashboard</h1>

          {/* Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card revenue">
              <div className="stat-card-icon">💰</div>
              <div>
                <h3>Rs. {totalAmount ? totalAmount.toLocaleString() : "0"}</h3>
                <p>Total Revenue</p>
              </div>
              <Link to="/admin/memberships">View →</Link>
            </div>
            <div className="stat-card classes">
              <div className="stat-card-icon">🏋️</div>
              <div>
                <h3>{classes ? classes.length : 0}</h3>
                <p>Total Classes</p>
              </div>
              <Link to="/admin/classes">View →</Link>
            </div>
            <div className="stat-card members">
              <div className="stat-card-icon">👥</div>
              <div>
                <h3>{trainees.length}</h3>
                <p>Total Trainees</p>
              </div>
              <Link to="/admin/users">View →</Link>
            </div>
            <div className="stat-card trainers">
              <div className="stat-card-icon">🏅</div>
              <div>
                <h3>{trainers.length}</h3>
                <p>Total Trainers</p>
              </div>
              <Link to="/admin/users">View →</Link>
            </div>
          </div>

          {/* Low Capacity Warning */}
          {lowCapacity.length > 0 && (
            <div className="low-capacity-warning">
              <span>⚠️</span>
              <p>
                <strong>{lowCapacity.length} class{lowCapacity.length > 1 ? "es" : ""}</strong> have 5 or fewer slots remaining:{" "}
                {lowCapacity.map((c) => c.name).join(", ")}
              </p>
            </div>
          )}

          {/* Charts */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Memberships Over Time</h3>
              <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
            <div className="chart-card doughnut-card">
              <h3>Membership Plans</h3>
              <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
