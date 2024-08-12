/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import parse from "html-react-parser";
import { IArticle, INewsCard2 } from "./NewsInterfaces";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Spinner } from "@nextui-org/react";
import { parseStringPromise } from "xml2js";

export const revalidate = 3600;

function throttle<T extends (...args: any[]) => Promise<any>>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]): Promise<any> {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      return func.apply(this, args);
    }
    return Promise.resolve(); // Return a resolved promise if throttled
  } as T;
}

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

interface RssFeed {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RssItem[];
  }[];
}

const API_URL = "https://localhost";

function extractImgSrc(htmlString: string): string | null {
  const srcRegex = /<img[^>]+src="([^">]+)"/;
  const match = RegExp(srcRegex).exec(htmlString);
  return match ? match[1] : null;
}

function extractPContent(htmlString: string): string | null {
  const pContentRegex = /<p[^>]*>(.*?)<\/p>/;
  const match = RegExp(pContentRegex).exec(htmlString);
  return match ? match[1] : null;
}

const fetchNews = async (): Promise<INewsCard2[]> => {
  const [newsResponse, jwNewsResponse] = await Promise.all([
    fetch(API_URL),
    fetch("/jwnewsRSS"),
  ]);

  const { articles } = await newsResponse.json();
  const jwData = await jwNewsResponse.text();

  console.log(jwData);

  const newscards: INewsCard2[] = articles.map(
    (article: IArticle, index: number) => ({
      id: index,
      title: article.title,
      description: article.description,
      content: article.content,
      src: article.urlToImage,
      ctaText: "CNN",
      ctaLink: article.url,
      newsSource: "CNN",
    })
  );

  const jwDataResult: RssFeed = await parseRssFeed(jwData);

  for (let i = 0; i < 3; i++) {
    const item = jwDataResult.channel[0].item[i];
    const imgSrc = extractImgSrc(item.description[0]);
    const desc = extractPContent(item.description[0]);
    newscards.push({
      id: newscards.length,
      title: item.title,
      description: desc!,
      content: "",
      src: imgSrc!.replace("sqs_sm", "lsr_xl"),
      ctaText: "JW.org",
      ctaLink: item.link,
      newsSource: "JW",
    });
  }

  return newscards;
};

async function parseRssFeed(xmlData: string): Promise<RssFeed> {
  try {
    const result = await parseStringPromise(xmlData);
    return result.rss as RssFeed;
  } catch (error: any) {
    throw new Error(`Failed to parse RSS feed: ${error.message}`);
  }
}

export function News() {
  const [newsCards, setNewsCards] = useState<INewsCard2[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const cards = throttle(fetchNews, 5000);
      cards().then((result) => setNewsCards(result));
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [active, setActive] = useState<
    (typeof newsCards)[number] | boolean | null
  >(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (isLoading) return <Spinner label="Loading" />;

  return (
    <div
      style={{ height: "550px", overflow: "scroll", position: "relative" }}
      className="newsscroll"
    >
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-gray-950 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-[var(--primary-dark)] dark:text-[var(--primary-dark)]"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-[var(--primary)]"
                    >
                      {parse(active.description)}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-[0.1rem] py-[0.1rem] text-sm rounded-full relative bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-fuchsia)]  mt-4 md:mt-0 ml-1"
                  >
                    <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                      {active.ctaText}
                    </div>
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-[var(--primary)] [mask:linear-gradient(to_bottom,white,white,transparent)]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : parse(active.content)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {newsCards.map((card, index) => (
          <>
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={`card-${card.title}-${id}`}
              onClick={() => setActive(card)}
              className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer"
            >
              <div className="flex gap-4 flex-col md:flex-row ">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  <img
                    width={100}
                    height={100}
                    src={card.src}
                    alt={card.title}
                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                  />
                </motion.div>
                <div className="">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-medium text-[var(--primary-dark)] dark:text-[var(--primary-dark)] text-center md:text-left text-sm"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.description}-${id}`}
                    className="text-neutral-600 dark:text-[var(--primary)] text-center md:text-left text-sm"
                  >
                    {parse(card.description)}
                  </motion.p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${card.title}-${id}`}
                className="px-[0.1rem] py-[0.1rem] text-sm rounded-full relative bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-fuchsia)]  mt-4 md:mt-0"
              >
                <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                  {card.ctaText}
                </div>
              </motion.button>
            </motion.div>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-800" />
          </>
        ))}
      </ul>
    </div>
  );
}
