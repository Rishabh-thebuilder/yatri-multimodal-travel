import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Sidebar.css";

const Sidebar = ({ from, to, setFrom, setTo, routes, setRoutes }) => {
  const [stations, setStations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  // Load stations.json once
  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations.json", err));
  }, []);

  // Swap from/to
  const handleReverse = () => {
    setSelectedFrom(selectedTo);
    setSelectedTo(selectedFrom);
    setFrom(selectedTo ? selectedTo.value : null);
    setTo(selectedFrom ? selectedFrom.value : null);
  };

  // Call backend OTP API
  const handleSearch = async () => {
    if (!selectedFrom || !selectedTo) {
      alert("Please select both stations");
      return;
    }

    const [fromLat, fromLon] = selectedFrom.value.split(",");
    const [toLat, toLon] = selectedTo.value.split(",");

    try {
      const res = await fetch(
        `http://localhost:8080/otp/routers/default/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=TRANSIT,WALK&numItineraries=5`
      );
      const data = await res.json();

      if (data.plan && data.plan.itineraries) {
        const formattedRoutes = data.plan.itineraries.map((it, idx) => ({
          id: idx,
          duration: Math.round(it.duration / 60), // minutes
          transfers: it.transfers,
          legs: it.legs,
          cost: Math.floor(Math.random() * 50) + 10 // mock cost
        }));
        setRoutes(formattedRoutes);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error("Error fetching routes", err);
      setRoutes([]);
    }
  };

  return (
    <div className="sidebar">
      <h2>Journey Planner</h2>

      <label>From:</label>
      <Select
        options={stations}
        value={selectedFrom}
        onChange={(opt) => {
          setSelectedFrom(opt);
          setFrom(opt.value);
        }}
        placeholder="Search start station"
        isSearchable
      />

      <label>To:</label>
      <Select
        options={stations}
        value={selectedTo}
        onChange={(opt) => {
          setSelectedTo(opt);
          setTo(opt.value);
        }}
        placeholder="Search destination"
        isSearchable
      />

      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
        <button onClick={handleSearch}>Find Routes</button>
        <button onClick={handleReverse}>🔄 Reverse</button>
      </div>

      <h3>Available Routes</h3>
      <div className="routes-list">
        {routes.length === 0 ? (
          <p>No routes found</p>
        ) : (
          routes.map((route) => (
            <div
              key={route.id}
              className="route-card"
              onClick={() => {
                // highlight this route
                setRoutes((prev) =>
                  prev.map((r) => ({ ...r, active: r.id === route.id }))
                );
              }}
            >
              <div className="route-summary">
                <span>🕒 {route.duration} min</span>
                <span>🔄 {route.transfers} transfers</span>
                <span>₹{route.cost}</span>
              </div>
              <div className="route-steps">
                {route.legs.map((leg, idx) => (
                  <span key={idx} className={`mode-${leg.mode.toLowerCase()}`}>
                    {leg.mode}
                    {idx < route.legs.length - 1 && " → "}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
