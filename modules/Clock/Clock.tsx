"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./Clock.module.css";

const Clock: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFormat = navigator.language;
  const cityName = "Scottsdale";//timeZone.split("/")[1].replace(/_/g, " ");

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
      <div
        className={`${styles.clockCard} bg-gradient-to-t from-[var(--dark-blue)] to-[var(--accent-blue)]`}
      >
        <div className={styles.upper}>
          <p className={styles.value}>{cityName}</p>
          <time
            className={styles.value}
            dateTime={formatTime()}
            suppressHydrationWarning
          >
            {formatTime()}
          </time>
          <time
            className={styles.value}
            dateTime={formatDate()}
            suppressHydrationWarning
          >
            {formatDate()}
          </time>
        </div>
      </div>
    </div>
  );
};

export default Clock;
