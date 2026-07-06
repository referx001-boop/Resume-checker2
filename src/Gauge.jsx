import React from "react";

export const GAUGE_ZONES = [
  { max: 40, color: "#A93226", label: "Fail" },
  { max: 70, color: "#B8863B", label: "Borderline" },
  { max: 100, color: "#2E5339", label: "Pass" },
];

export function zoneFor(score) {
  return GAUGE_ZONES.find((z) => score <= z.max) || GAUGE_ZONES[2];
}

export function Gauge({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const zone = zoneFor(pct);
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, #A93226 0%, #A93226 40%, #B8863B 40%, #B8863B 70%, #2E5339 70%, #2E5339 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `calc(${pct}% - 2px)`,
            top: -4,
            width: 4,
            height: 18,
            background: "#1A1611",
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "#8A8375",
        }}
      >
        <span>0</span>
        <span>40</span>
        <span>70</span>
        <span>100</span>
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          fontWeight: 700,
          color: zone.color,
        }}
      >
        {zone.label.toUpperCase()}
      </div>
    </div>
  );
}
