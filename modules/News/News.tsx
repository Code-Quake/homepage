"use client";

import React, { useMemo } from "react";
import { INewsCard, IArticle } from "./NewsInterfaces";
import { NewsStack } from "./NewsStack";
import { fetcher } from "@/utils/MiscHelpers";
import useSWR from "swr";
import { Spinner } from "@nextui-org/react";

export const revalidate = 3600;

const API_URL = "https://localhost";

function useNews() {
  const { data, error, isLoading } = useSWR<{ articles: IArticle[] }>(
    API_URL,
    fetcher
  );

  const newscards = useMemo(() => {
    if (!data) return null;
    return data.articles.map((article, index) => ({
      id: index,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
    }));
  }, [data]);

  return {
    cards: newscards,
    isLoading,
    isError: error,
  };
}

export const NewsWidget: React.FC = () => {
  const { cards, isLoading, isError } = useNews();

  if (isLoading) return <Spinner label="Loading" />;
  if (isError) return <div className="px-5 text-red-900">Error</div>;

  return (
    <div className="pb-2.5 w-[47vh] left-[180px] top-[20px] relative">
      {cards && (
        <NewsStack
          items={cards}
          offset={14}
          scaleFactor={0.06}
          duration={60000}
        />
      )}
    </div>
  );
};

export default React.memo(NewsWidget);
