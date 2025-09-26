import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { decodePolyline } from "../utils/polyline";

const modeColors = {
  RAIL: "#2563eb",
  BUS: "#f97316",
  WALK: "#6b7280",
  AUTO: "#16a34a",
  CAB: "#10b981",
};

const MapView = ({ route }) => {
  const center = [19.076, 72.8777]; // Mumbai

  // ✅ Collect modes present in the current route
  const usedModes = route
    ? [...new Set(route.legs.map((leg) => leg.mode))]
    : [];

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer center={center} zoom={12} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* ✅ Route polylines */}
        {route &&
          route.legs.map((leg, idx) => {
            const coords = decodePolyline(leg.legGeometry.points);
            return (
              <Polyline
                key={idx}
                positions={coords}
                pathOptions={{
                  color: modeColors[leg.mode] || "#000",
                  weight: 4,
                }}
              />
            );
          })}

        {/* ✅ Origin markers */}
        {route &&
          route.legs.map((leg, idx) => (
            <Marker key={`from-${idx}`} position={[leg.from.lat, leg.from.lon]}>
              <Popup>{leg.from.name}</Popup>
            </Marker>
          ))}

        {/* ✅ Destination marker (last stop) */}
        {route && route.legs.length > 0 && (
          <Marker
            key="to"
            position={[
              route.legs[route.legs.length - 1].to.lat,
              route.legs[route.legs.length - 1].to.lon,
            ]}
          >
            <Popup>{route.legs[route.legs.length - 1].to.name}</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* ✅ Legend fixed at bottom-right */}
      {usedModes.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            right: "15px",
            background: "white",
            padding: "10px 14px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            fontSize: "13px",
            lineHeight: "18px",
          }}
        >
          {usedModes.map((mode) => (
            <div
              key={mode}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  backgroundColor: modeColors[mode] || "#000",
                  marginRight: "8px",
                  borderRadius: "3px",
                }}
              ></span>
              {mode}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapView;
