import React from "react";
import "./RouteCard.css";

export default function RouteCard({ route, onSelect }) {
  return (
    <div className={`route-card ${route.type.toLowerCase()}`}>
      <div className="card-header">
        <span className={`tag ${route.type.toLowerCase()}`}>{route.type}</span>
        <span>{route.duration} min</span>
        <span>₹{route.cost}</span>
      </div>
      <div className="card-body">
        <p>
          <strong>{route.from}</strong> → <strong>{route.to}</strong>
        </p>
        <p>
          Transfers: {route.transfers} | Modes:{" "}
          {route.legs.map((l) => (
            <span key={l} className={`mode ${l.toLowerCase()}`}>
              {l}
            </span>
          ))}
        </p>
      </div>
      <button className="book-btn" onClick={onSelect}>
        Book Last-mile
      </button>
    </div>
  );
}
