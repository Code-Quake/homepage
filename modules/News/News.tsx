"use client";
import React from "react";
import { INewsCard, IArticle } from "./NewsInterfaces";
import { NewsStack } from "./NewsStack";
import { fetcher } from "@/utils/MiscHelpers";
import useSWR from "swr";
import { Spinner } from "@nextui-org/react";

export const revalidate = 3600;
 
const API_URL = "https://localhost";

function useNews() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher);

  let newscards: INewsCard[] | null = null;

  if (!isLoading) {
    newscards = data.articles.map((article: IArticle, index: number) => ({
      id: index,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
    }));
  }

  return {
    cards: newscards,
    isLoading,
    isError: error,
  };
}

export const NewsWidget = () => {
  const { cards, isLoading, isError } = useNews();

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error</div>;

  return (
    <div
      style={{
        paddingBottom: "10px",
        width: "47vh",
        left: "180px",
        top: "20px",
        position: "relative",
      }}
    >
      <NewsStack
        items={cards!}
        offset={14}
        scaleFactor={0.06}
        duration={60000}
      />
    </div>
  );
};

export default NewsWidget;
