import React from "react";
import "./Legend.css";

export default function Legend() {
  return (
    <div className="legend">
      <h4>Transport Modes</h4>
      <ul>
        <li><span className="dot rail"></span> Rail</li>
        <li><span className="dot bus"></span> Bus</li>
        <li><span className="dot auto"></span> Auto</li>
        <li><span className="dot walk"></span> Walk</li>
      </ul>
    </div>
  );
}
