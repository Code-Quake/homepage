"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import parse, { Element } from "html-react-parser";
import { Spinner } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";

interface IScripture {
  id: string;
  citation: string;
  text: string;
  reference: boolean;
}

//download from wol to public.

interface Entry {
  scripture: string;
  reference: string;
  content: string;
}

function parseData(text: string): Entry[] {
  const entries: Entry[] = [];
  const lines = text.split("\n");
  let currentEntry: Partial<Entry> = {};

  for (const line of lines) {
    if (line.trim() === "") continue;

    if (line.startsWith("*") && line.endsWith("*")) {
      // Scripture and reference
      const parts = line.slice(1, -1).split("—");
      if (parts.length === 2) {
        if (currentEntry.scripture) {
          entries.push(currentEntry as Entry);
          currentEntry = {};
        }
        currentEntry.scripture = parts[0].trim();
        currentEntry.reference = parts[1].trim();
      }
    } else if (currentEntry.scripture) {
      // Content
      currentEntry.content = (currentEntry.content || "") + line.trim() + " ";
    }
  }

  // Add the last entry
  if (currentEntry.scripture) {
    entries.push(currentEntry as Entry);
  }

  return entries;
}

// Usage example
// const rawData = `*If any man thinks he is a worshipper of God but does not keep a tight rein on his tongue, he is deceiving his own heart, and his worship is futile.—* *Jas. 1:26* *.* When we use the gift of speech well, we identify ourselves as worshippers of Jehovah. We help those around us to see clearly the difference "between one serving God and one not serving him." (Mal. 3:18) Consider how this proved to be true for a sister named Kimberly. She was assigned to work with a classmate on a high-school project. After working together, the classmate noticed that Kimberly was different from other students. She did not criticize people behind their back, she spoke in a positive way, and she did not use profanity. Kimberly's classmate was intrigued and eventually agreed to a Bible study. How pleased Jehovah is when we speak in a way that attracts people to the truth! We all want to speak in a way that brings honor to Jehovah. *w22.04* 5-6 ¶5-7 

// *Women... were ministering to them from their belongings.—* *Luke 8:3* *.* Jesus freed Mary Magdalene from the influence of seven demons! Her gratitude moved her to become his follower and to support him in the ministry. (Luke 8:1-3) Although Mary deeply appreciated what Jesus did for her personally, she may not have grasped that his greatest gift was yet to come. He would give his life "so that everyone exercising faith in him" could enjoy everlasting life. (John 3:16) Still, Mary showed her appreciation for Jesus by being loyal. While Jesus was suffering on the torture stake, Mary stood nearby, providing emotional support to him and to others. (John 19:25) After Jesus died, Mary and two other women brought spices to the tomb for his burial. (Mark 16:1, 2) Mary had the joy of meeting the resurrected Jesus and of speaking with him—a privilege that most disciples did not have.—John 20:11-18. *w23.01* 27 ¶4`;

// const parsedData = parseData(rawData);
// console.log(JSON.stringify(parsedData, null, 2));

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
        <div className="dailyText">
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

export default React.memo(DailyText);
