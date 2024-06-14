"use client";
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";

const Clock = () => {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  const [date, setDate] = useState(() => new Date().toLocaleDateString());

  const timeZoneName = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.split("/")[1]
    .replaceAll("_", " ");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setDate(new Date().toLocaleDateString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HoverBorderGradient className="clock"
      suppressHydrationWarning
      style={{ marginBottom: "12px", width: "100%" }}
    >
        <div className="upper">
          <p className="value">{timeZoneName}</p>
          <p className="value">{time}</p>
          <p className="value">{date}</p>
        </div>
    </HoverBorderGradient>
  );
};

export default Clock;
