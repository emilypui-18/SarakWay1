import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Bell,
  Megaphone,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import "../../styles/guideDashboard.css";

const COLORS = ["#16a34a", "#f59e0b", "#9ca3af"];

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "G";
}

export default function GuideDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    completionPct: 0,
  });
  
  useEffect(() => {
      console.log("DEBUG: Current User Object from Storage:", user);
      
      if (!user || !user.user_id) {
        console.log("DEBUG: Redirecting to login because user_id is missing");
        navigate("/login");
        return;
      }
      fetchProgress();
      fetchNotifications();
  }, []);
  
  const fetchProgress = async () => {
    try {
      const res = await fetch(
        `http://10.244.107.80:3000/courses/progress/${user.user_id}`
      );
      const data = await res.json();

      const published = data.filter((c) => c.status === "Published");
      setCourses(published);

      const completed = published.filter(
        (c) => Number(c.is_completed) === 1
      ).length;

      const inProgress = published.filter((c) => {
        const p = Number(c.progress_percentage);
        return p > 0 && Number(c.is_completed) !== 1;
      }).length;

      const notStarted = published.length - completed - inProgress;
      const completionPct = published.length
        ? Math.round((completed / published.length) * 100)
        : 0;

      setStats({
        total: published.length,
        completed,
        inProgress,
        notStarted,
        completionPct,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `http://10.244.107.80:3000/notifications/user/${user.user_id}`
      );
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* pick highest-progress in-progress course as "continue learning" */
  const continueCourse = useMemo(() => {
    const inProg = courses.filter((c) => {
      const p = Number(c.progress_percentage);
      return p > 0 && Number(c.is_completed) !== 1;
    });
    if (!inProg.length) return null;
    return [...inProg].sort(
      (a, b) =>
        Number(b.progress_percentage) - Number(a.progress_percentage)
    )[0];
  }, [courses]);

  const statusData = [
    { name: "Completed", value: stats.completed },
    { name: "In Progress", value: stats.inProgress },
    { name: "Not Started", value: stats.notStarted },
  ];

  const progressData = courses.map((c) => ({
    name:
      (c.course_name || c.title || "Course").length > 14
        ? (c.course_name || c.title).slice(0, 12) + "…"
        : c.course_name || c.title || "Course",
    progress: Number(c.progress_percentage) || 0,
  }));

  return (
    <div className="guide-dashboard">
      {/* ================= HERO HEADER ================= */}
      <header className="dash-hero">
        <div className="dash-hero-text">
          <div className="eyebrow">Park Guide Portal</div>
          <h1>
            {greetingByHour()}, {user.user_name || "Guide"} 🌿
          </h1>
          <p>
            Here's a snapshot of your training journey across Sarawak's
            national parks.
          </p>
        </div>

        <div className="dash-hero-badge">
          <div className="dash-hero-avatar">
            {initials(user.user_name)}
          </div>
          <div className="dash-hero-meta">
            <strong>{user.user_name || "Guide"}</strong>
            <small>{user.email || user.role || "Guide"}</small>
          </div>
        </div>
      </header>

      {/* ================= STAT CARDS ================= */}
      <div className="dash-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={24} />
          </div>
          <div className="stat-body">
            <div className="value">{stats.total}</div>
            <div className="label">Total Courses</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-body">
            <div className="value">{stats.completed}</div>
            <div className="label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div className="stat-body">
            <div className="value">{stats.inProgress}</div>
            <div className="label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-body">
            <div className="value">{stats.completionPct}%</div>
            <div className="label">Overall Completion</div>
          </div>
        </div>
      </div>

      {/* ================= CONTINUE LEARNING ================= */}
      {continueCourse && (
        <div className="continue-card">
          <div className="continue-info">
            <h3>Continue learning</h3>
            <h2>
              {continueCourse.course_name ||
                continueCourse.title ||
                "Your course"}
            </h2>
            <div className="meta">
              {Number(continueCourse.progress_percentage) || 0}% complete
            </div>
          </div>

          <div className="continue-progress">
            <div className="bar">
              <span
                style={{
                  width: `${Number(continueCourse.progress_percentage) || 0}%`,
                }}
              />
            </div>
          </div>

          <button
            className="continue-btn"
            onClick={() =>
              navigate(
                `/guide/courses/${
                  continueCourse.course_id || continueCourse.id
                }`
              )
            }
          >
            Resume <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </div>
      )}

      {/* ================= CHARTS ================= */}
      <div className="dash-charts">
        {/* LINE CHART */}
        <div className="chart-card">
          <h2>Progress by Course</h2>
          <p className="chart-sub">
            How far you've gone in each published course
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4, fill: "#16a34a" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="chart-card">
          <h2>Training Status</h2>
          <p className="chart-sub">Breakdown of your enrolled courses</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="notif-card">
        <div className="notif-head">
          <h2>
            <Bell size={18} /> Recent Notifications
          </h2>
          <a onClick={() => navigate("/guide/notifications")}>View all</a>
        </div>

        {notifications.length === 0 ? (
          <p className="notif-empty">
            You're all caught up — no new notifications.
          </p>
        ) : (
          <ul className="notif-list">
            {notifications.map((n, i) => (
              <li className="notif-item" key={n.notification_id || i}>
                <div className="notif-ico">
                  <Megaphone size={18} />
                </div>
                <div className="notif-body">
                  <div className="notif-title">
                    {n.title || n.message_title || "Notification"}
                  </div>
                  <div className="notif-msg">
                    {n.message || n.body || ""}
                  </div>
                  <div className="notif-time">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleString()
                      : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
