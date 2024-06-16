"use client";
import React, { useState, useEffect } from "react";
import { Div } from "@/modules/ui/MovingBorder";

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
    <Div
      borderRadius="1.75rem"
      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 clock"
      style={{
        height: "fit-content",
        width: "100%",
      }}
    >
      <div className="upper">
        <p className="value">{timeZoneName}</p>
        <p className="value">{time}</p>
        <p className="value">{date}</p>
      </div>
    </Div>
  );
};

export default Clock;
