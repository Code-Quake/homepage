"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import cheerio from "cheerio";
import parse, { Element } from "html-react-parser";
import { Spinner } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";

interface IScripture {
  id: string;
  citation: string;
  text: string;
  reference: boolean;
}

const getWeek = function () {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

const Meetings: React.FC = () => {
  const [meetings, setMeetings] = useState<string | null>(null);
  const [scriptureTips, setScriptureTips] = useState<(IScripture | null)[]>([]);

  const { year, weekNum } = useMemo(() => {
    const date = new Date();
    return {
      year: date.getFullYear(),
      weekNum: getWeek(),
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
            
            if(scriptLink.indexOf("finder") > 0 || $(element).attr("class")?.includes("noTooltips")){
              return null;
            }

            const response = await axios.get("/scripture/" + scriptLink);
            const test = response.data;

            if (test.items) {
              return {
                id: `sc${index}`,
                citation: test.items[0].title,
                text: test.items[0].content,
                reference: !!test.items[0].did,
              } as IScripture;
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
    <div className="w-[calc(100%)] mx-auto overflow-hidden">
      <div className="meetings">
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
              const tipText = tip?.text.replace(
                'src="',
                'src="https://wol.jw.org'
              );
              const parsedTip = parse(tipText ?? "");
              const width = tip?.reference ? "100rem" : "300px";
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
                    style={{ width: width }}
                    classNames={{
                      base: ["before:bg-neutral-400 dark:before:bg-white"],
                      content: [
                        "py-2 px-4 shadow-xl",
                        "text-black bg-gradient-to-br from-slate-600 to-slate-900",
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
