"use client";
import React, { useState, useEffect } from "react";
import { Div } from "@/modules/ui/MovingBorder";

const Clock = () => {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  const [date, setDate] = useState(() => new Date().toLocaleDateString());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFormat = navigator.language;
  const showSeconds = false;
  const use12Hour = true;
  const cityName = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.split("/")[1]
    .replaceAll("_", " ");

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
    <Div
      suppressHydrationWarning
      borderRadius="1.75rem"
      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 clock"
      style={{
        height: "fit-content",
        width: "100%",
      }}
    >
      <div className="upper">
        <p className="city">{cityName}</p>
        <p className="value">{time}</p>
        <p className="value">{date}</p>
      </div>
    </Div>
  );
};

export default Clock;
