import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Sidebar.css";

const Sidebar = ({ onRoutesFetched, onRouteClick, routes }) => {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [modes, setModes] = useState({ RAIL: true, BUS: true });
  const [maxTransfers, setMaxTransfers] = useState(0);
  const [lastMile, setLastMile] = useState("WALK");
  const [error, setError] = useState(null);

  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations.json", err));
  }, []);

  // 🔄 Swap function
  const swapStations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleToggleMode = (mode) => {
    setModes((prev) => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };

  // Mumbai local fare estimation
  const estimateMumbaiFare = (distanceMeters) => {
    const km = distanceMeters / 1000;
    if (km <= 10) return 10;
    if (km <= 35) return 20;
    if (km <= 50) return 30;
    if (km <= 70) return 40;
    return 60;
  };

  // Last-mile multipliers
  const lastMileCostMultiplier = {
    WALK: 1,
    AUTO: 1.2,
    CAB: 1.5,
  };

  const handleFindRoutes = async () => {
    if (!from || !to) {
      alert("Please choose both stations");
      return;
    }

    try {
      setError(null);
      const url = new URL("http://localhost:8080/otp/routers/default/plan");
      url.searchParams.append("fromPlace", from.value);
      url.searchParams.append("toPlace", to.value);

      const activeModes = Object.keys(modes).filter((m) => modes[m]);
      if (activeModes.length === 0) {
        alert("Please select at least one mode (Rail/Bus)");
        return;
      }

      url.searchParams.append("mode", `WALK,${activeModes.join(",")}`);
      url.searchParams.append("maxTransfers", maxTransfers);
      url.searchParams.append("numItineraries", 3);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();

      if (!data.plan || !data.plan.itineraries) {
        setError("No routes found");
        onRoutesFetched([]);
        return;
      }

      let itineraries = data.plan.itineraries.map((it, idx) => {
        // Base OTP fare
        let baseCost = it.fare?.fare?.INR?.cents / 100;

        // If missing, use Mumbai fare estimate
        if (!baseCost || isNaN(baseCost)) {
          const totalDistance = it.legs.reduce(
            (sum, leg) => sum + (leg.distance || 0),
            0
          );
          baseCost = estimateMumbaiFare(totalDistance);
        }

        let cost = baseCost;

        // Last mile adjustment
        if (lastMile !== "WALK" && it.legs.length > 0) {
          const lastLeg = it.legs[it.legs.length - 1];
          lastLeg.mode = lastMile;

          if (lastMile === "AUTO") {
            lastLeg.duration = lastLeg.duration * 0.7;
            cost = baseCost * lastMileCostMultiplier.AUTO + 40;
          } else if (lastMile === "CAB") {
            lastLeg.duration = lastLeg.duration * 0.5;
            cost = baseCost * lastMileCostMultiplier.CAB + 100;
          }
        }

        return {
          id: idx,
          duration: Math.round(it.duration / 60),
          cost: Math.round(cost),
          transfers: it.transfers,
          legs: it.legs,
          tags: [],
        };
      });

      // 🏆 Tag fastest, cheapest, least transfers
      const fastest = itineraries.reduce((a, b) =>
        a.duration < b.duration ? a : b
      );
      const cheapest = itineraries.reduce((a, b) =>
        a.cost < b.cost ? a : b
      );
      const leastTransfers = itineraries.reduce((a, b) =>
        a.transfers < b.transfers ? a : b
      );

      itineraries = itineraries.map((it) => {
        const tags = [];
        if (it.id === fastest.id) tags.push("fastest");
        if (it.id === cheapest.id) tags.push("cheapest");
        if (it.id === leastTransfers.id) tags.push("leastTransfers");
        return { ...it, tags };
      });

      onRoutesFetched(itineraries);
      setSelectedRoute(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch routes. Check backend.");
      onRoutesFetched([]);
    }
  };

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    onRouteClick(route);
  };

  return (
    <div className="sidebar">
      <h2>Journey Planner</h2>

      {/* From */}
      <label>From:</label>
      <Select
        options={stations}
        value={from}
        onChange={setFrom}
        placeholder="Start station"
        isSearchable
      />

      <button className="swap-btn" onClick={swapStations}>⇅ Swap</button>

      {/* To */}
      <label>To:</label>
      <Select
        options={stations}
        value={to}
        onChange={setTo}
        placeholder="Destination"
        isSearchable
      />

      {/* Modes */}
      <label>Mode:</label>
      <div className="mode-buttons">
        <button
          className={`mode-btn ${modes.RAIL ? "active" : ""}`}
          onClick={() => handleToggleMode("RAIL")}
        >
          Rail
        </button>
        <button
          className={`mode-btn ${modes.BUS ? "active" : ""}`}
          onClick={() => handleToggleMode("BUS")}
        >
          Bus
        </button>
      </div>

      {/* Transfers + Last Mile */}
      <div className="row">
        <div className="half">
          <label>Max Transfers:</label>
          <select
            value={maxTransfers}
            onChange={(e) => setMaxTransfers(Number(e.target.value))}
          >
            <option value={0}>Direct</option>
            <option value={1}>1 Transfer</option>
            <option value={2}>2 Transfers</option>
          </select>
        </div>
        <div className="half">
          <label>Last Mile:</label>
          <select
            value={lastMile}
            onChange={(e) => setLastMile(e.target.value)}
          >
            <option value="AUTO">Auto</option>
            <option value="CAB">Ola/Uber</option>
            <option value="WALK">Walk</option>
          </select>
        </div>
      </div>

      <button onClick={handleFindRoutes}>Find Routes</button>
      {error && <p className="error">{error}</p>}

      {/* Route List */}
      <div className="route-list">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`route-card ${selectedRoute?.id === route.id ? "selected" : ""}`}
            onClick={() => handleRouteClick(route)}
          >
            <div className="route-header">
              <span>{route.duration} min</span>
              <span>₹{route.cost}</span>
            </div>

            {/* Tags */}
            <div className="route-tags">
              {route.tags.includes("fastest") && (
                <span className="tag tag-fastest">Fastest</span>
              )}
              {route.tags.includes("cheapest") && (
                <span className="tag tag-cheapest">Cheapest</span>
              )}
              {route.tags.includes("leastTransfers") && (
                <span className="tag tag-transfers">Least Transfers</span>
              )}
            </div>

            {/* Summary */}
            <div className="route-details">
              Transfers: {route.transfers} <br />
              Modes: {route.legs.map((l) => l.mode).join(" → ")}
            </div>

            {/* Expanded Journey Steps */}
            {selectedRoute?.id === route.id && (
              <div className="route-steps">
                <h4>Journey Details:</h4>
                <ul>
                  {route.legs.map((leg, idx) => (
                    <li key={idx}>
                      <b>{leg.mode}</b> from <i>{leg.from.name}</i> to{" "}
                      <i>{leg.to.name}</i>{" "}
                      ({Math.round(leg.duration / 60)} min)
                      {leg.route && ` via ${leg.route}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
