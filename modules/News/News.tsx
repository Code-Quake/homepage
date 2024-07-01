"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IArticle, INewsCard } from "./NewsInterfaces";
import { NewsStack } from "./NewsStack";
import { Spinner } from "@nextui-org/react";
import cheerio from "cheerio";

export const revalidate = 3600;

const API_URL = "https://localhost";

const fetchNews = async (): Promise<INewsCard[]> => {
  const [newsResponse, jwNewsResponse] = await Promise.all([
    fetch(API_URL),
    fetch("/jwnews"),
  ]);

  const { articles } = await newsResponse.json();
  const jwData = await jwNewsResponse.text();

  const newscards: INewsCard[] = articles.map(
    (article: IArticle, index: number) => ({
      id: index,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
    })
  );

  const $ = cheerio.load(jwData);

  $(".synopsis").each((index, element) => {
    if ($(element).find(".pubDate").length === 0) {
      const $element = $(element);
      const $link = $element.find("a");
      const url = $link.attr("href");
      $link.attr("href", `https://www.jw.org${url}`);

      const imgSrc = $element
        .find("span[data-img-size-md]")
        .attr("data-img-size-md");
      const title = $element.find("h3").text().trim();

      if (
        title !== "News" &&
        !$element.hasClass("outlier") &&
        !newscards.some((e) => e.title === title)
      ) {
        newscards.push({
          id: newscards.length,
          title,
          description: $element.find("p.desc").text().trim(),
          url: url as string,
          urlToImage: imgSrc?.trim() || "",
        });
      }
    }
  });

  return newscards;
};

export const NewsWidget: React.FC = () => {
  const [newsCards, setNewsCards] = useState<INewsCard[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const cards = await fetchNews();
      setNewsCards(cards);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <Spinner label="Loading" />;

  return (
    <div className="pb-2.5 w-[47vh] left-[190px] top-[20px] relative">
      <NewsStack
        items={newsCards}
        offset={14}
        scaleFactor={0.06}
        duration={60000}
      />
    </div>
  );
};

export default React.memo(NewsWidget);
