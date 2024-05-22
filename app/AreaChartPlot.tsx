"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import widgetApiEndpoints from "@/utils/defaults";
import { putCommasInBigNum, showNumAsThousand } from "@/utils/MiscHelpers";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface IData {
  user: string;
  total_xp: number;
  new_xp: number;
  languages: {
    [x: string]: {
      new_xps: number;
      xps: number;
    };
  };
  dates: {
    [x: string]: any;
  };
  machines: {
    [x: string]: {
      xps: number;
    };
  };
}

export const CodeStatsWidget = () => {
  const [basicInfo, setBasicInfo] = useState({
    username: "",
    level: "0",
    newXp: 0,
    totalXp: 0,
  });

  const [langXPValuesUse, setlangXPValuesUse] = useState([0, 0, 0]);
  const [langLabelsUse, setlangLabelsUse] = useState(["", "", ""]);
  const [chartId] = useState(Math.random().toString(36).substring(2, 7));
  const [data, setData] = useState<IData>({} as IData);

  const handleData = useCallback(() => {
    const langLabels: string[] = [];
    const langXpValues: number[] = [];

    setBasicInfo({
      username: data.user,
      level: makeLevel(data.total_xp),
      totalXp: data.total_xp,
      newXp: data.new_xp,
    });

    let sortedLanguages = data.languages;
    let othersXps = 0;

    Object.keys(sortedLanguages)
      .sort(function (a, b) {
        return sortedLanguages[b].xps - sortedLanguages[a].xps;
      })
      .forEach(function (key) {
        if (sortedLanguages[key].xps > 3500) {
          langLabels.push(key);
          langXpValues.push(sortedLanguages[key].xps);
        } else {
          othersXps += sortedLanguages[key].xps;
        }
      });

    langLabels.push("Others");
    langXpValues.push(othersXps);

    setlangXPValuesUse(langXpValues);
    setlangLabelsUse(langLabels);
  }, [data.languages, data.new_xp, data.total_xp, data.user]);

  const makeLevel = (xp: number) => {
    if (xp < 100) return "New Joiner";
    if (xp < 1000) return "Noob";
    if (xp < 10000) return "Intermediate";
    if (xp < 50000) return "Code ninja in the making";
    if (xp < 100000) return "Expert Developer";
    if (xp < 500000) return "Ultra Expert Developer";
    if (xp < 1000000) return "Code Super Hero";
    if (xp < 1500000) return "Super Epic Code Hero";
    if (xp >= 15000000) return "God Level";
    return "Unknown";
  };

  const formatTotalXp = (bigNum: any) => showNumAsThousand(bigNum);
  const formatNewXp = (newXp: any) => `+${putCommasInBigNum(newXp)} XP`;

  useEffect(() => {
    axios
      .get(`${widgetApiEndpoints.codeStats}/api/users/codequake`)
      .then((response) => {
        setData(response.data);
        handleData();
      })
      .catch((dataFetchError) => {
        console.error(
          "Unable to fetch data from CodeStats.net",
          dataFetchError
        );
      });
  }, [handleData]);

  const options: ApexOptions = {
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    theme: {
      palette: "palette10", // upto palette10
    },
    legend: {
      position: "bottom",
      horizontalAlign: "left",
      labels: {
        colors: [
          "#ff00ff",
          "#b366ff",
          "#6666ff",
          "#2983FF",
          "#00B1F2",
          "#ff00ff",
          "#b366ff",
          "#6666ff",
          "#2983FF",
          "#00B1F2",
          "#ff00ff",
        ],
        useSeriesColors: false,
      },
      formatter: function (legendName: string, opts?: any) {
        let test: string =
          legendName +
          ": " +
          showNumAsThousand(opts.w.globals.series[opts.seriesIndex]);
        return test;
      },
    },
    labels: langLabelsUse,
  };

  return (
    <div className="code-stats-wrapper">
      <div className="user-meta">
        <div className="user-info-wrap">
          <p className="username">CodeQuake</p>
          <p className="user-level">{basicInfo.level}</p>
        </div>
        <div className="total-xp-wrap">
          <p className="total-xp">{formatTotalXp(basicInfo.totalXp)}</p>
          <p className="new-xp">{formatNewXp(basicInfo.newXp)}</p>
        </div>
      </div>
      <div id={`languages-${chartId}`} className="language-pie-chart">
        <div id="chart">
          <ReactApexChart
            options={options}
            series={langXPValuesUse}
            type="donut"
            width={530}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeStatsWidget;
