import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import "./trips.css";

export default function Trips() {
  const userId = sessionStorage.getItem("userId");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [trips, setTrips] = useState([]);

  // Validate location
  const validatePlace = async (place) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      return res.data && res.data.length > 0;
    }
    catch {
      return false;
    }
  };

  // Add Trip
  const addTrip = async (e) => {
    e.preventDefault();
    if (!title || !location) return alert("Please fill all fields.");

    const valid = await validatePlace(location);
    if (!valid) return alert("❌ Invalid location!");

    try {
      const res = await axios.post("http://localhost:5000/api/trips/addTrip", {
        userId,
        title,
        location,
        notes,
      });

      const trip = res.data.trip;
      alert("✅ Trip added!");

      setTitle("");
      setLocation("");
      setNotes("");
      setTrips((prev) => [...prev, trip]);
    } catch (err) {
      console.error("Error adding trip:", err);
      alert("❌ Error adding trip");
    }
  };

  // Load Trips
  const loadTrips = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/myTrips/${userId}`);
      setTrips(res.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  // Delete trip
  const deleteTrip = async (tripId) => {
    if (!window.confirm("Delete this trip? 🗑️")) return;
    try {
      await axios.delete(`http://localhost:5000/api/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      alert("Trip deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting");
    }
  };

  useEffect(() => {
    if (userId) loadTrips();
  }, [userId]);

  return (
    <div className="trips-container">
      <h2>Your Trips ✈️</h2>

      {/* Add Trip Form */}
      <form className="trip-form" onSubmit={addTrip}>
        <input
          placeholder="Trip Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button>Add Trip</button>
      </form>

      {/* Trips List */}
      <div className="trip-list">
        {trips.length === 0 ? (
          <p>No trips yet. Start your adventure! 🌍</p>
        ) : (
          trips.map((trip) => (
            <div className="trip-card" key={trip._id}>
              
              {/* Card click navigates WITHOUT unmounting state */}
              <Link to={`/trip/${trip._id}`} className="trip-content">
                <h3>{trip.title}</h3>
                <p>📍 {trip.location}</p>
                {trip.notes && <p className="notes">📝 {trip.notes}</p>}
              </Link>

              {/* Delete Button */}
              <button
                className="delete-btn"
                onClick={() => deleteTrip(trip._id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
