"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { INewsCard } from "./NewsInterfaces";

let interval: any;

type Card = {
  id: 1;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
};

export const NewsStack = ({
  items,
  offset,
  scaleFactor,
  duration,
}: {
  items: INewsCard[];
  offset?: number;
  scaleFactor?: number;
  duration: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<INewsCard[]>(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: INewsCard[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, duration);
  };

  const nextCard = () => {
    setCards((prevCards: INewsCard[]) => {
      const newArray = [...prevCards]; // create a copy of the array
      newArray.unshift(newArray.pop()!); // move the last element to the front
      return newArray;
    });
  };

  return (
    <>
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute weather-data-card h-[25rem] rounded-3xl p-3 shadow-md border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col items-center"
            style={{
              transformOrigin: "left center",
              width: "65%",
            }}
            animate={{
              left: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
            onTap={nextCard}
          >
            <div className="relative" style={{ left: "10%" }}>
              <h2 className="font-medium todayDescription mb-4 mt-2">
                <img src={card.urlToImage} alt="News Card" width={"80%"} />
              </h2>
            </div>
            <h2 className="text-base newsTitle mb-2">
              <Link href={card.url} target="_blank">
                {card.title}
              </Link>
            </h2>
            <div className="newsDescription text-sm">
              {card.description}              
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
