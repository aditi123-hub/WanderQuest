import React, { useEffect, useState } from "react";
import axios from "axios";
import "./achievements.css";

export default function Achievements() {
  const [trips, setTrips] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/trips/myTrips/${userId}`
        );
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, [userId]);

  const GLOBAL_BADGES = [
    { name: "Souvenir Collector", key: "souvenir", desc: "Collect a souvenir on any trip." },
    { name: "Journalist", key: "journal_written", desc: "Write at least one journal entry." },
    { name: "Sunset Chaser", key: "sunset", desc: "Capture a sunset photo." },
    { name: "Local Historian", key: "local_history", desc: "Check in at a historic place." },
    { name: "Friendly Traveler", key: "friendly", desc: "Interact with a local or traveler." },
    { name: "Explorer Badge", key: "explorer", desc: "Visit 3 or more places in one trip." },
    { name: "Memory Keeper", key: "memory_keeper", desc: "Add photos to your journal." },
    { name: "Epic Explorer", key: "epic_explorer", desc: "Complete all quests in a trip." },
    { name: "Foodie", key: "foodie", desc: "Try local food and log it." },
    { name: "Social Butterfly", key: "social_butterfly", desc: "Share a moment with friends." },
  ];

  const questStatus = {};
  trips.forEach((trip) => {
    Object.entries(trip.quests || {}).forEach(([quest, done]) => {
      if (done) questStatus[quest] = true;
    });
  });

  const badges = GLOBAL_BADGES.map((badge) => ({
    ...badge,
    unlocked: questStatus[badge.key] === true,
  }));

  return (
    <div className="achievements-page">
      <h2>Your Achievements 🏆</h2>

      <div className="badges-container">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`badge ${badge.unlocked ? "unlocked" : "locked"}`}
          >
            <div className="badge-icon">{badge.name.charAt(0)}</div>

            <div className="badge-details">
              <span className="badge-name">{badge.name}</span>
              <span className="badge-status">
                {badge.unlocked ? "Unlocked ✓" : "Locked 🔒"}
              </span>
            </div>

            {/* Info Button */}
            <div
              className="info-btn"
              onClick={() =>
                setActiveTooltip(activeTooltip === index ? null : index)
              }
            >
              i
            </div>

            {/* Tooltip */}
            <div
              className={`tooltip ${
                activeTooltip === index ? "show" : ""
              }`}
            >
              {badge.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
