import React from "react";
import RouteList from "./RouteList";

export default function JourneyPlanner({ routes, setSelectedRoute }) {
  return (
    <div className="journey-planner">
      <RouteList routes={routes} setSelectedRoute={setSelectedRoute} />
    </div>
  );
}
