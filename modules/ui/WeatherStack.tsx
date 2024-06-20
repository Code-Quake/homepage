"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval: any;

type Card = {
  id: number;
  name: string;
  rightContent: React.ReactNode;
  leftContent: React.ReactNode;
};

export const WeatherStack = ({
  items,
  offset,
  scaleFactor,
  duration
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  duration: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, duration);
  };

  const nextCard = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards]; // create a copy of the array
      newArray.unshift(newArray.pop()!); // move the last element to the front
      return newArray;
    });
  };

  return (
    <div className="relative  h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute weather-data-card h-50 w-60 md:h-50 md:w-96 rounded-3xl p-4 shadow-md border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
            onTap={nextCard}
          >
            <div className="p-3 flex flex-col justify-between rounded-3xl">
              <h2 className="font-medium todayDescription mb-4">{card.name}</h2>
              <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between ">
                <div className="grid grid-cols-1 grid-rows-3">
                  {card.rightContent}
                </div>
                {card.leftContent}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
