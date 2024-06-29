"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Div } from "@/modules/ui/MovingBorder";

const Clock: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFormat = navigator.language;
  const cityName = timeZone.split("/")[1].replace(/_/g, " ");

  const formatTime = useCallback(() => {
    return new Intl.DateTimeFormat(timeFormat, {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h12",
    }).format(currentDateTime);
  }, [timeFormat, timeZone, currentDateTime]);

  const formatDate = useCallback(() => {
    return new Intl.DateTimeFormat(timeFormat, {
      weekday: "long",
      day: "numeric",
      year: "numeric",
      month: "short",
      timeZone,
    }).format(currentDateTime);
  }, [timeFormat, timeZone, currentDateTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "10px 10px 0px 10px" }}>
      <Div
        suppressHydrationWarning
        borderRadius="7px"
        className="bg-white dark:bg-[var(--dark-blue)] text-black dark:text-white border-neutral-200 dark:border-slate-800 clock"
        style={{
          height: "fit-content",
          width: "100%",
        }}
      >
        <div className="upper">
          <p className="city">{cityName}</p>
          <time
            className="value"
            dateTime={formatTime()}
            suppressHydrationWarning
          >
            {formatTime()}
          </time>
          <time
            className="value"
            dateTime={formatDate()}
            suppressHydrationWarning
          >
            {formatDate()}
          </time>
        </div>
      </Div>
    </div>
  );
};

export default Clock;
