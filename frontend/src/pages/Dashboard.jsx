import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!sessionStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
  }, []);

  const username = "Traveler";

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">

      <div className="dash-container">
        <h2>Welcome, {username} 👋</h2>

        {/* Menu */}
        <div className="menu">
          <Link to="/trips">🗺️ Trips</Link>
          <Link to="/journal">📓 Journal</Link>
          <Link to="/achievements">🏆 Achievements</Link>
          <Link to="/spin">🎡 Spin Wheel</Link>
          <Link to="/quests">🗡️ Quests</Link>
        </div>

        {/* Logout button */}
        <button className="logout-btn" onClick={handleLogout}>
          🔒 Logout
        </button>
      </div>
    </div>
  );
}
