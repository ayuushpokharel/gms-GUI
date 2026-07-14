import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getMyAttendance } from "../../actions/attendanceAction";
import Loader from "../layout/Loader/Loader";
import "./Attendance.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DOUGHNUT_COLORS = [
  "#e53935",
  "#43a047",
  "#1e88e5",
  "#fb8c00",
  "#8e24aa",
  "#00acc1",
];

// Build the last `weeks` weeks of the heatmap grid, oldest-first columns,
// Sunday-to-Saturday rows — like a GitHub contribution graph.
const buildHeatmapWeeks = (heatmap, weeks = 12) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start on the Sunday of the current week, then go back `weeks` weeks
  const end = new Date(today);
  end.setDate(end.getDate() - end.getDay());
  const start = new Date(end);
  start.setDate(start.getDate() - (weeks - 1) * 7);

  const columns = [];
  for (let w = 0; w < weeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(day.getDate() + w * 7 + d);
      const key = day.toISOString().slice(0, 10);
      days.push({ key, count: heatmap[key] || 0, future: day > today });
    }
    columns.push(days);
  }
  return columns;
};

const heatColor = (count) => {
  if (count === 0) return "#ebedf0";
  if (count === 1) return "#ffcdd2";
  if (count === 2) return "#e57373";
  if (count === 3) return "#e53935";
  return "#b71c1c";
};

const AttendanceStats = () => {
  const dispatch = useDispatch();
  const { loading, stats } = useSelector((state) => state.myAttendance);

  useEffect(() => {
    dispatch(getMyAttendance());
  }, [dispatch]);

  if (loading || !stats) return <Loader />;

  if (stats.totalSessions === 0) {
    return (
      <div className="attendance-stats">
        <p className="no-entries">
          No check-ins yet. Head to "Check In" to log today's class.
        </p>
      </div>
    );
  }

  const heatmapWeeks = buildHeatmapWeeks(stats.heatmap);
  const breakdownEntries = Object.entries(stats.classBreakdown);

  const doughnutData = {
    labels: breakdownEntries.map(([name]) => name),
    datasets: [
      {
        data: breakdownEntries.map(([, count]) => count),
        backgroundColor: breakdownEntries.map(
          (_, i) => DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length],
        ),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="attendance-stats">
      <div className="attendance-summary">
        <div className="summary-card">
          <span className="summary-number">{stats.streak}</span>
          <span className="summary-label">
            Day{stats.streak === 1 ? "" : "s"} Streak
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{stats.sessionsThisWeek}</span>
          <span className="summary-label">This Week</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">{stats.totalSessions}</span>
          <span className="summary-label">Total Sessions</span>
        </div>
      </div>

      <div className="heatmap-section">
        <h3>Attendance Heatmap</h3>
        <div className="heatmap-grid">
          {heatmapWeeks.map((week, wi) => (
            <div className="heatmap-col" key={wi}>
              {week.map((day) => (
                <div
                  key={day.key}
                  className="heatmap-cell"
                  title={`${day.key}: ${day.count} check-in${
                    day.count === 1 ? "" : "s"
                  }`}
                  style={{
                    background: day.future
                      ? "transparent"
                      : heatColor(day.count),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {breakdownEntries.length > 0 && (
        <div className="breakdown-section">
          <h3>Attendance by Class</h3>
          <div className="breakdown-chart">
            <Doughnut
              data={doughnutData}
              options={{ plugins: { legend: { position: "right" } } }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceStats;
