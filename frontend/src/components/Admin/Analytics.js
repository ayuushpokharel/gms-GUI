import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import { getAnalytics } from "../../actions/analyticsAction";
import "./Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Analytics = () => {
  const dispatch = useDispatch();
  const { loading, analytics } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  if (loading || !analytics) return <Loader />;

  const {
    monthlyRevenue,
    monthlyMemberships,
    monthlyUsers,
    statusBreakdown,
    planBreakdown,
    topClasses,
    summary,
  } = analytics;

  // ── Chart configs ──────────────────────────────────────────────────────────

  const revenueLineData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Revenue (Rs.)",
        data: monthlyRevenue,
        fill: true,
        backgroundColor: "rgba(230,57,70,0.08)",
        borderColor: "#E63946",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const membershipBarData = {
    labels: MONTHS,
    datasets: [
      {
        label: "New Memberships",
        data: monthlyMemberships,
        backgroundColor: "#E63946",
        borderRadius: 4,
      },
      {
        label: "New Members",
        data: monthlyUsers,
        backgroundColor: "#1d3557",
        borderRadius: 4,
      },
    ],
  };

  const statusColors = {
    Active: "#4caf50",
    Processing: "#ff9800",
    Expired: "#e53935",
  };
  const statusLabels = statusBreakdown.map((s) => s._id);
  const statusCounts = statusBreakdown.map((s) => s.count);

  const statusDoughnutData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: statusLabels.map((l) => statusColors[l] || "#999"),
        borderWidth: 0,
      },
    ],
  };

  const planColors = {
    Basic: "#2196F3",
    Standard: "#9C27B0",
    Premium: "#FF9800",
  };
  const planLabels = planBreakdown.map((p) => p._id);

  const planBarData = {
    labels: planLabels,
    datasets: [
      {
        label: "Revenue (Rs.)",
        data: planBreakdown.map((p) => p.revenue),
        backgroundColor: planLabels.map((l) => planColors[l] || "#999"),
        borderRadius: 6,
      },
    ],
  };

  const chartOpts = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f0f0f0" }, beginAtZero: true },
    },
  });

  return (
    <>
      <MetaData title="Analytics — GMS Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">📈 Analytics</h1>
          <p className="analytics-sub">
            Current year overview · {new Date().getFullYear()}
          </p>

          {/* Summary Cards */}
          <div className="analytics-cards">
            <div className="an-card green">
              <span className="an-icon">💰</span>
              <div>
                <h3>Rs. {summary.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="an-card blue">
              <span className="an-icon">✅</span>
              <div>
                <h3>{summary.activeMemberships}</h3>
                <p>Active Memberships</p>
              </div>
            </div>
            <div className="an-card purple">
              <span className="an-icon">👥</span>
              <div>
                <h3>{summary.totalUsers}</h3>
                <p>Total Members</p>
              </div>
            </div>
            <div className="an-card orange">
              <span className="an-icon">🏋️</span>
              <div>
                <h3>{summary.totalClasses}</h3>
                <p>Total Classes</p>
              </div>
            </div>
            <div className="an-card red">
              <span className="an-icon">🏅</span>
              <div>
                <h3>{summary.totalTrainers}</h3>
                <p>Trainers</p>
              </div>
            </div>
            <div className="an-card gray">
              <span className="an-icon">📋</span>
              <div>
                <h3>{summary.totalMemberships}</h3>
                <p>All Memberships</p>
              </div>
            </div>
          </div>

          {/* Revenue Line Chart */}
          <div className="analytics-chart-full">
            <h3>Monthly Revenue</h3>
            <Line data={revenueLineData} options={chartOpts("Revenue")} />
          </div>

          {/* Membership + User Growth Bar */}
          <div className="analytics-chart-full">
            <h3>Membership & Member Growth</h3>
            <Bar
              data={membershipBarData}
              options={{
                ...chartOpts("Growth"),
                plugins: { legend: { display: true, position: "top" } },
              }}
            />
          </div>

          {/* Two small charts side by side */}
          <div className="analytics-charts-row">
            <div className="analytics-chart-half">
              <h3>Membership Status</h3>
              <div className="doughnut-wrap">
                <Doughnut
                  data={statusDoughnutData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            </div>

            <div className="analytics-chart-half">
              <h3>Revenue by Plan</h3>
              <Bar
                data={planBarData}
                options={{
                  ...chartOpts("Plans"),
                  plugins: { legend: { display: false } },
                }}
              />
              <div className="plan-table">
                {planBreakdown.map((p) => (
                  <div key={p._id} className="plan-row">
                    <span
                      className="plan-dot"
                      style={{ background: planColors[p._id] || "#999" }}
                    />
                    <span className="plan-name">{p._id}</span>
                    <span className="plan-count">{p.count} sold</span>
                    <span className="plan-rev">
                      Rs. {p.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Classes Table */}
          <div className="analytics-chart-full">
            <h3>Top Classes by Enrollment</h3>
            <table className="top-classes-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Class Name</th>
                  <th>Category</th>
                  <th>Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {topClasses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", color: "#999" }}
                    >
                      No data yet
                    </td>
                  </tr>
                ) : (
                  topClasses.map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>{c.name}</td>
                      <td>
                        <span className="category-badge">{c.category}</span>
                      </td>
                      <td>
                        <strong>{c.enrollments}</strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
