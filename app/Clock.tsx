"use client"
import React, { useState, useEffect } from "react";

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
    <div className="clock" suppressHydrationWarning>
      <div className="upper">
        <p className="city">{timeZoneName}</p>
        <p className="city">{time}</p>
        <p className="date">{date}</p>
      </div>
    </div>
  );
};

export default Clock;
