"use client";
import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import axios from "axios";
import cheerio from "cheerio";
import parse from "html-react-parser";
import { Vortex } from "../ui/Vortex";

const DailyText: React.FC = () => {
  const [dailyText, setDailyText] = useState<string | null>(null);

  const { today, todayTFormat } = useMemo(() => {
    const date = new Date();
    return {
      today: date.toISOString().slice(0, 10).replace(/-/g, "/"),
      todayTFormat: date.toISOString().split("T")[0],
    };
  }, []);

  const fetchDailyText = useCallback(async () => {
    try {
      const targetUrl = `/text/${today}`;
      const { data } = await axios.get(targetUrl);
      const $ = cheerio.load(data);
      const scrapeTest = $(
        `[data-date="${todayTFormat}T00:00:00.000Z"]`
      ).html();
      setDailyText(scrapeTest || null);
    } catch (error) {
      console.error("Error fetching daily text:", error);
      setDailyText(null);
    }
  }, [today, todayTFormat]);

  useEffect(() => {
    fetchDailyText();
  }, [fetchDailyText]);

  return (
    <div className="w-[calc(100%)] mx-auto overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <div className="dailyText">
          {dailyText ? parse(dailyText) : "Loading..."}
        </div>
      </Vortex>
    </div>
  );
};

export default memo(DailyText);
