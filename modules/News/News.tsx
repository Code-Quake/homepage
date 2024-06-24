"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IResponse, INewsCard, IArticle } from "./NewsInterfaces";
import { NewsStack } from "./NewsStack";
import { subtractHours } from "@/utils/MiscHelpers";

export const NewsWidget = () => {
  const [cards, setCards] = useState<INewsCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const wasAlreadyRequested = useRef(false);

  //https://newsapi.org/v2/top-headlines?country=us&apiKey=ff210d65225e4bb2b1426f293ba2a04f

  const API_URL =
    "https://newsapi.org/v2/top-headlines?sources=cnn&apiKey=ff210d65225e4bb2b1426f293ba2a04f";

  useEffect(() => {
    if (wasAlreadyRequested.current) {
      return;
    }

    wasAlreadyRequested.current = true;

    let refresh = false;
    const value = localStorage.getItem("newsDate");

    if (!value) {
      localStorage.setItem("newsDate", new Date().toString());
      refresh = true;
    } else {
      const oldDate = new Date(value);
      if (oldDate <= subtractHours(new Date(), 6)) {
        refresh = true;
      }
    }

    if (refresh) {
      axios
        .get<IResponse>(API_URL)
        .then((response) => {
          const data = response.data;

          const newscards = data.articles.map((article, index) => ({
            id: index,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
          }));

          setCards(newscards);

          localStorage.setItem("newsDate", new Date().toString());
          localStorage.setItem("newsData", JSON.stringify(data));

          setLoading(false);
        })
        .catch((dataFetchError) => {
          console.error(
            "Unable to fetch data from newsapi. Error: ",
            dataFetchError
          );
        });
    } else {
      const value = localStorage.getItem("newsData") as string;

      const data = JSON.parse(value);

      const newscards = data.articles.map(
        (article: IArticle, index: number) => ({
          id: index,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
        })
      );

      setCards(newscards);

      setLoading(false);
    }
  }, [wasAlreadyRequested]);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!loading) {
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
          items={cards}
          offset={14}
          scaleFactor={0.06}
          duration={60000}
        />
      </div>
    );
  }
};

export default NewsWidget;
