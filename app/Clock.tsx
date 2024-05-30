"use client"
import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFormat = navigator.language;
  const cityName = timeZone.split("/")[1].replaceAll("_", " ");
  const showSeconds = false;
  const use12Hour = true;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        Intl.DateTimeFormat(timeFormat, {
          timeZone,
          hour: "numeric",
          minute: "numeric",
          hourCycle: "h12",
        }).format()
      );
      setDate(
        new Date().toLocaleDateString(timeFormat, {
          weekday: "long",
          day: "numeric",
          year: "numeric",
          month: "short",
          timeZone,
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timeZone, timeFormat, showSeconds, use12Hour]);

  return (
    <div className="clock">
      <div className="upper">
        <p className="city">{cityName}</p>
        <p className="city">{time}</p>
        <p className="date">{date}</p>
      </div>
    </div>
  );
};

export default Clock;
