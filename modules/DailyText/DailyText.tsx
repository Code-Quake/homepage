"use client";
import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import axios from "axios";
import cheerio from "cheerio";
import parse from "html-react-parser";
import { Vortex } from "../ui/Vortex";
import { Spinner } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";

interface IScripture {
  id: string;
  citation: string;
  text: string;
}
const DailyText: React.FC = () => {
  const [dailyText, setDailyText] = useState<string | null>(null);
  const [scriptureTips, setScriptureTips] = useState<IScripture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { today, todayTFormat } = useMemo(() => {
    const date = new Date();
    return {
      today: date.toISOString().slice(0, 10).replace(/-/g, "/"),
      todayTFormat: date.toISOString().split("T")[0],
    };
  }, []);

  const fetchDailyText = useCallback(async () => {
    try {
      let scripts: IScripture[] = [];
      const targetUrl = `/text/${today}`;
      let { data } = await axios.get(targetUrl);
      const $ = cheerio.load(data);
      const element = $(`[data-date="${todayTFormat}T00:00:00.000Z"]`);

      $(element)
        .find("a")
        .each((index, element) => {
          //to get scripture in json format just remove the /en from the link
          const scriptLink = $(element).attr("href")!.replace("/en/", "");
          axios.get("/scripture/" + scriptLink).then((response) => {
            let test = response.data;

            if (test.items) {
              let script: IScripture = {
                id: `sc${index}`,
                citation: test.items[0].title,
                text: test.items[0].content,
              };

              scripts.push(script);
            }
            setScriptureTips(scripts);
          });

          $(element).attr(
            "href",
            `https://wol.jw.org${$(element).attr("href")}`
          );
          $(element).attr("id", `sc${index}`);
          $(element).attr("data", "replace");
        });

      setDailyText(element.html() || null);
    } catch (error) {
      console.error("Error fetching daily text:", error);
      setDailyText(null);
    }
  }, [today, todayTFormat]);

  useEffect(() => {
    fetchDailyText();
    setIsLoading(false);
  }, [fetchDailyText]);

  if (isLoading) return <Spinner label="Loading" />;

  return (
    <div className="w-[calc(100%)] mx-auto overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <div className="dailyText">
          {dailyText
            ? parse(dailyText, {
                replace(domNode) {
                  if (domNode.attribs && domNode.attribs.data === "replace") {
                    const tip = scriptureTips.find(
                      (item) => item.id === domNode.attribs.id
                    );
                    const parsedTip = parse(tip?.text || "");
                    return (
                      <Tooltip
                        content={parsedTip}
                        style={{ width: "300px" }}
                        classNames={{
                          base: [
                            // arrow color
                            "before:bg-neutral-400 dark:before:bg-white",
                          ],
                          content: [
                            "py-2 px-4 shadow-xl",
                            "text-black bg-gradient-to-br from-slate-600 to-slate-900",
                          ],
                        }}
                      >
                        <a href={domNode.attribs.href}>
                          {domNode.children[0].data
                            ? domNode.children[0].data
                            : domNode.children[0].children[0].data}
                        </a>
                      </Tooltip>
                    );
                  }
                },
              })
            : "Loading..."}
        </div>
      </Vortex>
    </div>
  );
};

export default memo(DailyText);
