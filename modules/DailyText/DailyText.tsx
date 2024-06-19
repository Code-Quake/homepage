"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import cheerio from "cheerio";
import parse from "html-react-parser";
import { Vortex } from "../ui/Vortex";

const DailyText = () => {
  const [dailyText, setDailyText] = useState("" as string | null);

  const today = new Date()
    .toISOString()
    .replace("-", "/")
    .split("T")[0]
    .replace("-", "/");

    const todayTFormat = new Date().toISOString().split("T")[0];

  const handleData = useCallback(async () => {
    const targetUrl = `/text/${today}`;
    const pageResponse = await axios.get(targetUrl);
    const $ = cheerio.load(pageResponse.data);
    let scrapeTest = $(`[data-date="${todayTFormat}T00:00:00.000Z"]`).html();

    setDailyText(scrapeTest);
  }, []);

  useEffect(() => {
    handleData();
  }, [handleData]);

  return (
    <div className="w-[calc(100%)] mx-auto overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <div className="dailyText">{parse(dailyText!)}</div>{" "}
      </Vortex>
    </div>
  );
};

export default DailyText;
