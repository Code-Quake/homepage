"use client"
import React, { useState, useEffect } from "react";
import styles from "./Clock.module.css";

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
    <div className={styles.clock} suppressHydrationWarning>
      <div className={styles.upper}>
        <p className={styles.city}>{timeZoneName}</p>
        <p className={styles.city}>{time}</p>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};

export default Clock;
