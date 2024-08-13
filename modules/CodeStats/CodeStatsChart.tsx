import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { putCommasInBigNum, showNumAsThousand } from "@/utils/MiscHelpers";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IData, IBasicInfo } from "./CodeStatsInterfaces";
import styles from "./CodeStats.module.css";

const CodeStatsWidget: React.FC = () => {
  const [data, setData] = useState<IData | null>(null);

  const makeLevel = useCallback((xp: number): string => {
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
  }, []);

  const { basicInfo, langXPValuesUse, langLabelsUse } = useMemo(() => {
    if (!data)
      return {
        basicInfo: {} as IBasicInfo,
        langXPValuesUse: [],
        langLabelsUse: [],
      };

    const basicInfo: IBasicInfo = {
      username: data.user,
      level: makeLevel(data.total_xp),
      totalXp: data.total_xp,
      newXp: data.new_xp,
    };

    const sortedLanguages = Object.entries(data.languages)
      .sort(([, a], [, b]) => b.xps - a.xps)
      .reduce(
        (acc, [key, value]) => {
          if (value.xps > 3500) {
            acc.langLabels.push(key);
            acc.langXpValues.push(value.xps);
          } else {
            acc.othersXps += value.xps;
          }
          return acc;
        },
        {
          langLabels: [] as string[],
          langXpValues: [] as number[],
          othersXps: 0,
        }
      );

    sortedLanguages.langLabels.push("Others");
    sortedLanguages.langXpValues.push(sortedLanguages.othersXps);

    return {
      basicInfo,
      langXPValuesUse: sortedLanguages.langXpValues,
      langLabelsUse: sortedLanguages.langLabels,
    };
  }, [data, makeLevel]);

  useEffect(() => {
    axios
      .get<IData>("https://codestats.net/api/users/codequake")
      .then((response) => setData(response.data))
      .catch((error) =>
        console.error("Unable to fetch data from CodeStats.net", error)
      );
  }, []);

  const options: ApexOptions = useMemo(
    () => ({
      dataLabels: { enabled: false },
      fill: { type: "gradient" },
      theme: { palette: "palette10" },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        labels: { useSeriesColors: true },
        formatter: (legendName: string, opts?: any) =>
          `${legendName}: ${showNumAsThousand(
            opts.w.globals.series[opts.seriesIndex]
          )}`,
      },
      labels: langLabelsUse,
    }),
    [langLabelsUse]
  );

  if (!data) return <div>Loading...</div>;

  return (
    <div className="bg-[linear-gradient(71deg,#0c0a0e,#0025b9,#0c0a0e)] ml-5 w-[94%] mt-4 rounded-lg">
      <div className="h-[560px] w-full p-5">
        <div className={styles.userMeta}>
          <div className={styles.userInfoWrap}>
            <p className={styles.username}>CodeQuake</p>
            <p className={styles.userLevel}>{basicInfo.level}</p>
          </div>
          <div className={styles.totalXpWrap}>
            <p className={styles.totalXp}>
              {showNumAsThousand(basicInfo.totalXp)}
            </p>
            <p className={styles.newXp}>
              +{putCommasInBigNum(basicInfo.newXp)} XP
            </p>
          </div>
        </div>
        <hr />
        <div className="flex flex-col justify-center items-center h-fit mt-4">
          <div className={styles.languagePieChart}>
            <ReactApexChart
              options={options}
              series={langXPValuesUse}
              type="donut"
              width={460}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeStatsWidget;
