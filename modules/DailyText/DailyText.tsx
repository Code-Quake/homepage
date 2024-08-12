"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import parse, { Element } from "html-react-parser";
import { Vortex } from "../ui/Vortex";
import { Spinner } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";

interface IScripture {
  id: string;
  citation: string;
  text: string;
  reference: boolean;
}

const DailyText: React.FC = () => {
  const [dailyText, setDailyText] = useState<string | null>(null);
  const [scriptureTips, setScriptureTips] = useState<(IScripture | null)[]>([]);

  const { today, todayTFormat } = useMemo(() => {
    const date = new Date();
    return {
      today: date.toISOString().slice(0, 10).replace(/-/g, "/"),
      todayTFormat: date.toISOString().split("T")[0],
    };
  }, []);

  useEffect(() => {
    const fetchDailyText = async () => {
      try {
        const targetUrl = `/text/${today}`;
        const response = await axios.get(targetUrl);
        const data = response.data;
        const $ = cheerio.load(data);
        const element = $(`[data-date="${todayTFormat}T00:00:00.000Z"]`);

        const scripturePromises = element
          .find("a")
          .map(async (index, element) => {
            const scriptLink = $(element).attr("href")!.replace("/en/", "");
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

        element.find("a").each((index, element) => {
          $(element).attr(
            "href",
            `https://wol.jw.org${$(element).attr("href")}`
          );
          $(element).attr("id", `sc${index}`);
          $(element).attr("data", "replace");
        });

        setDailyText(element.html() ?? null);
      } catch (error) {
        console.error("Error fetching daily text:", error);
        setDailyText(null);
      }
    };

    fetchDailyText();
  }, [today, todayTFormat]);

  if (!dailyText || scriptureTips.length === 0)
    return <Spinner label="Loading" />;

  return (
    <div
      className="w-[calc(100%)] mx-auto overflow-hidden rounded-3xl"
      style={{ position: "relative" }}
    >
      <div className="dailyText p-5">
        {parse(dailyText, {
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

export default React.memo(DailyText);
