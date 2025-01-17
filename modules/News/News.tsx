/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  useMemo,
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
} from "react";
import { RssFeed, IArticle, INewsCard2 } from "./NewsInterfaces";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Spinner } from "@nextui-org/react";
import { parseStringPromise } from "xml2js";
import ImageDisplay from "../ui/ImageDisplay";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as cheerio from "cheerio";
import parse, { Element } from "html-react-parser";

export const revalidate = 3600;

//TODO: get scriptures and pics working in JW news

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

const API_URL = "/news";

const extractContent = (
  htmlString: string
): { src?: string; description?: string } => {
  const srcRegex = /<img[^>]+src="([^">]+)"/;
  const pContentRegex = /<p[^>]*>(.*?)<\/p>/;
  const matchSrc = RegExp(srcRegex).exec(htmlString);
  const matchDesc = RegExp(pContentRegex).exec(htmlString);
  return {
    src: matchSrc ? matchSrc[1] : undefined,
    description: matchDesc ? matchDesc[1] : undefined,
  };
};

export function News() {
  const [newsCards, setNewsCards] = useState<INewsCard2[]>([]);
  const [isLoading, setLoading] = useState(true);

  const memoizedParseRssFeed = useMemo(
    () => async (xmlData: string) => {
      try {
        const result = await parseStringPromise(xmlData);
        return result.rss as RssFeed;
      } catch (error: any) {
        throw new Error(`Failed to parse RSS feed: ${error.message}`);
      }
    },
    []
  );

  function extractAfterNews(url: string): string {
    const regex = /news\/(.*)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  }

  const fetchData = useCallback(async () => {
    try {
      const [newsResponse, jwNewsResponse] = await Promise.all([
        fetch(API_URL),
        fetch("/jwnewsRSS"),
      ]);
      const { articles } = await newsResponse.json();
      const jwData = await jwNewsResponse.text();

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

      const jwDataResult = await memoizedParseRssFeed(jwData);
      for (let i = 0; i < 3; i++) {
        const item = jwDataResult.channel[0].item[i];
        const content = extractContent(item.description[0]);
        const storyLink = extractAfterNews(item.link[0]);
        const storyResponse = await fetch(`/jwnewsStory/${storyLink}`);
        const story = await storyResponse.text();

        const $ = cheerio.load(story);

        let storyContent = $("*")
          .find("#regionMain")
          .find(".wrapper")
          .find(".wrapperShadow")
          .find("#content")
          .find(".main-wrapper")
          .find("#article")
          .find(".docSubContent");

        newscards.push({
          id: newscards.length,
          title: item.title,
          description: content.description!,
          content: $(storyContent).html(), // content.description ? "" : item.description[0], // Only parse if needed
          src: content.src!.replace("sqs_sm", "lsr_xl"),
          ctaText: "JW.org",
          ctaLink: item.link,
          newsSource: "JW",
        });
      }

      setNewsCards(newscards);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }, [memoizedParseRssFeed]);

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
    <div className="h-[550px] pr-2 pl-2 w-full overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] relative">
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
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-gray-950 sm:rounded-3xl overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                {active.src && (
                  <ImageDisplay
                    imgSrc={active.src}
                    title={active.title}
                    width="w-full"
                    height="h-full"
                    imgClasses="sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                    divClasses="w-full h-80 lg:h-80"
                  />
                )}
                {!active.src && (
                  <FontAwesomeIcon
                    icon={faBan}
                    role="button"
                    className="pl-2.5 text-xl pr-2.5"
                  />
                )}
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
                      {active.description && parse(active.description)}
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
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 dark:text-[var(--primary)]"
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
      <ul className="w-full">
        {newsCards.map((card, index) => (
          <React.Fragment key={index}>
            <motion.div
              layoutId={`card-${index}`}
              key={`card-${index}`}
              onClick={() => setActive(card)}
              className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-950 dark:hover:bg-opacity-20 cursor-pointer w-full"
            >
              <div className="flex gap-4 flex-col md:flex-row">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  {card.src && (
                    <ImageDisplay
                      imgSrc={card.src}
                      title={card.title}
                      width="w-14"
                      height="h-14"
                      imgClasses="rounded-lg object-cover object-top"
                    />
                  )}
                  {!card.src && (
                    <FontAwesomeIcon
                      icon={faBan}
                      role="button"
                      className="pl-2.5 text-xl pr-2.5"
                    />
                  )}
                </motion.div>
                <div className="dark:hover:brightness-150">
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
                    {card.description && parse(card.description)}
                  </motion.p>
                </div>
              </div>
              <motion.a
                href={card.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                layoutId={`button-${card.id}-${id}`}
                className="px-[0.1rem] py-[0.1rem] text-sm rounded-full relative bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-fuchsia)] mt-4 md:mt-0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                  {card.ctaText}
                </div>
              </motion.a>
            </motion.div>
            <hr
              className="h-px bg-gray-200 border-0 dark:bg-gray-800"
              key={index}
            />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
