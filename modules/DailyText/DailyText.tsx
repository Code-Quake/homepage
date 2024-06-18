"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import cheerio from "cheerio";
import parse from "html-react-parser";

const DailyText = () => {
  const [dailyText, setDailyText] = useState("" as string | null);

  const handleData = useCallback(async () => {
    const targetUrl = "/text/2024/6/18";
    const pageResponse = await axios.get(targetUrl);
    const $ = cheerio.load(pageResponse.data);
    let scrapeTest = $(`[data-date="2024-06-18T00:00:00.000Z"]`).html();

    setDailyText(scrapeTest);
  }, []);

  useEffect(() => {
    handleData();
  }, [handleData]);

  return (
    <div className="dailyText">
      {parse(dailyText!)}
    </div>
  );
};

export default DailyText;
