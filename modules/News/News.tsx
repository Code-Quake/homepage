"use client";

import React, {
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { IArticle, INewsCard } from "./NewsInterfaces";
import { NewsStack } from "./NewsStack";
import { fetcher } from "@/utils/MiscHelpers";
import useSWR from "swr";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import cheerio from "cheerio";

export const revalidate = 3600;

const API_URL = "https://localhost";

async function getNews(): Promise<INewsCard[]> {
  const newscards1 = await fetch(API_URL);
  const data = await newscards1.json();
  const newscards = await data.articles.map(
    (article: IArticle, index: number) => ({
      id: index,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
    })
  );

  const jwnewscards = await fetch("/jwnews");
  const jwdata = await jwnewscards.text();

  const $ = cheerio.load(jwdata);

  $(".synopsis").each((index, element) => {
    let newsItem = {
      id: index,
      title: "",
      description: "",
      url: "",
      urlToImage: "",
    };
    const testDate = $(element).find(".pubDate");
    if (testDate.length === 0) {
      $(element)
        .find("a")
        .each((index, element) => {
          newsItem.url = element.attribs["href"];
          $(element).attr(
            "href",
            `https://www.jw.org${$(element).attr("href")}`
          );
        });
      let imgSrc: string | undefined = "";
      $(element)
        .find("span[data-img-size-md]")
        .each((index, element) => {
          imgSrc = element.attribs["data-img-size-md"];
        });

      const testNews = $(element).find("h3").text();

      if (
        !newscards.some(
          (e: INewsCard) => e.title === $(element).find("h3").text().trim()
        )
      ) {
        if (testNews.trim() !== "News" && !$(element).hasClass("outlier")) {
          newsItem.urlToImage = imgSrc.trim();
          newsItem.description = $(element).find("p").text().trim();
          newsItem.title = $(element).find("h3").text().trim();
          newsItem.url = $(element).find("a").attr("href") as string;

          if (!newscards.includes(newsItem)) {
            newscards.push(newsItem);
          }
        }
      }
    }
  });

  return newscards;
}

export const NewsWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const cardsRef = useRef<INewsCard[]>();

  useEffect(() => {
    const fetchData = async () => {
      cardsRef.current = await getNews();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) return <Spinner label="Loading" />;

  return (
    <div className="pb-2.5 w-[47vh] left-[180px] top-[20px] relative">
      {cardsRef.current && (
        <NewsStack
          items={cardsRef.current}
          offset={14}
          scaleFactor={0.06}
          duration={60000}
        />
      )}
    </div>
  );
};

export default React.memo(NewsWidget);
