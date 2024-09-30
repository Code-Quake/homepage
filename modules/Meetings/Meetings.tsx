"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import parse, { Element } from "html-react-parser";
import { Spinner } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import {
  faCalendarWeek,
  faAnglesRight,
  faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Meetings.module.css";

interface IScripture {
  id: string;
  citation: string;
  text: string;
  reference: boolean;
}

const getWeek = function () {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const dayOfWeek = date.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysSinceYear = Math.round((date.getTime() - firstDayOfYear.getTime()) / 86400000);
  const weekNum = Math.ceil((daysSinceYear + daysToMonday) / 7);
  return weekNum;
};

const Meetings: React.FC = () => {
  const [meetings, setMeetings] = useState<string | null>(null);
  const [scriptureTips, setScriptureTips] = useState<(IScripture | null)[]>([]);
  const [weekNum, setWeekNum] = useState<number>(0);

  const { year } = useMemo(() => {
    const date = new Date();
    let week = getWeek();
    const currentDay = new Date().getDay();

    if ((currentDay > 2 && currentDay <= 6) || currentDay === 0)
      week = week + 1;

    setWeekNum(week);
    return {
      year: date.getFullYear(),
    };
  }, []);

  useEffect(() => {
    const fetchDailyText = async () => {
      try {
        const targetUrl = `/meetings/${year}/${weekNum}`;
        const response = await axios.get(targetUrl);
        const data = response.data;
        const $ = cheerio.load(data);
        let meetings = $("*")
          .find("#wrapper")
          .find("#regionMain")
          .find("#content")
          .find("#article")
          .find(".todayItems");

        const scripturePromises = meetings
          .find("a")
          .map(async (index, element) => {
            const scriptLink = $(element).attr("href")!.replace("/en/", "");

            if (
              scriptLink.indexOf("finder") > 0 ||
              scriptLink.indexOf("data-video") > 0 ||
              $(element).attr("class")?.includes("noTooltips")
            ) {
              return null;
            }

            try{
            const response = await axios.get("/scripture/" + scriptLink,{ maxRedirects: 0, beforeRedirect: ()=>{ return ""}});
            const test = response.data;

            if (test.items) {
              return {
                id: `sc${index}`,
                citation: test.items[0].title,
                text: test.items[0].content,
                reference: !!test.items[0].did,
              } as IScripture;
            }
          }
            catch(error: any)
            {
              return null;
            }
            return null;
          })
          .get();

        const scripts = (await Promise.all(scripturePromises)).filter(Boolean);
        setScriptureTips(scripts);

        meetings.find("a").each((index, element) => {
          $(element).attr(
            "href",
            `https://wol.jw.org${$(element).attr("href")}`
          );
          $(element).attr("id", `sc${index}`);
          $(element).attr("data", "replace");
        });

        meetings.find("img").each((index, element) => {
          $(element).attr("src", `https://wol.jw.org${$(element).attr("src")}`);
        });

        meetings.find("textArea").each((index, element) => {
          $(element).remove();
        });

        setMeetings($(meetings).html());
      } catch (error) {
        console.error("Error fetching daily text:", error);
      }
    };

    fetchDailyText();
  }, [year, weekNum]);

  if (!meetings) return <Spinner label="Loading" />;

  return (
    <div className="w-[calc(100%)] mx-auto relative">
      <div className="flex justify-center w-full items-center mt-2 mb-2">
        <span
          className="tooltip"
          data-tooltip="Previous Week"
          data-tooltip-position="left"
        >
          <FontAwesomeIcon
            onClick={() => setWeekNum(weekNum - 1)}
            icon={faAnglesLeft}
            role="button"
            aria-label="Previous Week"
            className="pl-2.5 text-xl text-[var(--primary)]"
          />
        </span>
        <span
          className="tooltip"
          data-tooltip="This Week"
          data-tooltip-position="bottom"
        >
          <FontAwesomeIcon
            onClick={() => setWeekNum(getWeek())}
            icon={faCalendarWeek}
            role="button"
            aria-label="This Week"
            className="pl-2.5 text-xl text-[var(--primary-fuchsia)]"
          />
        </span>
        <span
          className="tooltip"
          data-tooltip="Next Week"
          data-tooltip-position="right"
        >
          <FontAwesomeIcon
            onClick={() => setWeekNum(weekNum + 1)}
            icon={faAnglesRight}
            role="button"
            aria-label="Next Week"
            className="pl-2.5 text-xl text-[var(--primary)]"
          />
        </span>
      </div>
      <div className={styles.meetings}>
        {parse(meetings, {
          replace(domNode) {
            if (
              domNode instanceof Element &&
              domNode.attribs &&
              domNode.attribs.data === "replace"
            ) {
              const tip = scriptureTips.find(
                (item) => item!.id === domNode.attribs.id
              );
              const tipText = tip?.text
                .replaceAll('src="', 'src="https://wol.jw.org')
                .replaceAll('href="', 'href="https://wol.jw.org');
              const parsedTip = parse(tipText ?? "");
              if (tipText === undefined) {
                return (
                  <a href={domNode.attribs.href}>
                    {(domNode.children[0] as any).data
                      ? (domNode.children[0] as any).data
                      : (domNode.children[0] as any).children[0].data}
                  </a>
                );
              } else {
                return (
                  <Tooltip
                    content={parsedTip}
                    classNames={{
                      base: [
                        "before:bg-neutral-400 dark:before:bg-white h-fit max-h-60 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]",
                      ],
                      content: [
                        "py-2 px-4 shadow-xl",
                        "text-black bg-gradient-to-br from-[var(--accent-blue)] to-[var(--dark-blue)] w-fit w-min-20 max-w-96 overflow-auto",
                      ],
                    }}
                  >
                    <a href={domNode.attribs.href}>
                      {(domNode.children[0] as any).data
                        ? (domNode.children[0] as any).data
                        : (domNode.children[0] as any).children[0].data}
                    </a>
                  </Tooltip>
                );
              }
            }
          },
        })}
      </div>
    </div>
  );
};

export default React.memo(Meetings);
