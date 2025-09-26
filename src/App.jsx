import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import "./App.css";

function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <div className="app">
      <div className="content">
        <Sidebar
          onRoutesFetched={(newRoutes) => {
            setRoutes(newRoutes);
            setSelectedRoute(null); // reset selection
          }}
          onRouteClick={(route) => setSelectedRoute(route)} // user clicks a card
          routes={routes}
        />
        <div className="map-container">
          <MapView route={selectedRoute} />
        </div>
      </div>
    </div>
  );
}

export default App;
